import {UnitType, UnitValue} from "../runtime/unit";

export class OffsetRectangle {

    public top : UnitValue;
    public bottom : UnitValue;
    public left : UnitValue;
    public right : UnitValue;

    constructor() {
        this.top = new UnitValue(0, UnitType.Pixel);
        this.right = new UnitValue(0, UnitType.Pixel);
        this.bottom = new UnitValue(0, UnitType.Pixel);
        this.left = new UnitValue(0, UnitType.Pixel);
    }

}


