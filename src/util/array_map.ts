type integer = number;

class Index {
    id : integer = 0;
    next : integer = 0;
    index : integer = 0;
}
const INDEX_MASK = 0xffff;
const NEW_OBJECT_ID_ADD = 0x10000;
//todo -- convert Index object to data array

export class ArrayMap<T> {

    private numObjects : integer;
    private objects : Array<T>;
    private indexEntries : Array<Index>;
    private freeListEnqueue : integer;
    private freeListDequeue : integer;
    private capacity : integer;

    constructor(capacity : integer = 16) {
        this.capacity = capacity;
        this.objects = new Array<T>(capacity);
        this.indexEntries = new Array<Index>(capacity);
        this.freeListDequeue = 0;
        this.numObjects = 0;
        this.freeListEnqueue = this.capacity - 1;
        for (var i = 0; i < this.capacity; i++) {
            var index = new Index();
            index.id = i;
            index.next = i + 1;
            this.indexEntries[i] = index;
        }
    }

    public add(object : T) {
        if (this.numObjects === this.capacity) {
            this.objects.length *= 2;
            this.indexEntries.length *= 2;
            for (var i = 0; i < this.numObjects; i++) {
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
        this.objects[indexEntry.index] = object;
        return indexEntry.id;
    }

    public get(id : integer) : T {
        var indexEntry = this.indexEntries[id & INDEX_MASK];
        if (indexEntry.id === id && indexEntry.index !== 0) {
            return this.objects[indexEntry.index];
        }
        return null;
    }

    public has(id : integer) {
        var indexEntry = this.indexEntries[id & INDEX_MASK];
        return (indexEntry.id === id && indexEntry.index !== 0);
    }

}
