interface Indexable<T> {
    [str : string] : T;
    [str : number] : T;
}