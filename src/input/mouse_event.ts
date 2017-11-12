import {Entity} from "../runtime/entity";
import {Vector2} from "../math/vector2";
import {HexPointerEvent} from "./pointer_event";

export class HexMouseEvent extends HexPointerEvent {

    public readonly mousePosition : Readonly<Vector2>;
    public readonly mouseOverEntities : ReadonlyArray<Entity>;

    constructor() {
        super();
    }

}