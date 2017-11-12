export class HexAppEvent {
    __brand : {for_the: "runtime_only"};
}

export type AppEventType = {
    <T extends HexAppEvent>(arg : INewable<T>) : (target : object, key : string, desc : TypedPropertyDescriptor<(t : T) => any>) => any;
    addListener : <T extends HexAppEvent>(evtType : INewable<T>, ctx : object, method : (evt? : T) => any) => void;
    removeListener : <T extends HexAppEvent>(evtType : INewable<T>, ctx : object, method : (evt? : T) => any) => void;
    emit: <T>(evt : T) => void;
}

interface IEventListener<T> {
    ctx : object,
    method: (t? : T) => any,
    type : INewable<T>;
}

export class EventEmitter<T> {

    private listenerMap = new Map<INewable<T>, Array<IEventListener<T>>>();

    public addListener(type : INewable<T>, ctx : object, method : (t? : T) => any) : void {
        var handlerList = this.listenerMap.get(type);
        if(handlerList === void 0) {
            handlerList = [];
            this.listenerMap.set(type, handlerList);
        }
        handlerList.push({type, ctx, method});
    }

    public removeListener(type : INewable<T>, ctx : object, method : (t? : T) => any) : void {
        var handlerList = this.listenerMap.get(type);
        if (handlerList === void 0) return;
        for(let i = 0; i < handlerList.length; i++) {
            var handler = handlerList[i];
            if(handler.type === type && handler.ctx === ctx && handler.method === method) {
                handlerList.unstableRemoveAt(i);
                return;
            }
        }
    }

    public emit(evt : T) {
        const ctor = evt.constructor;
        var handlerList = this.listenerMap.get(ctor as any);
        if(handlerList === void 0) return;
        for(let i = 0; i < handlerList.length; i++) {
            var handler = handlerList[i];
            if(handler.type === ctor) {
                handler.method.call(handler.ctx, evt);
            }
        }
    }
}

export const AppEvent : AppEventType = (new EventEmitter<HexAppEvent>() as any) as AppEventType;


