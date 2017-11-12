import {Heap} from "./heap";
import {defaultCompareFn, ICompareFunction} from "./compare";

interface IPriorityItem {
    priority : number;
}

export const PriorityQueue = class PriorityQueue<T extends IPriorityItem> extends Heap<T> {

    constructor() {
        super(PriorityQueue.compareFn);
    }

    public enqueue : (element: T) => boolean;
    public dequeue : ()  => T;

    private static compareFn<T extends IPriorityItem>(a : T, b : T) : number {
        if(a.priority > b.priority) return 1;
        if(a.priority < b.priority) return -1;
        return 0;
    }

} as typeof __PriorityQueueInternal.IPriorityQueue;

PriorityQueue.prototype.enqueue = Heap.prototype.add;
PriorityQueue.prototype.dequeue = Heap.prototype.removeRoot;

export class GenericPriorityQueue<T> extends Heap<T> {

    constructor(compareFn? : ICompareFunction<T>) {
        super(compareFn || defaultCompareFn);
    }

    public enqueue : (element: T) => boolean;
    public dequeue : ()  => T;

}

GenericPriorityQueue.prototype.enqueue = Heap.prototype.add;
GenericPriorityQueue.prototype.dequeue = Heap.prototype.removeRoot;

export declare namespace __PriorityQueueInternal {

    class IPriorityQueue<T> {

        constructor(compareFunction?: ICompareFunction<T>);

        readonly length : number;

        size() : number;

        clear() : void;

        peek() : T;

        contains(item : T) : boolean;

        enqueue(item : T) : boolean;

        dequeue() : T;

    }
}