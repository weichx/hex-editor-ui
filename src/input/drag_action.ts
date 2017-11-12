import {HexDragEvent} from "./drag_event";

export class HexDragAction {

    public readonly event : HexDragEvent;

    constructor() {
        this.event = null;
    }

    public onDragStart(){}

    public onDragEnd() {}

    public onDragCancel(){}

    public onDragDrop(){}

    public update() {}

}
