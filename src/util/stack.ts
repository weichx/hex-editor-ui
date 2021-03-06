import {getNextPowerOfTwo} from "./bitwise";

export class Stack<T> {

    private capacity : number;
    private length : number;
    private front : number;

    constructor(capacity = 16) {
        if (capacity < 1) capacity = 1;
        this.capacity = getNextPowerOfTwo(capacity | 0);
        this.length = 0;
        this.front = 0;
        for(let i = 0; i < this.capacity; i++) {
            (this as any)[i] = null;
        }
    }

    public get count() {
        return this.length;
    }

    public push(item : T) : T {
        let length = this.length;
        this.ensureCapacity(length + 1);
        (this as any)[(this.front + length) & (this.capacity - 1)] = item;
        this.length++;
        return item;
    }

    public pop() : T {
        const length = this.length - 1;
        if (length < 0) return void 0;
        const i = (this.front + length) & (this.capacity - 1);
        const ret = (this as any)[i];
        (this as any)[i] = null;
        this.length = length;
        return ret;
    };

    public peek() : T {
        const idx = (this.front + (this.length - 1)) & (this.capacity - 1);
        return (this as any)[idx] as T;
    }

    public clear() {
        var len = this.length;
        var front = this.front;
        var capacity = this.capacity;
        for (var i = 0; i < len; i++) {
            (this as any)[(front + i) & (capacity - 1)] = null;
        }
        this.length = 0;
        this.front = 0;
    }

    private ensureCapacity(capacity : number) {
        if (this.capacity < capacity) {
            var oldCapacity = this.capacity;
            this.capacity = getNextPowerOfTwo(this.capacity * 1.5 + 16);
            var front = this.front;
            var length = this.length;
            if (front + length > oldCapacity) {
                var moveItemsCount = (front + length) & (oldCapacity - 1);
                this.move(0, oldCapacity, moveItemsCount);
            }
        }
    }

    private move(srcIdx : number, dstIdx : number, count : number) {
        for (let i = 0; i < count; ++i) {
            (this as any)[i + dstIdx] = (this as any)[i + srcIdx];
            (this as any)[i + srcIdx] = null;
        }
    }

}
