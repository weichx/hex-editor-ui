import {HexAppEvent} from "../../runtime/event";
import {Entity} from "../../runtime/entity";

export class Evt_EntitySetParent extends HexAppEvent {

    public readonly entity : Entity;
    public readonly parent : Entity;
    public readonly oldParent : Entity;

    constructor(entity : Entity, parent : Entity, oldParent : Entity) {
        super();
        this.entity = entity;
        this.parent = parent;
        this.oldParent = oldParent;
    }

}