import {Component} from "./component";
import {Transform} from "./transform";
import {TypeOf, TypeOf1} from "../i_typeof";
import {HexRuntime} from "./runtime";
import {MathUtil} from "../math/math_util";
import {Vector2} from "../math/vector2";
import {Rectangle} from "../geometry/rectangle";
import {HexApplication} from "../hex_application";
import {ContentBox} from "../components/content_box";

export const enum EntityFlag {
    ShadowElement = 1 << 0,
    ShadowRoot = 1 << 1,
    TransformDirty = 1 << 2,
    Transform3D = 1 << 3,
    ParentActive = 1 << 4,
    SelfActive = 1 << 5,
    Active = SelfActive | ParentActive,
    Destroyed = 1 << 6,
    Awake = 1 << 7
}

export class Entity {

    public id : EntityId;
    public name : string; //make this an index into a map so we can store this in a typed array
    public depth : number;  //remove
    public siblingIndex : number;   //remove
    public application : HexApplication; //remove this, work app id into entity id
    public transform : Transform;
    public contentBox : ContentBox;
    public parent : Entity;
    public traversalIdx : integer; //todo remove this

    protected flags : EntityFlag; //todo merge sibling index, id, appId, flags, and depth
    /** @internal */
    public children : this[];    //change to an index or offset and a count
    protected components : Component[]; //make this a a typeid / index pair
    //todo --> flags
    public isParentActive : boolean;
    public isSelfActive : boolean;

    constructor(name = "App Entity", parent : Entity = null) {
        (this as any).id = 0;
        this.depth = 0;
        this.siblingIndex = 0;
        this.application = null;
        this.name = name;
        this.components = [];
        this.children = [];
        (this as any).parent = parent;
        this.transform = null;
        this.contentBox = null;
        this.flags = EntityFlag.Active;
        this.isParentActive = true;
        this.isSelfActive = true;
        this.traversalIdx = 0;
        this.initialize();
    }

    protected initialize() {
        this.application = HexRuntime.getCurrentApp();
        if(this.parent === null) {
            this.parent = this.application.getRootEntity();
            // this.transform.setParent(this)
            // this.contentBox.setParent(this.parent.contentBox);
        }
        this.transform = new Transform(this);
        this.contentBox = new ContentBox(this);
        this.parent.children.push(this);
        this.siblingIndex = this.parent.children.length - 1;
        this.depth = this.parent.depth + 1;
        this.isParentActive = this.parent.getActive();

        this.application.addEntity(this);
    }

    public setActive(isActive : boolean) : void {
        var wasActive = this.getActive();
        this.isSelfActive = isActive;
        if (wasActive !== this.isSelfActive) {
            if (this.isSelfActive) {
                this.application.enableEntity(this);
            }
            else {
                this.application.disableEntity(this);
            }
            for (let i = 0; i < this.children.length; i++) {
                this.children[i].setParentActive(this.getActive());
            }
        }
    }

    private setParentActive(isParentActive : boolean) : void {
        this.isParentActive = isParentActive;
        //if parent became active and we were also active, enable
        //if parent became active and we were inactive, nothing
        //if parent became inactive and we were also inactive, nothing
        //if parent became inactive and we were active, disable
        if (this.isSelfActive && isParentActive) {
            this.application.enableEntity(this);
        }
        else if (this.isSelfActive && !isParentActive) {
            this.application.disableEntity(this);
        }
        else {
            return;
        }

        for (let i = 0; i < this.children.length; i++) {
            this.children[i].setParentActive(this.getActive());
        }

    }

    public getActive() {
        return this.isParentActive && this.isSelfActive;
    }

    public getSelfActive() {
        return this.isSelfActive;
    }

    public get bounds() : Rectangle {
        const position = this.transform.getWorldPosition(Vector2.scratch0);
        return new Rectangle(
            position.x,
            position.y,
            this.contentBox.getWidth(),
            this.contentBox.getHeight()
        );
    }

    public addChild(child : this) : this {
        if (child === null || child.isAncestorOf(this)) {
            return null;
        }
        this.children.push(child);
        child.siblingIndex = this.children.length - 1;
        this.changeParent(child);

        return child;
    }

    public insertChild(child : this, index : number) : this {
        index = MathUtil.clamp(index, 0, this.children.length);
        if (child === null || this.children[index] === child || child.isAncestorOf(this)) {
            return null;
        }

        if (child.parent === this) {
            this.removeAndSetIndex(child);
            this.insertAndSetIndex(child, index);
            //todo -- onChildMoved?
        }
        else {
            this.insertAndSetIndex(child, index);
            this.changeParent(child);
        }

        for(let i = 0; i < this.components.length; i++) {
            this.components[i].onChildMoved(child, index);
        }

        this.application.insertEntity(child, this, index);

        return child;
    }

    public setParent(parent : Entity) : Entity {
        if (parent === null || parent === void 0) {
            parent = this.application.getRootEntity();
        }
        parent.addChild(this);
        return parent;
    }

    public isDescendantOf(other : Entity) {
        return other.isAncestorOf(this);
    }

    public isAncestorOf(target : Entity) : boolean {
        let ptr = target.parent;
        while (ptr !== null) {
            if (ptr === this) {
                return true;
            }
            ptr = ptr.parent;
        }
        return false;
    }

    public getChildren(out? : Array<Entity>) : Array<Entity> {
        if (out) {
            out.length = this.children.length;
        }
        else {
            out = new Array<Entity>(this.children.length);
        }
        for (let i = 0; i < out.length; i++) {
            out[i] = this.children[i];
        }
        return out;
    }

    public getChildAt(index : number) : this {
        return this.children[index];
    }

