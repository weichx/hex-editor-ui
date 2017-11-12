interface INewable<T> {
    new (w? : any, x? : any, y? : any, z? : any) : T;
}

interface INewable1<T, U> {
    new(u : U) : T;
}

interface INewable2<T, U, V> {
    new(u : U, v : V) : T;
}