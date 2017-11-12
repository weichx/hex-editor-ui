import {TypeOf} from "../i_typeof";
import {Entity} from "./entity";
import {Component} from "./component";
import {RootTransform} from "./transform";
import {HexApplication} from "../hex_application";
import {ContentBox} from "../components/content_box";

/** Root Entity exists to avoid excessive .parent checks in Entity methods
 *  this makes the code faster, cleaner, and simpler
 *  Will likely serve as a shadow boundary as well when shadow entities are a thing*/
export class RootEntity extends Entity {

    constructor(application : HexApplication, name : string = "Root"){
        super(name, null);
        this.application = application;
    }

    protected initialize() {
        this.transform = new RootTransform(this);
        this.contentBox = new ContentBox(this);
    }

    public setActive(isActive : boolean ) : void {}

    public isActive() : boolean {
        return true;
    }

    public setParent(parent : Entity) : Entity {
        return null;
    }

    public isDescendantOf(other : Entity) : boolean {
        return false;
    }

    public isAncestorOf(target : Entity) : boolean {
        return true;
    }

    public getComponentInParent<T extends Component>(type : TypeOf<T>) : T {
        return null;
    }

    public getComponentsInParent<T extends Component>(type : TypeOf<T>, storage : Array<T> = null) : Array<T> {
        return storage !== null ? storage : null;
    }

    public getComponentInAncestors<T extends Component>(type : TypeOf<T>, storage : Array<T> = null) : any{
        return storage !== null ? storage : null;
    }

    //root element cannot be destroyed
    public destroy() : void {
        return;
    }

}