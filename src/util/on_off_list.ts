export class OnOffList<T> {

    private activeList : Array<T>;   //todo merge into a single array
    private inactiveList : Array<T>; //todo merge into a single array
    private iterateFn : (item : T) => void;
    private iteratorIndex : integer;
    private didIterateMap : Set<T>; //todo make this faster later

    constructor(iterateFn : (item : T) => void) {
        this.iteratorIndex = -1;
        this.activeList = new Array<T>();
        this.inactiveList = new Array<T>();
        this.didIterateMap = new Set<T>();
        this.iterateFn = iterateFn;
    }

    private get isIterating() {
        return this.iteratorIndex !== -1;
    }

    public clearActive() : void {
        this.activeList.length = 0;
    }

    public clearInactive() : void {
        this.inactiveList.length = 0;
    }

    public iterate() {
        if (this.isIterating) {
            throw new Error("Already iterating ActiveInactiveArray");
        }
        this.iteratorIndex = 0;
        while (this.iteratorIndex < this.activeList.length) {
            const item = this.activeList[this.iteratorIndex];
            this.didIterateMap.add(item);
            this.iterateFn(item);
            this.iteratorIndex++;
        }
        this.iteratorIndex = -1;
        this.didIterateMap.clear();
    }

    public activate(item : T) {

        const activeIndex = this.activeList.indexOf(item);

        //if already in active list -> bail, can't be in inactive and doesn't matter if it got iterated or not
        if (activeIndex !== -1) return;

        const inactiveIndex = this.inactiveList.indexOf(item);

        if (inactiveIndex !== -1) {
            this.inactiveList.unstableRemoveAt(inactiveIndex);
        }

        if (this.didIterateMap.has(item)) {
            //item was active this frame, make sure we don't give it 2 iteration calls
            this.activeList.insert(item, this.iteratorIndex++);
        }
        else {
            //item was not active before (during iteration) or hasn't been updated yet
            this.activeList.push(item);
        }
    }

    deactivate(item : T) {

        const activeIndex = this.activeList.indexOf(item);
        const inactiveIdx = this.inactiveList.indexOf(item);

        if (inactiveIdx === -1) this.inactiveList.push(item);

        if (activeIndex === -1) { return; }
        if (this.isIterating) {
            this.activeList.removeAt(activeIndex);
            if (activeIndex <= this.iteratorIndex) {
                this.iteratorIndex--;
            }
        }
        else {
            this.activeList.unstableRemoveAt(activeIndex);
        }

    }

    public add(item : T, isActive = true) {
        isActive ? this.activate(item) : this.deactivate(item);
    }

    remove(item : T) {

        const activeIndex = this.activeList.indexOf(item);
        const inactiveIdx = this.inactiveList.indexOf(item);

        if (activeIndex !== -1) {
            if (this.isIterating) {
                this.activeList.removeAt(activeIndex);
                if (this.iteratorIndex >= activeIndex) {
                    this.iteratorIndex--;
                }
                return;
            }
            else {
                this.activeList.unstableRemoveAt(activeIndex);
            }
        }
        else if (inactiveIdx !== -1) {
            this.inactiveList.unstableRemoveAt(inactiveIdx);
        }

    }

}
