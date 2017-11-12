import {IPoolable1, Pool1} from "./pool";

//todo make pools use linked lists of fixed-size arrays instead of just arrays

export class LinkedListNode<T> implements IPoolable1<T> {

    public element : T;
    public next : LinkedListNode<T>;
    public prev : LinkedListNode<T>;

    constructor() {
        this.element = null;
        this.next = null;
        this.prev = null;
    }

    public remove() : void {
        if(this.prev !== null) {
            this.prev.next = this.next;
        }
        if(this.next !== null) {
            this.next.prev = this.prev;
        }
    }

    public onSpawn(element : T) {
        this.element = element;
        this.next = null;
        this.prev = null;
    }

    public onDespawn() {
        this.element = null;
        this.next = null;
        this.prev = null;
    }

}

var pool = new Pool1(LinkedListNode);

export class LinkedList<T> {

    private head : LinkedListNode<T>;
    private tail : LinkedListNode<T>;

    private length : number;

    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    public addFirst(item : T) : T {

        const newNode = pool.spawn(item);

        if (this.head === null) {
            this.head = newNode;
            this.tail = newNode;
        }
        else {
            var first = this.head;
            this.head = newNode;
            this.head.next = first;
            first.prev = newNode;
        }
        this.length++;
        return item;
    }

    public addLast(item : T) : T {
        const newNode = pool.spawn(item);

        if (this.head === null) {
            this.head = newNode;
            this.tail = newNode;
        }
        else {
            var last = this.tail;
            this.tail = newNode;
            this.tail.prev = last;
            last.next = newNode;
        }
        this.length++;
        return item;
    }

    public getFirst() : T {

        if (this.head !== null) {
            return this.head.element;
        }
        return null;
    }

    public getHeadNode() : LinkedListNode<T> {
        return this.head;
    }

    public getLast() : T {

        if (this.tail !== null) {
            return this.tail.element;
        }
        return null;
    }

    public getNode(index : number) : LinkedListNode<T> {
        var ptr = this.head;
        var i = 0;
        while(ptr !== null && index !== i) {
            ptr = ptr.next;
            i++;
        }
        return ptr;
    }

    public get(index : number) : T {
        var node = this.getNode(index);
        if(node !== null) {
            return node.element;
        }
        return null;
    }

    public remove(item : T) : boolean {
        if (this.length === 0 || item === void 0) {
            return false;
        }

        let previous : LinkedListNode<T> = null;
        let currentNode : LinkedListNode<T> = this.head;

        while (currentNode !== null) {

            if (currentNode.element === item) {

                if (currentNode === this.head) {
                    this.head = this.head.next;
                    if(this.tail === currentNode) {
                        this.tail = null;
                    }
                }
                else if (currentNode === this.tail) {
                    this.tail = previous;
                }
                else {
                    previous.next = currentNode.next;
                }
                //despawn here causes problems!
                //pool.despawn(currentNode);
                this.length--;
                return true;
            }

            previous = currentNode;
            currentNode = currentNode.next;
        }
        return false;
    }

    public removeNode(node : LinkedListNode<T>) : boolean {
       return this.remove(node.element);
    }

    public clear() : void {
        var ptr = this.head;
        while (ptr !== null) {
            var next = ptr.next;
            pool.despawn(ptr);
            ptr = next;
        }
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    public contains(item : T) : boolean {
        var ptr = this.head;
        while(ptr !== null && ptr.element !== item) {
            ptr = ptr.next;
        }
        return ptr !== null;
    }

    public forEach(callback : (item : T) => boolean) : void {
        let currentNode = this.head;
        while (currentNode !== null) {
            if (callback(currentNode.element) === false) {
                return;
            }
            currentNode = currentNode.next;
        }
    }

    public get count() : number {
        return this.length;
    }

    public isEmpty() : boolean {
        return this.length === 0;
    }

}