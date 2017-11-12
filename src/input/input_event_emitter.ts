import {Component} from "../runtime/component";
import {HexInputEvent} from "./input_event";
import {HexDragAction} from "./drag_action";
import {DragEventType, InputEventType} from "./e_input";

interface InputEventHandler {
    eventType : number;
    eventHandler : (e? : HexInputEvent) => any;
    actionHandler : (e? : HexDragAction) => any;
    actionType : Function,
    ctx : object;
}

export class InputEventEmitter extends Component {

    //todo replace all of this with EventEmitter<HexInputEvent> and make a seperate type for drag action handling
    private handlers : Array<InputEventHandler> = [];

    public addEventListener(eventType : InputEventType, target : object, method : (e? : HexInputEvent) => any) {
        this.handlers.push({
            ctx: target,
            eventType: eventType,
            eventHandler: method,
            actionHandler: null,
            actionType: null
        });
    }

    public removeEventListener(eventType : InputEventType, target : object, method : (e? : HexInputEvent) => any) {
        eventType;
        target;
        method;
        throw "Not implemented";
    }

    public addDragActionListener<T extends HexDragAction>(actionType : INewable<T>, eventType : DragEventType, target : object, method : (arg? : T) => any) {
        this.handlers.push({
            ctx: target,
            eventType: eventType,
            eventHandler: null,
            actionHandler: method,
            actionType: actionType
        });
    }

    public removeDragActionListener<T extends HexDragAction>(actionType : INewable<T>, eventType : DragEventType, target : object, method : (arg? : T) => any) {
        actionType;
        eventType;
        target;
        method;
        throw "Not implemented";
    }

    public respondsTo(inputEvtType : InputEventType) {
        for (let i = 0; i < this.handlers.length; i++) {
            if ((this.handlers[i].eventType & inputEvtType) !== 0) {
                return true;
            }
        }
        return false;
    }

    public invoke(evt : HexInputEvent, action : HexDragAction, eventType : InputEventType) : void {
        for (let i = 0; i < this.handlers.length; i++) {
            const handler = this.handlers[i];
            if ((handler.eventType & eventType) !== 0) {
                if (action !== null && handler.actionType !== null) {
                    if (action instanceof handler.actionType) {
                        handler.actionHandler.call(handler.ctx, action);
                    }
                }
                else if (handler.eventHandler !== null) {
                    handler.eventHandler.call(handler.ctx, evt);
                }
            }
        }
    }

    public onDestroy() {
        //remove handlers
    }

}