    public getChildByName(name : string) : this {
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i].name === name) {
                return this.children[i];
            }
        }
        return null;
    }

    public get childCount() : number {
        return this.children.length;
    }

    public addComponent<T extends Component>(ComponentType : TypeOf1<T, Entity>, options : Partial<T> = null) : T {
        const component = new ComponentType(this);
        this.components.push(component as any);
        this.application.addComponent(component as any);
        if (options !== null) {
            for (var p in options) {
                component[p] = options[p];
            }
        }
        return component;
    }

    public removeComponent(component : Component) : Component {
        if(this.components.remove(component)) {
            component.onDestroy();
            this.application.removeComponent(component);
            return component;
        }
        return null;
    }

    public getComponent<T extends Component>(type : TypeOf1<T, Entity>) : T {
        for (let i = 0; i < this.components.length; i++) {
            if (this.components[i] instanceof type) {
                return this.components[i] as T; //why do I need the cast?
            }
        }
        return null;
    }

    //Returns all components of Type type in the GameObject
    public getComponents<T extends Component>(type : TypeOf<T>, storage? : Array<T>) : Array<T> {
        storage = storage || new Array<T>();
        for (let i = 0; i < this.components.length; i++) {
            if (this.components[i] instanceof type) { //todo check for !destroyed
                storage.push(this.components[i] as T);
            }
        }
        return storage;
    }

    public getComponentInChildren<T extends Component>(type : TypeOf<T>) : T {
        var cmp = this.getComponent(type);
        if (cmp) return cmp;
        for (let i = 0; i < this.children.length; i++) {
            cmp = this.children[i].getComponent(type);
            if (cmp) return cmp;
        }
        return null;
    }

    //Returns all components of Type in the entity in it's direct children
    public getComponentsInChildren<T extends Component>(type : TypeOf<T>, storage? : Array<T>) : Array<T> {
        const retn = this.getComponents(type, storage);
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].getComponents(type, retn);
        }
        return retn;
    }

    public getComponentsInDescendants<T extends Component>(type : TypeOf<T>, storage? : Array<T>) : Array<T> {
        const retn = this.getComponents(type, storage);
        const childCount = this.children.length;
        for (let i = 0; i < childCount; i++) {
            this.children[i].getComponentsInDescendants(type, retn);
        }
        return retn;
    }

    public getComponentInAncestors<T extends Component>(type : TypeOf<T>) : T {
        var cmp = this.parent.getComponent(type);
        if (cmp === null) {
            cmp = this.parent.getComponentInAncestors(type);
        }
        return cmp;
    }

    public getComponentInParent<T extends Component>(type : TypeOf<T>) : T {
        return this.parent ? this.parent.getComponent(type) : null;
    }

    public getComponentsInParent<T extends Component>(type : TypeOf<T>, storage? : Array<T>) : Array<T> {
        return this.parent ? this.parent.getComponents(type, storage) : (storage || []);
    }

    public getOrCreateComponent<T extends Component>(type : TypeOf<T>) {
        return this.getComponent(type) || this.addComponent(type);
    }

    public getAllComponents() : ReadonlyArray<Component> {
        return this.components as ReadonlyArray<Component>;
    }

    public clearChildren() : void {
        throw new Error("Not Implemented");
        // for (let i = 0; i < this.children.length; i++) {
        //     const child = this.children[i];
        //     let currentPosition = child.transform.getWorldPosition(Vector2.scratch0);
        //     child.parent = null;
        //     child.transform.parent = null;
        //     child.transform.setPositionValues(currentPosition.x, currentPosition.y, Space.World);
        // }
        // this.children.length = 0;
    }

    public destroy() : void {
        this.flags |= EntityFlag.Destroyed;
    }

    private insertAndSetIndex(child : this, index : number) {
        let i = this.children.length;
        this.children.length++;
        const length = this.children.length;
        const children = this.children;
        if (index >= length) {
            const lengthMinus1 = length - 1;
            children[lengthMinus1] = child;
            children[lengthMinus1].siblingIndex = lengthMinus1;
            return;
        }
        while (i !== index) {
            children[i] = children[--i];
            children[i].siblingIndex = i;
        }
        children[index] = child;
        children[index].siblingIndex = index;
    }

    private removeAndSetIndex(child : this) : void {
        const length = this.children.length - 1;
        const children = this.children;
        for (let i = 0; i < length; i++) {
            if (children[i] === child) {
                while (i < length) {
                    children[i] = children[i + 1];
                    children[i].siblingIndex = i;
                    i++
                }
                break;
            }
        }
        children.length--;
    }

    private changeParent(child : this) {
        const oldParent = child.parent;
        const oldComponents = oldParent.components;
        oldParent.children.remove(child);

        child.parent = this;
        child.transform.setParent(this.transform);
        child.contentBox.setParent(this.contentBox);
        child.setDepth(this.depth + 1);

        //todo this can be deferred possibly
        //todo these loops may be better handled by the application
        //so that it can decide what to do
        for (let i = 0; i < oldParent.children.length; i++) {
            oldParent.children[i].siblingIndex = i;
        }

        for (let i = 0; i < oldComponents.length; i++) {
            oldComponents[i].onChildRemoved(child);
        }

        for (let i = 0; i < this.components.length; i++) {
            this.components[i].onChildAdded(child);
        }

        for (let i = 0; i < child.components.length; i++) {
            child.components[i].onParentChanged(this, oldParent);
        }

        this.application.setEntityParent(child, this, oldParent);
        child.setParentActive(this.getActive());
    }

    private setDepth(value : number) {
        this.depth = value;
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].setDepth(this.depth + 1);
        }
    }
}

//need this or include order gets borked because of app.ts asking for files in a bad order
export {RootEntity} from "./root_entity";
