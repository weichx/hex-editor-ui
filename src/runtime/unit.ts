
export const enum UnitType {
    Pixel = 0,
    Percent = 1 << 1,
    Auto = 1 << 2,
    Viewport = 1 << 3,
    Em = 1 << 4,
    Rem = 1 << 5,
    ParentContent = 1 << 9,
    Content = 1 << 6,
    MaxContent = 1 << 7,
    MinContent = 1 << 8,

    Relative = Percent | ParentContent
}

export class UnitValue {

    public multiple : number;
    public referenceValue : number;
    public unit : UnitType;

    constructor(multiple : number, unit : UnitType = UnitType.Pixel) {
        this.multiple = multiple;
        this.unit = unit;
        this.referenceValue = 1.0;
    }

    public getValue() : number {
        return this.referenceValue * this.multiple;
    }

}

export interface UnitValue2 {
    readonly unit : UnitType;
    readonly value : float;
    __for_compiler_: "dafea3qn";
}
