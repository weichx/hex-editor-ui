import {TypeOf} from "../i_typeof";
import {Entity} from "./entity";
import {Transform} from "./transform";

/** @internal*/
export const enum ComponentFlag {
    Created = 1 << 0,
    Enabled = 1 << 1,
    Initialized = 1 << 2,
    Ready = 1 << 3,
    Destroyed = 1 << 4,
    InitComplete = Initialized | Ready,
    ReadyAndEnabled = Enabled | Ready,
    InitializedAndEnabled = Enabled | Initialized,
}

export class Component {

    public readonly entity : Entity;
    public readonly transform : Transform;

    /** @internal */
    public flags : ComponentFlag;

    //todo don't allow construction outside of runtime
    constructor(entity : Entity) {
        this.entity = entity;
        this.transform = this.entity.transform;
        this.flags = ComponentFlag.Enabled;
    }

    public isEnabled() : boolean {
        //todo -- make sure we aren't destroyed too
        return (this.flags & ComponentFlag.Enabled) !== 0 && this.entity.getActive();
    }

    public setEnabled(isEnabled : boolean) : void {
       var wasEnabled = (this.flags & ComponentFlag.Enabled) !== 0;
       if(isEnabled === true && wasEnabled === false) {
           this.flags ^= ComponentFlag.Enabled;
           if(!wasEnabled && this.entity.getActive()) {
               this.entity.application.enableComponent(this);
           }
       }
       else if(isEnabled === false && wasEnabled === true) {
           this.flags ^= ComponentFlag.Enabled;
           if(this.entity.getActive()) {
                this.entity.application.disableComponent(this);
           }
       }
    }

    public __getTypeInfo() : any[] {
        return [];
    }

    public onCreate() : void {}

    public onReady() : void {}

    public onInitialize() : void {}

    public onEnable() : void {}

    public onUpdate(time? : number) : void {}

    public onLateUpdate() : void {}

    public onDisable() : void {}

    public onDestroy() : void {}

    public onChildAdded(entity : Entity) : void {}

    public onChildRemoved(entity : Entity) : void {}

    public onChildMoved(entity : Entity, newIndex : number) : void {}

    public onParentChanged(newParent : Entity, oldParent : Entity) : void {}

    public getComponent<T extends Component>(type : TypeOf<T>) : T {
        return this.entity.getComponent(type);
    }

    public isDestroyed() : boolean {
        return false;
    }

    //Returns all components of Type type in the GameObject
    public getComponents<T extends Component>(type : TypeOf<T>) : Array<T> {
        return this.entity.getComponents(type);
    }

    public getComponentInChildren<T extends Component>(type : TypeOf<T>) : T {
        return this.entity.getComponentInChildren(type);
    }

    //Returns all components of Type in the AppElement in it's direct children
    public getComponentsInChildren<T extends Component>(type : TypeOf<T>) : Array<T> {
        return this.entity.getComponentsInChildren(type);
    }

    //Returns all components of Type in the AppElement recursively in its children
    public getComponentsInDescendants<T extends Component>(type : TypeOf<T>) : Array<T> {
        return this.entity.getComponentsInDescendants(type);
    }

    public getComponentInAncestors<T extends Component>(type : TypeOf<T>) : T {
        return this.entity.getComponentInAncestors(type);
    }

    public getComponentInParent<T extends Component>(type : TypeOf<T>) : T {
        return this.entity.getComponentInParent(type);
    }

    public getComponentsInParent<T extends Component>(type : TypeOf<T>) : Array<T> {
        return this.entity.getComponentsInParent(type);
    }
}