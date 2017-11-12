import {defaultCompareFn, ICompareFunction} from "./compare";

export const Heap = class Heap<T> extends Array<T> {

    private compare : ICompareFunction<T>;

    constructor(compareFunction? : ICompareFunction<T>) {
        super();
        this.compare = compareFunction || defaultCompareFn;
    }

    public peek() : T {
        return this[0];
    }

    public add(element : T) : boolean {
        if (element === void 0) return false;
        this.push(element);
        this.siftUp(this.length - 1);
        return true;
    }

    public removeRoot() : T {
        if (this.length > 0) {
            const obj = this[0];
            this[0] = this[this.length - 1];
            this.removeAt(this.length - 1);
            if (this.length > 0) {
                this.siftDown(0);
            }
            return obj;
        }
        return undefined;
    }

    public size() : number {
        return this.length;
    }

    private leftChildIndex(nodeIndex : number) : number {
        return (2 * nodeIndex) + 1;
    }

    private rightChildIndex(nodeIndex : number) : number {
        return (2 * nodeIndex) + 2;
    }

    private parentIndex(nodeIndex : number) : number {
        return Math.floor((nodeIndex - 1) / 2);
    }

    private minIndex(leftChild : number, rightChild : number) : number {

        if (rightChild >= this.length) {
            if (leftChild >= this.length) {
                return -1;
            }
            else {
                return leftChild;
            }
        } else {
            if (this.compare(this[leftChild], this[rightChild]) <= 0) {
                return leftChild;
            }
            else {
                return rightChild;
            }
        }
    }

    private siftUp(index : number) : void {

        let parentIndex = this.parentIndex(index);
        while (index > 0 && this.compare(this[parentIndex], this[index]) > 0) {
            const temp = this[parentIndex];
            this[parentIndex] = this[index];
            this[index] = temp;
            index = parentIndex;
            parentIndex = this.parentIndex(index);
        }
    }

    private siftDown(nodeIndex : number) : void {

        let min = this.minIndex(
            this.leftChildIndex(nodeIndex),
            this.rightChildIndex(nodeIndex)
        );

        while (min >= 0 && this.compare(this[nodeIndex], this[min]) > 0) {
            const temp = this[min];
            this[min] = this[nodeIndex];
            this[nodeIndex] = temp;
            nodeIndex = min;
            min = this.minIndex(
                this.leftChildIndex(nodeIndex),
                this.rightChildIndex(nodeIndex)
            );
        }
    }

} as typeof __HeapInternal.IHeap;

declare namespace __HeapInternal {

    class IHeap<T> {

        readonly length : number;

        constructor(compareFunction? : ICompareFunction<T>);

        size() : number;

        clear() : void;

        peek() : T;

        contains(item : T) : boolean;

        add(item : T) : boolean;

        removeRoot() : T;
    }
}