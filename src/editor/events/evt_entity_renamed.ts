import {HexAppEvent} from "../../runtime/event";
import {Entity} from "../../runtime/entity";

export class Evt_EntityRenamed extends HexAppEvent {

    public readonly entity : Entity;
    public readonly newName : string;
    public readonly oldName : string;

    constructor(entity : Entity, newName : string, oldName : string) {
        super();
        this.entity = entity;
        this.newName = newName;
        this.oldName = oldName;
    }

}