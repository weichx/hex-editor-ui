import {Queue} from "./queue";

export interface IPoolable {
    onSpawn() : void;
    onDespawn() : void;
}

export interface IPoolable1<T> {
    onSpawn(t : T) : void;
    onDespawn() : void;
}

export interface IPoolable2<T, U> {
    onSpawn(t : T, u : U) : void;
    onDespawn() : void;
}

export interface IPoolable3<T, U, V> {
    onSpawn(t : T, u : U, v : V) : void;
    onDespawn() : void;
}

interface INewable<T> {
    new() : T;
}

abstract class BaseObjectPool<T extends {onDespawn: () => void}> {

    protected type : INewable<T>;
    protected list : Queue<T>;

    constructor(type : INewable<T>, preload = 8) {
        this.type = type;
        this.list = new Queue<T>(preload);
        if(preload > 0) {
            for(let i = 0; i < preload; i++) {
                this.list.enqueue(new this.type());
            }
        }
    }

    protected getItem() : T {
        return this.list.count > 0 ? this.list.dequeue() : new this.type();
    }

    public despawn(item : T) : void {
        item.onDespawn();
        this.list.enqueue(item);
    }

}

export class Pool<T extends IPoolable> extends BaseObjectPool<T> {

    public spawn() : T {
        const item = this.getItem();
        item.onSpawn();
        return item;
    }

}

export class Pool1<T extends IPoolable1<U>, U> extends BaseObjectPool<T> {

    public spawn(arg : U) : T {
        const item = this.getItem();
        item.onSpawn(arg);
        return item;
    }

}

export class Pool2<T extends IPoolable2<U, V>, U, V> extends BaseObjectPool<T> {

    public spawn(arg0 : U, arg1 : V) : T {
        const item = this.getItem();
        item.onSpawn(arg0, arg1);
        return item;
    }

}

export class Pool3<T extends IPoolable3<U, V, W>, U, V, W> extends BaseObjectPool<T> {

    public spawn(arg0 : U, arg1 : V, arg2 : W) : T {
        const item = this.getItem();
        item.onSpawn(arg0, arg1, arg2);
        return item;
    }

}