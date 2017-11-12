import {HexAppEvent} from "../../runtime/event";
import {Entity} from "../../runtime/entity";

export class Evt_EntityChildMoved extends HexAppEvent {

    public readonly entity : Entity;
    public readonly child : Entity;
    public readonly newIndex : integer;
    public readonly oldIndex : integer;

    constructor(entity : Entity, child : Entity, newIndex : integer, oldIndex : integer) {
        super();
        this.entity = entity;
        this.child = child;
        this.newIndex = newIndex;
        this.oldIndex = oldIndex;
    }

}