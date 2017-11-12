import {StateTree} from "./state_tree";

export type ValueChangeHandler = <T>(ref? : StateTreeNode) => any;
export type ChildAddedHandler = <T>(childRef : StateTreeNode, ref? : StateTreeNode) => any;
export type ChildRemovedHandler = <T>(childRef : StateTreeNode, ref? : StateTreeNode) => any;
// export type ChildMovedHandler = <T>(childRef : T, oldValue? : T, ref? : DataTreeNode) => any;
export type ValueSetHandler = <T>(ref? : StateTreeNode) => any;
export type ValueUnsetHandler = <T>(ref? : StateTreeNode) => any;

enum ChangeHandlerType {
    ChildAdded,
    ChildRemoved,
    ChildMoved,
    ValueSet,
    ValueUnset,
    ValueChange,
    Move
}

class ChangeHandler {

    public readonly context : object;
    public readonly type : ChangeHandlerType;
    public readonly fn : Function;

    constructor(type : ChangeHandlerType, fn : Function) {
        this.type = type;
        this.fn = fn;
    }

}

export const enum ValueType {
    None, Primitive, Array, Object, Reference
}

/*
pattern should be:
    /bucket-name/instance-id/property-name/value or pointer to other path

There is a difference between data binding and serializing
but both can be built off of the state tree

For data binding ->
    since we know all object roots
    and all binding works via paths
    we can trace the bindings each frame
    and w

Prototype this:
    All setters are only flushed at end of frame
    All getters return cached frame value
    All handlers are only flushed at start of frame
    Track each frame's changes
 */

//note -- this.value is ONLY ever going to be a primitive value, all other values are computed
export class StateTreeNode {

    public readonly key : string;
    public readonly basepath : string;

    protected valueType : ValueType;
    protected children : Array<StateTreeNode>;
    protected value : number | string | boolean;

    protected parent : StateTreeNode;
    protected handlers : Array<ChangeHandler>;
    protected tree : StateTree;

    constructor(tree : StateTree, parentPath : string, key : string) {
        this.tree = tree;
        this.key = key;
        this.value = null;
        this.basepath = parentPath;
        this.valueType = ValueType.None;
        this.children = [];
        this.handlers = [];
        this.parent = this.tree.getRef(parentPath);
    }

    public get path() : string {
        return this.basepath + "/" + this.key;
    }

    public onValueChanged(fn : ValueChangeHandler) {
        this.handlers.push(new ChangeHandler(ChangeHandlerType.ValueChange, fn));
    }

    public onChildAdded(fn : ChildAddedHandler) {
        this.handlers.push(new ChangeHandler(ChangeHandlerType.ChildAdded, fn));
    }

    public onChildRemoved(fn : ChildRemovedHandler) {
        this.handlers.push(new ChangeHandler(ChangeHandlerType.ChildRemoved, fn));
    }

    public onValueSet(fn : ValueSetHandler) {
        this.handlers.push(new ChangeHandler(ChangeHandlerType.ValueSet, fn));
    }

    public onValueUnset(fn : ValueUnsetHandler) {
        this.handlers.push(new ChangeHandler(ChangeHandlerType.ValueUnset, fn));
    }

    public offValueChanged(fn : ValueChangeHandler) {
      this.removeHandler(fn, ChangeHandlerType.ValueChange);
    }

    public offChildAdded(fn : ChildAddedHandler) {
       this.removeHandler(fn, ChangeHandlerType.ChildAdded);
    }

    public offChildRemoved(fn : ChildRemovedHandler) {
        this.removeHandler(fn, ChangeHandlerType.ChildRemoved);
    }

    public offValueSet(fn : ValueSetHandler) {
        this.removeHandler(fn, ChangeHandlerType.ValueSet);
    }

    public offValueUnset(fn : ValueUnsetHandler) {
        this.removeHandler(fn, ChangeHandlerType.ValueUnset);
    }

    private removeHandler(fn : any, type : ChangeHandlerType) {
        for(var i = 0; i < this.handlers.length; i++) {
            const handler = this.handlers[i];
            if(handler.type === type && handler.fn === fn) {
                this.handlers.removeAt(i);
                break;
            }
        }
    }

    public getChildCount() : integer {
        return this.children.length;
    }

    public getChild(childKey : string) : StateTreeNode {
        for(var i = 0; i < this.children.length; i++) {
            if(this.children[i].key === childKey) {
                return this.children[i];
            }
        }
        return this.tree.getRefWithKey(this.path, childKey);
    }

    public get hasValue() : boolean {
        return this.valueType !== ValueType.None;
    }

    public getValueType() : ValueType {
        return this.valueType;
    }

    public getValue<T>() : T {
        switch(this.valueType) {
            case ValueType.Primitive:
                return (this.value as any) as T;
            case ValueType.Object:
                const retnObject : Indexable<any> = {};
                for(var i = 0; i < this.children.length; i++) {
                    const child = this.children[i];
                    retnObject[child.key] = child.getValue();
                }
                return retnObject as T;
            case ValueType.Array:
                const retnArray = new Array<any>(this.children.length);
                for(var i = 0; i < this.children.length; i++) {
                    retnArray[i] = this.children[i].getValue();
                }
                return (retnArray as any) as T;
        }
        return (this.value as any) as T;
    }
    //
    // public push(value : any) : void {
    //
    // }

