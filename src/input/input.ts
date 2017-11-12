import {IVector2, Vector2} from "../math/vector2";
import {MouseButtonState} from "./e_mouse_button";
import {KeyCode} from "./e_keycode";

export class Input {

    //todo consider making use of ImmutableVector2 to cut down on new Vector() calls
    protected x : number;
    protected y : number;
    protected lastX : number;
    protected lastY : number;
    protected lastMouseButtonState : MouseButtonState;
    protected mouseButtonState : MouseButtonState;
    protected keyMapCurrent : Array<boolean>;
    protected keyMapPrevious : Array<boolean>;
    protected mouseDownPosition : Vector2;
    protected mouseWheelDeltaX : number;
    protected mouseWheelDeltaY : number;
    protected targetElement : HTMLElement;
    protected pending : Vector2;
    protected listeners : Indexable<any>;

    constructor() {
        this.x = 0;
        this.y = 0;
        this.lastX = 0;
        this.lastY = 0;
        this.lastMouseButtonState = 0;
        this.mouseButtonState = 0;
        this.keyMapCurrent = new Array<boolean>(222);
        this.keyMapPrevious = new Array<boolean>(222);
        this.mouseDownPosition = new Vector2(-1, -1);
        this.mouseWheelDeltaX = 0;
        this.mouseWheelDeltaY = 0;
        this.pending = new Vector2(-100, -100);
        this.listeners = {
            "mousemove": (evt : MouseEvent) => {
                // this.x = evt.pageX;
                // this.y = evt.pageY;
                this.pending.set(evt.pageX, evt.pageY);
            },
            "mousedown": (evt : MouseEvent) => {
                // this.x = evt.pageX;
                // this.y = evt.pageY;
                this.pending.set(evt.pageX, evt.pageY);
                this.mouseButtonState = evt.buttons;
                this.mouseDownPosition.x = this.x;
                this.mouseDownPosition.y = this.y;
            },
            "mouseup": (evt : MouseEvent) => {
                // this.x = evt.pageX;
                // this.y = evt.pageY;
                this.pending.set(evt.pageX, evt.pageY);
                this.mouseButtonState = evt.buttons;
            },
            "mousewheel": (evt : MouseWheelEvent) => {
                this.mouseWheelDeltaX = Input.normalizeWheelValue(evt.deltaX);
                this.mouseWheelDeltaY = Input.normalizeWheelValue(evt.deltaY);
                var delta = 0;
                if (evt.wheelDelta) {
                    delta = evt.wheelDelta / 120;
                } else if (evt.detail) {
                    delta = -evt.detail / 3;
                }
                this.mouseWheelDeltaY = delta;
            },
            "keydown": (evt : KeyboardEvent) => {
                this.keyMapCurrent[evt.keyCode] = true;
            },
            "keyup": (evt : KeyboardEvent) => {
                this.keyMapCurrent[evt.keyCode] = false;
            }
        };
    }

    public setTargetElement(element : HTMLElement) {
        if (this.targetElement) {
            var passive = { capture: true, passive: true };
            (element as any).removeEventListener("mousemove", this.listeners.mousemove, passive);
            (element as any).removeEventListener("mousedown", this.listeners.mousedown, passive);
            (element as any).removeEventListener("mouseup", this.listeners.mouseup, passive);
            (element as any).removeEventListener("mousewheel", this.listeners.mousewheel, passive);
            //todo as any) make this get focus somehow
            (element as any).removeEventListener("keydown", this.listeners.keydown, passive);
            (element as any).removeEventListener("keyup", this.listeners.keyup, passive);
        }
        this.targetElement = element;
        if (this.targetElement) {
            (element as any).addEventListener("mousemove", this.listeners.mousemove, passive);
            (element as any).addEventListener("mousedown", this.listeners.mousedown, passive);
            (element as any).addEventListener("mouseup", this.listeners.mouseup, passive);
            (element as any).addEventListener("mousewheel", this.listeners.mousewheel, { passive: false });
            //todo as any) make this get focus somehow
            (element as any).addEventListener("keydown", this.listeners.keydown, passive);
            (element as any).addEventListener("keyup", this.listeners.keyup, passive);
        }
    }

    public update() {

        this.lastX = this.x;
        this.lastY = this.y;
        this.x = this.pending.x;
        this.y = this.pending.y;

        this.lastMouseButtonState = this.mouseButtonState;
        this.mouseWheelDeltaX = 0;
        this.mouseWheelDeltaY = 0;
        //todo can replace keymap with bitfields & offset
        for (let i = 8; i < 222; i++) {
            this.keyMapPrevious[i] = this.keyMapCurrent[i];
        }
    }

