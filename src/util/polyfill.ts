import {IPoolable, Pool} from "./pool";

declare global {
    interface Window {
        requestIdleCallback : () => void;
    }
}

class IdleCallbackData implements IPoolable {

    private startTime : number;
    public didTimeout : boolean;

    constructor() {
        this.startTime = 0;
        this.didTimeout = false;
    }

    public timeRemaining() : number {
        return Math.max(0, 50.0 - (Date.now() - this.startTime));
    }

    onSpawn() : void {
        this.startTime = Date.now();
    }

    onDespawn() : void {

    }

}

const IdleCallbackPool = new Pool(IdleCallbackData);

export const requestIdleCallback = window.requestIdleCallback ||
    function (handler : (data : IdleCallbackData) => void) {
        return setTimeout(function () {
            const idleCallbackData = IdleCallbackPool.spawn();
            handler(idleCallbackData);
            IdleCallbackPool.despawn(idleCallbackData);
        }, 1);
    };

