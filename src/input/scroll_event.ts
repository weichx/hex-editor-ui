export class HexScrollEvent {
    __brand : { evt : "HexScrollEvent" };
    public readonly deltaX : number;
    public readonly deltaY : number;

    constructor(x : number, y : number) {
        this.deltaX = x;
        this.deltaY = y;
    }

}