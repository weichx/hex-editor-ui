
import {HexAppEvent} from "../../runtime/event";
import {Entity} from "../../runtime/entity";

export class Evt_EntityCreated extends HexAppEvent {

    public readonly entity : Entity;

    constructor(entity : Entity) {
        super();
        this.entity = entity;
    }

}