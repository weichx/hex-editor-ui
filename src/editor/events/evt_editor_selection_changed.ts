import {HexAppEvent} from "../../runtime/event";
import {Entity} from "../../runtime/entity";

export class Evt_EditorSelectionChanged extends HexAppEvent {

    public readonly newSelection : Entity;
    public readonly oldSelection : Entity;

    constructor(newSelection : Entity, oldSelection : Entity) {
        super();
        this.newSelection = newSelection;
        this.oldSelection = oldSelection;
    }

}