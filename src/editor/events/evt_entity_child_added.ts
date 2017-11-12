import {HexAppEvent} from "../../runtime/event";
import {Entity} from "../../runtime/entity";

export class Evt_EntityChildAdded extends HexAppEvent {

    public readonly entity : Entity;
    public readonly child : Entity;
    public readonly index : integer;

    constructor(entity : Entity, child : Entity, index : integer) {
        super();
        this.entity = entity;
        this.child = child;
        this.index = index;
    }

}