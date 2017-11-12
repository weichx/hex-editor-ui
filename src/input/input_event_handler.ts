import {Component} from "../runtime/component";
import {HexDragEvent} from "./drag_event";
import {HexMouseEvent} from "./mouse_event";
import {HexDragAction} from "./drag_action";
import {HexInputEvent} from "./input_event";
import {DragEventType, InputEventType} from "./e_input";
import {InputEventEmitter} from "./input_event_emitter";
import {HexScrollEvent} from "./scroll_event";

type Decorator<T> = (target : object, key : string, desc : TypedPropertyDescriptor<(t : T) => any>) => any;

export class InputEvent {

    public static addListener(type : InputEventType, target : Component, method : (e? : HexInputEvent) => any) {
        (target.getComponent(InputEventEmitter) ||
            target.entity.addComponent(InputEventEmitter)
        ).addEventListener(type, target, method);
    }

    public static addDragActionListener(type : INewable<HexDragAction>, action : DragEventType, target : Component, method : (arg? : HexDragAction) => any) {
        (target.getComponent(InputEventEmitter) ||
            target.entity.addComponent(InputEventEmitter)
        ).addDragActionListener(type, action, target, method);
    }

    public static removeListener(type : InputEventType, target : Component, method : (e? : HexInputEvent) => any) {
        const emitter = target.getComponent(InputEventEmitter);
        if (emitter !== null) {
            emitter.removeEventListener(type, target, method);
        }
    }

    public static removeDragActionListener(type : INewable<HexDragAction>, action : DragEventType, target : Component, method : (arg? : HexDragAction) => any) {
        const emitter = target.getComponent(InputEventEmitter);
        if (emitter !== null) {
            emitter.removeDragActionListener(type, action, target, method);
        }
    }

    //these are all here at compile time only! used for decorator replacement
    public static MouseEnter : Decorator<HexMouseEvent>;
    public static MouseExit : Decorator<HexMouseEvent>;
    public static MouseDown : Decorator<HexMouseEvent>;
    public static MouseMove : Decorator<HexMouseEvent>;
    public static MouseHover : Decorator<HexMouseEvent>;
    public static MouseUp : Decorator<HexMouseEvent>;
    public static MouseClick : Decorator<HexMouseEvent>;
    public static MouseDoubleClick : Decorator<HexMouseEvent>;

    public static DragStart : Decorator<HexDragEvent>;
    public static DragUpdate : Decorator<HexDragEvent>;
    public static DragMove : Decorator<HexDragEvent>;
    public static DragHover : Decorator<HexDragEvent>;
    public static DragCancel : Decorator<HexDragEvent>;
    public static DragEnter : Decorator<HexDragEvent>;
    public static DragExit : Decorator<HexDragEvent>;
    public static DragEnd : Decorator<HexDragEvent>;
    public static DragDrop : Decorator<HexDragEvent>;

    public static Scroll : Decorator<HexScrollEvent>;

    public static DragActionEnter : <T extends INewable<HexDragAction>>(action? : T) => any;
    public static DragActionMove : <T extends INewable<HexDragAction>>(action? : T) => any;
    public static DragActionHover : <T extends INewable<HexDragAction>>(action? : T) => any;
    public static DragActionUpdate : <T extends INewable<HexDragAction>>(action? : T) => any;
    public static DragActionCancel : <T extends INewable<HexDragAction>>(action? : T) => any;
    public static DragActionDrop : <T extends INewable<HexDragAction>>(action? : T) => any;
    public static DragActionExit : <T extends INewable<HexDragAction>>(action? : T) => any;
    public static DragActionEnd : <T extends INewable<HexDragAction>>(action? : T) => any;

}