declare global {

    interface Array<T> {
        add(item : T) : void;
        remove(item : T) : boolean;
        removeAt(index : number) : boolean;
        unstableRemove(item : T) : boolean;
        unstableRemoveAt(index : number) : boolean;
        getFirst() : T;
        getLast() : T;
        contains(item : T) : boolean;
        insert(item : T, index : number) : void;
        swap(srcIdx : number, dstIdx : number) : void;
        isEmpty() : boolean;
        insertSorted(item : T, compareFn : (a : T, b : T) => number) : number;
        clone() : Array<T>;
        clear() : void;
    }

    interface ArrayConstructor {
        clone<T>(array : ReadonlyArray<T>, out? : Array<T>) : Array<T>;
        copy<T>(src : ReadonlyArray<T>, dst? : Array<T>) : Array<T>;
    }

}

Array.clone = function<T>(array : ReadonlyArray<T>, out? : Array<T>) : Array<T> {
    if(out) {
        out.length = array.length;
    }
    else {
        out = new Array<T>(array.length);
    }
    for(let i = 0; i < array.length; i++) {
        out[i] = array[i];
    }
    return out;
};

Array.copy = function<T>(src : ReadonlyArray<T>, dst : Array<T>) : Array<T> {
    dst.length = src.length;
    for(let i = 0; i < src.length; i++) {
        dst[i] = src[i];
    }
    return dst;
};

Array.prototype.clone = function<T>(out? : Array<T>) {
    return Array.clone(this, out);
};

Array.prototype.isEmpty = function() {
    return this.length === 0;
};

Array.prototype.insertSorted = function<T>(item : T, compareFn : (a : T, b : T) => number) : number {
    const length = this.length;
    if(this.length === 0) {
        this.push(item);
        return 0;
    }
    for(let i = 0; i < length; i++) {
        let result = compareFn(this[i], item);
        if(result <= 0) {
            this.insert(item, i);
            return i;
        }
    }
    this.push(item);
    return length;
};

Array.prototype.swap = function (srcIdx : number, dstIdx : number) {
    const temp = this[srcIdx];
    this[srcIdx] = this[dstIdx];
    this[dstIdx] = temp;
};

Array.prototype.contains = function<T>(item : T) : boolean {
    const length = this.length;
    for(let i = 0; i < length; i++) {
        if(this[i] === item) return true;
    }
    return false;
};

Array.prototype.getFirst = function () {
    return this[0];
};

Array.prototype.getLast = function () {
    return this[this.length - 1];
};

Array.prototype.remove = function<T>(item : T) : boolean {
    const length = this.length;
    for (let i = 0; i < length; i++) {
        if (this[i] === item) {
            while (i < length) {
                this[i] = this[i + 1];
                i++
            }
            this.length--;
            return true;
        }
    }
    return false;
};

Array.prototype.removeAt = function (index : number) {
    let len = this.length;
    if (!len) { return false }
    while (index < len) {
        this[index] = this[index + 1];
        index++
    }
    this.length--;
    return true;
};

Array.prototype.unstableRemove = function<T>(item : T) : boolean {
    const length = this.length;
    for (let i = 0; i < length; i++) {
        if (this[i] === item) {
            this[i] = this[length - 1];
            this.length--;
            return true;
        }
    }
    return false;
};

Array.prototype.unstableRemoveAt = function(index : number) : boolean {
    if(index >= this.length || index < 0) return false;
    this[index] = this[this.length - 1];
    this.length--;
    return true;
};

Array.prototype.insert = function<T>(item : T, index : number) : void {
    let i = this.length;
    this.length++;
    if(index >= this.length) {
        this[this.length - 1] = item;
        return;
    }
    while(i !== index) {
        this[i] = this[--i];
    }
    this[index] = item;
};

Array.prototype.clear = function () {
    this.length = 0;
};

export default 0;