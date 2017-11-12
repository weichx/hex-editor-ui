import {HexAppEvent} from "../../runtime/event";
import {Entity} from "../../runtime/entity";

export class Evt_EntityChildRemoved extends HexAppEvent {

    public readonly entity : Entity;
    public readonly child : Entity;

    constructor(entity : Entity, child : Entity) {
        super();
        this.entity = entity;
        this.child = child;
    }

}