    public remove() : void {
        if(!this.hasValue) return;
        const oldValue = this.value;
        this.value = null;

        for (var i = 0; i < this.children.length; i++) {
            this.children[i].remove();
        }

        for (var i = 0; i < this.handlers.length; i++) {
            var handler = this.handlers[i];
            if (handler.type !== ChangeHandlerType.ValueUnset) {
                handler.fn(oldValue, this);
            }
        }

       // this.parent.children.remove(this);
    }

    protected removeInternal() {

    }

    protected computeValueType(value : any) : ValueType {
        if (value === null || value === void 0) return ValueType.None;
        if (Array.isArray(value)) return ValueType.Array;
        if (typeof value === "object") return ValueType.Object;
        return ValueType.Primitive;
    }

    protected getAncestors() : Array<StateTreeNode> {
        const retn = [];
        var ptr = this.parent;
        while(ptr !== null) {
            retn.push(ptr);
            ptr = ptr.parent;
        }
        return retn.reverse();
    }

    public createObjectPath(ancestors : Array<StateTreeNode>, closestSetIndex : integer, value : any) {
        const retn : any = {};
        var ptr = retn;
        for(var i = closestSetIndex; i < ancestors.length; i++) {
            ptr[ancestors[i].key] = {};
            ptr = ptr[ancestors[i].key];
        }
        ptr[this.key] = value;
        return retn;
    }

    private getClosestSetAncestorIndex(ancestry : Array<StateTreeNode>) {
        for(var i = 1; i < ancestry.length; i++) {
            if(ancestry[i].valueType !== ValueType.None) {
                return i;
            }
        }
        return 1;
    }

    public set(value : any) : void {

        if(value === this.value) return;

        if(this.parent !== null && this.parent.valueType === ValueType.None) {
            if(value === null || value === void 0) return;
            const ancestors = this.getAncestors();
            const idx = this.getClosestSetAncestorIndex(ancestors);
            const obj = this.createObjectPath(ancestors, idx, value);
            ancestors[idx - 1].set(obj);
            return;
        }

        const hadValue = this.hasValue;
        this.value = null; //value is null if array or object, its will be computed off children
        this.valueType = this.computeValueType(value);
        switch(this.valueType) {
            case ValueType.None:
                this.remove(); //todo -- unset value instead
                break;
            case ValueType.Array:
                this.setValueFromArray(value);
                break;
            case ValueType.Object:
                this.setValueFromObject(value);
                break;
            case ValueType.Primitive:
                this.value = value;
                break;
        }

        if(this.hasValue && !hadValue) {
            this.emitValueSet();
        }
        else if(hadValue && !this.hasValue) {
            this.emitValueUnset();
        }

        this.emitValueChanged();
    }

    private clear() {
        for(var i = 0; i < this.children.length; i++) {
            this.emitChildRemoved(this.children[i]);
        }
        this.children.length = 0;
    }

    private emitValueChanged() {
        for(var i = 0; i < this.handlers.length; i++) {
            const handler = this.handlers[i];
            if(handler.type === ChangeHandlerType.ValueChange) {
                handler.fn(this);
            }
        }
    }

    private emitValueSet() {
        for(var i = 0; i < this.handlers.length; i++) {
            const handler = this.handlers[i];
            if(handler.type === ChangeHandlerType.ValueSet) {
                handler.fn(this);
            }
        }
    }

    private emitValueUnset() {
        for(var i = 0; i < this.handlers.length; i++) {
            const handler = this.handlers[i];
            if(handler.type === ChangeHandlerType.ValueUnset) {
                handler.fn(this);
            }
        }
    }

    private emitChildAdded(child : StateTreeNode) : void {
        for(var i = 0; i < this.handlers.length; i++) {
            const handler = this.handlers[i];
            if(handler.type === ChangeHandlerType.ChildAdded) {
                handler.fn(this, child);
            }
        }
    }

    private emitChildRemoved(child : StateTreeNode) : void {
        for(var i = 0; i < this.handlers.length; i++) {
            const handler = this.handlers[i];
            if(handler.type === ChangeHandlerType.ChildRemoved) {
                handler.fn(this, child);
            }
        }
    }

    private setValueFromArray(value : any) {
        for (let i = value.length; i < this.children.length; i++) {
            this.children[i].remove();
        }
        const path = this.path;
        const childCount = this.children.length;
        for (let i = 0; i < value.length; i++) {
            if(childCount > i) {
                this.children[i].set(value[i]);
            }
            else {
                const ref = this.tree.getRefWithKey(path, i.toString());
                this.children.push(ref);
                ref.set(value[i]);
            }
        }
    }

    private setValueFromObject(value : any) {
        const keys = Object.keys(value);
        const path = this.path;

        for (var i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            if (keys.indexOf(child.key) === -1) {
                //child.remove(); todo fix this
            }
        }

        for (var i = 0; i < keys.length; i++) {
            const valueForKey = value[keys[i]];
            if(valueForKey === void 0 || valueForKey === null) {
                continue;
            }
            const ref = this.tree.getRefWithKey(path, keys[i]);
            if(ref.valueType === ValueType.None) {
                this.children.push(ref);
            }
            ref.set(value[keys[i]]);
        }
    }

}