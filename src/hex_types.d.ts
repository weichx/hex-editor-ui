interface Window {
    HexRuntime : any;
    nw : any;
}

interface Pair<T, U> {
    first : T;
    second : U;
}

interface Tuple2<T, U> extends Pair<T, U> {}

interface Tuple3<T, U, V> extends Tuple2<T, U> {
    third : V;
}

interface Tuple4<T, U, V, W> extends Tuple3<T, U, V> {
    fourth : W;
}

interface Node {
    insertChild(child : Node, index : number) : void;
}

type HexColor = integer;
type integer = number;
type float = number;
type double = number;
type bit = integer;
type byte = integer;
type char = string;
type uint32 = number;

type Copy<T> = T;
type Reference<T> = T;
type Value<T> = T;
type ColorInt = integer;
type UnitValueInt = integer;

type EntityId = { id : "just_for_type_checking" } | integer;
declare function createStyleSheet(css : string) : void;
