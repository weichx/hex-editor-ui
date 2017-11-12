import {Entity} from "../runtime/entity";
import {ImmutableVector2} from "../math/vector2";
import {HexDragAction} from "./drag_action";
import {HexInputEvent} from "./input_event";
import {Transform} from "../runtime/transform";

export class HexDragEvent extends HexInputEvent {

    public readonly currentPosition : ImmutableVector2;
    public readonly dragStartPosition : ImmutableVector2;
    public readonly initialEntities : ReadonlyArray<Entity>;
    public readonly currentEntities : ReadonlyArray<Entity>;
    private dragAction : HexDragAction;

    constructor(dragStart : ImmutableVector2, initialEntities : Array<Entity>) {
        super();
        this.currentPosition = dragStart.clone();
        this.dragStartPosition = dragStart;
        this.initialEntities = Array.clone(initialEntities);
        this.currentEntities = this.initialEntities;
        this.dragAction = null;
    }

    public getLocalPosition(transform : Transform) {
        return transform.pointToLocalSpace(this.currentPosition);
    }

    public isCancelled() : boolean {
        return false;
    }

    /** @internal */
    public update() {
        if(this.dragAction !== null) {
            this.dragAction.update();
        }
    }

    public getDragAction() : HexDragAction {
        return this.dragAction;
    }

    public setDragAction(dragAction : HexDragAction) : boolean {
        if(this.dragAction !== null) return false;
        this.dragAction = dragAction;
        (this.dragAction as any).event = this;
        this.dragAction.onDragStart();
        return true;
    }

    public cancel() : void {
        if(this.dragAction !== null) {
            this.dragAction.onDragCancel();
            this.dragAction.onDragEnd();
        }
    }

    public drop() : void {
        if(this.dragAction !== null) {
            this.dragAction.onDragDrop();
            this.dragAction.onDragEnd();
        }
    }


}