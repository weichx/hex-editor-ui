export interface TypeOf<T> {
    new (a? : any, b? : any, c? : any) : T;
}

export interface TypeOf1<T, U> {
    new (u : U) : T;
}

export interface TypeOf2<T, U, V> {
    new (u : U, v : V) : T;
}