    public hasScrollDelta() : boolean {
        return this.mouseWheelDeltaY !== 0;
    }

    public getScrollDelta(out : Vector2 = null) : Vector2 {
        if(out === null) {
            out = new Vector2();
        }
        out.x = this.mouseWheelDeltaX;
        out.y = this.mouseWheelDeltaY;
        return out;
    }

    public wasMouseDown() : boolean {
        return (this.lastMouseButtonState & MouseButtonState.AnyButton) !== 0;
    }

    public isMouseDown() : boolean {
        return (this.mouseButtonState & MouseButtonState.AnyButton) !== 0;
    }

    public isMouseUp() : boolean {
        return (this.mouseButtonState & MouseButtonState.AnyButton) === 0;
    }

    public isMouseDownThisFrame() : boolean {
        return !this.wasMouseButtonDown(MouseButtonState.AnyButton) && this.isMouseButtonDown(MouseButtonState.AnyButton);
    }

    public isMouseUpThisFrame() : boolean {
        return !this.wasMouseButtonUp(MouseButtonState.AnyButton) && this.isMouseButtonUp(MouseButtonState.AnyButton);
    }

    public isMouseButtonDownThisFrame(button : MouseButtonState) : boolean {
        return !this.wasMouseButtonDown(button) && this.isMouseButtonDown(button);
    }

    public isMouseButtonUpThisFrame(button : MouseButtonState) : boolean {
        return this.wasMouseButtonUp(button) && !this.isMouseButtonUp(button);
    }

    public isMouseButtonDown(button : MouseButtonState) : boolean {
        return (this.mouseButtonState & button) !== 0;
    }

    public isMouseButtonUp(button : MouseButtonState) : boolean {
        return (this.mouseButtonState & button) === 0;
    }

    public wasMouseButtonDown(button : MouseButtonState) : boolean {
        return (this.lastMouseButtonState & button) !== 0;
    }

    public wasMouseButtonUp(button : MouseButtonState) : boolean {
        return (this.lastMouseButtonState & button) === 0;
    }

    public isKeyDown(key : KeyCode) : boolean {
        return this.keyMapCurrent[key];
    }

    public isKeyUp(key : KeyCode) : boolean {
        return !this.keyMapCurrent[key];
    }

    public isKeyDownThisFrame(key : KeyCode) : boolean {
        return !this.keyMapPrevious[key] && this.keyMapCurrent[key];
    }

    public isKeyUpThisFrame(key : KeyCode) : boolean {
        return this.keyMapPrevious[key] && !this.keyMapCurrent[key];
    }

    public didMouseMove() : boolean {
        return this.x !== this.lastX || this.y !== this.lastY;
    }

    public getMouseDelta(out? : Vector2) {
        return (out || new Vector2()).set(this.x - this.lastX, this.y - this.lastY);
    }

    public getMouseDownDelta(out? : Vector2) {
        return (out || new Vector2()).set(
            this.x - this.mouseDownPosition.x,
            this.y - this.mouseDownPosition.y
        );
    }

    public getMouseDownDeltaDistanceSquared() : number {
        return this.getMouseDownDelta(Vector2.scratch0).lengthSquared();
    }

    public getMouseDownDistanceDeltaX() : number {
        return this.x - this.mouseDownPosition.x;
    }

    public getMouseDownDistanceDeltaY() : number {
        return this.y - this.mouseDownPosition.y;
    }

    public getMouseWheelDelta(out? : Vector2) : Vector2 {
        return (out || new Vector2()).set(this.mouseWheelDeltaX, this.mouseWheelDeltaY);
    }

    public getMousePosition(out? : Vector2) : Vector2 {
        if (out) {
            return out.set(this.x, this.y);
        }
        else {
            return new Vector2(this.x, this.y);
        }
    }

    public getMouseDownPosition(out? : Vector2) : Vector2 {
        return (out || new Vector2()).copy(this.mouseDownPosition);
    }

    public getMouseRelative(offset : IVector2, out? : Vector2) {
        return (out || new Vector2()).set(this.x - offset.x, this.y - offset.y);
    }

    public getMouseDownRelative(offset : IVector2, out? : Vector2) {
        return (out || new Vector2()).set(
            this.mouseDownPosition.x - offset.x,
            this.mouseDownPosition.y - offset.y
        );
    }

    protected static normalizeWheelValue(value : number) : number {
        if (value === 0) return 0;
        if (value > 0) return 1;
        return -1;

    }

}