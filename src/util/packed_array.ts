
const INDEX_MASK = 0xffff;
const NEW_OBJECT_ID_ADD = 0x10000;

class Index {
    id : integer = 0;
    next : integer = 0;
    index : integer = 0;
}
/*
//http://bitsquid.blogspot.de/2011/09/managing-decoupling-part-4-id-lookup.html
This is an unordered representation of data that will ensure the array values in use
are packed towards the front with no holes.
 */
//todo -- convert Index object to data array
export class PackedUint32Table {

    public numObjects : integer;
    public objects : Uint32Array;
    public indexEntries : Array<Index>;
    public freeListEnqueue : integer;
    public freeListDequeue : integer;
    public capacity : integer;
    public objectSize : integer;

    constructor(maxObjects : integer, objectSize : integer) {
        this.capacity = maxObjects;
        this.objectSize = objectSize;
        this.objects = new Uint32Array(maxObjects * objectSize);
        this.indexEntries = new Array<Index>(maxObjects);
        this.freeListDequeue = 1; //using 0 as null
        this.numObjects = 1; //using 0 as null
        this.freeListEnqueue = this.capacity - 1;
        for (var i = 0; i < this.capacity; i++) {
            var index = new Index();
            index.id = i;
            index.next = i + 1;
            this.indexEntries[i] = index;
        }
    }

    add() : integer {
        if(this.numObjects === this.capacity) {
            this.capacity *= 2;
            var oldObjects = this.objects;
            this.objects = new Uint32Array(this.capacity);
            this.objects.set(oldObjects, 0);
            for(var i = this.numObjects; i < this.capacity; i++) {
                var index = new Index();
                index.id = i;
                index.next = i + 1;
                this.indexEntries[i] = index;
            }
        }
        var indexEntry = this.indexEntries[this.freeListDequeue];
        this.freeListDequeue = indexEntry.next;
        //this lets us have multiple ids map to the same entry, so when we remove this id
        //then add a new one, we can add it in the same slot but the numeric id value
        //will have changed.
        indexEntry.id += NEW_OBJECT_ID_ADD;
        indexEntry.index = this.numObjects++;
        //init memory for object here
        const start = indexEntry.index;
        this.objects[start] = indexEntry.id;
        for (var i = 1; i < this.objectSize; i++) {
            this.objects[start + i] = 0; //or whatever you want here!
        }
        return indexEntry.id;
    }

    remove(id : integer) : void {
        var indexEntry = this.indexEntries[id & INDEX_MASK];
        if(indexEntry.id === id && indexEntry.index !== 0) {
            var objects = this.objects;
            var ptr = objects[indexEntry.index];
            var lastPtr = objects[--this.numObjects];
            for (var i = ptr; i < ptr + this.objectSize; i++) {
                objects[ptr + i] = objects[lastPtr + i];
            }
            indexEntry.index = 0;
            this.indexEntries[this.freeListEnqueue].next = id & INDEX_MASK;
            this.freeListEnqueue = id & INDEX_MASK;
        }
    }

    has(id : integer) : boolean {
        var indexEntry = this.indexEntries[id & INDEX_MASK];
        return indexEntry.id === id && indexEntry.index !== 0;
    }

    lookup(id : integer, dest : Array<integer>, offset : integer) : boolean {
        var indexEntry = this.indexEntries[id & INDEX_MASK];
        if(indexEntry.id === id && indexEntry.index !== 0) {
            const start = indexEntry.index;
            var end = start + this.objectSize;
            for(var i = 0; i < end; i++) {
                dest[offset + i] = this.objects[start + i];
            }
            return true;
        }
        return false;
    }

}
