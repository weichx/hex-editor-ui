import {MathUtil} from "./math_util";
import {Quaternion} from "./quaternion";
import {Vector3} from "./vector3";

export const enum MatrixIndex {
    RotScale00,
    RotScale01,
    RotScale02,
    RotScale10,
    RotScale11,
    RotScale12,
    RotScale20,
    RotScale21,
    RotScale22,
    PositionX,
    PositionY,
    PositionZ
}

export class Matrix {

    public readonly m : Float32Array;

    constructor() {
        this.m = new Float32Array(16);
        this.m[0] = 1.0;
        this.m[5] = 1.0;
        this.m[10] = 1.0;
        this.m[15] = 1.0;
    }

    public isIdentity() : boolean {
        if (this.m[0] !== 1.0 || this.m[5] !== 1.0 || this.m[10] !== 1.0 || this.m[15] !== 1.0)
            return false;

        return !(this.m[1] !== 0.0 || this.m[2] !== 0.0 || this.m[3] !== 0.0 ||
        this.m[4] !== 0.0 || this.m[6] !== 0.0 || this.m[7] !== 0.0 ||
        this.m[8] !== 0.0 || this.m[9] !== 0.0 || this.m[11] !== 0.0 ||
        this.m[12] !== 0.0 || this.m[13] !== 0.0 || this.m[14] !== 0.0);

    }

    /**
     * Returns the matrix determinant (float).
     */
    public determinant() : number {
        var temp1 = (this.m[10] * this.m[15]) - (this.m[11] * this.m[14]);
        var temp2 = (this.m[9] * this.m[15]) - (this.m[11] * this.m[13]);
        var temp3 = (this.m[9] * this.m[14]) - (this.m[10] * this.m[13]);
        var temp4 = (this.m[8] * this.m[15]) - (this.m[11] * this.m[12]);
        var temp5 = (this.m[8] * this.m[14]) - (this.m[10] * this.m[12]);
        var temp6 = (this.m[8] * this.m[13]) - (this.m[9] * this.m[12]);

        return ((((this.m[0] * (((this.m[5] * temp1) - (this.m[6] * temp2)) + (this.m[7] * temp3))) - (this.m[1] * (((this.m[4] * temp1) -
        (this.m[6] * temp4)) + (this.m[7] * temp5)))) + (this.m[2] * (((this.m[4] * temp2) - (this.m[5] * temp4)) + (this.m[7] * temp6)))) -
        (this.m[3] * (((this.m[4] * temp3) - (this.m[5] * temp5)) + (this.m[6] * temp6))));
    }

    public invert() : Matrix {
        return this.invertNew(this);
    }

    public add(other : Matrix) : Matrix {
        return this.addNew(other, this);
    }

    public addNew(other : Matrix, result : Matrix = null) : Matrix {
        if(result === null) {
            result = new Matrix();
        }
        for (var index = 0; index < 16; index++) {
            result.m[index] = this.m[index] + other.m[index];
        }
        return result;
    }

    public invertNew(out? : Matrix) : Matrix {
        out = out || new Matrix();
        var l1 = this.m[0];
        var l2 = this.m[1];
        var l3 = this.m[2];
        var l4 = this.m[3];
        var l5 = this.m[4];
        var l6 = this.m[5];
        var l7 = this.m[6];
        var l8 = this.m[7];
        var l9 = this.m[8];
        var l10 = this.m[9];
        var l11 = this.m[10];
        var l12 = this.m[11];
        var l13 = this.m[12];
        var l14 = this.m[13];
        var l15 = this.m[14];
        var l16 = this.m[15];
        var l17 = (l11 * l16) - (l12 * l15);
        var l18 = (l10 * l16) - (l12 * l14);
        var l19 = (l10 * l15) - (l11 * l14);
        var l20 = (l9 * l16) - (l12 * l13);
        var l21 = (l9 * l15) - (l11 * l13);
        var l22 = (l9 * l14) - (l10 * l13);
        var l23 = ((l6 * l17) - (l7 * l18)) + (l8 * l19);
        var l24 = -(((l5 * l17) - (l7 * l20)) + (l8 * l21));
        var l25 = ((l5 * l18) - (l6 * l20)) + (l8 * l22);
        var l26 = -(((l5 * l19) - (l6 * l21)) + (l7 * l22));
        var l27 = 1.0 / ((((l1 * l23) + (l2 * l24)) + (l3 * l25)) + (l4 * l26));
        var l28 = (l7 * l16) - (l8 * l15);
        var l29 = (l6 * l16) - (l8 * l14);
        var l30 = (l6 * l15) - (l7 * l14);
        var l31 = (l5 * l16) - (l8 * l13);
        var l32 = (l5 * l15) - (l7 * l13);
        var l33 = (l5 * l14) - (l6 * l13);
        var l34 = (l7 * l12) - (l8 * l11);
        var l35 = (l6 * l12) - (l8 * l10);
        var l36 = (l6 * l11) - (l7 * l10);
        var l37 = (l5 * l12) - (l8 * l9);
        var l38 = (l5 * l11) - (l7 * l9);
        var l39 = (l5 * l10) - (l6 * l9);

        out.m[0] = l23 * l27;
        out.m[4] = l24 * l27;
        out.m[8] = l25 * l27;
        out.m[12] = l26 * l27;
        out.m[1] = -(((l2 * l17) - (l3 * l18)) + (l4 * l19)) * l27;
        out.m[5] = (((l1 * l17) - (l3 * l20)) + (l4 * l21)) * l27;
        out.m[9] = -(((l1 * l18) - (l2 * l20)) + (l4 * l22)) * l27;
        out.m[13] = (((l1 * l19) - (l2 * l21)) + (l3 * l22)) * l27;
        out.m[2] = (((l2 * l28) - (l3 * l29)) + (l4 * l30)) * l27;
        out.m[6] = -(((l1 * l28) - (l3 * l31)) + (l4 * l32)) * l27;
        out.m[10] = (((l1 * l29) - (l2 * l31)) + (l4 * l33)) * l27;
        out.m[14] = -(((l1 * l30) - (l2 * l32)) + (l3 * l33)) * l27;
        out.m[3] = -(((l2 * l34) - (l3 * l35)) + (l4 * l36)) * l27;
        out.m[7] = (((l1 * l34) - (l3 * l37)) + (l4 * l38)) * l27;
        out.m[11] = -(((l1 * l35) - (l2 * l37)) + (l4 * l39)) * l27;
        out.m[15] = (((l1 * l36) - (l2 * l38)) + (l3 * l39)) * l27;

        return out;
    }

    public setTranslationValues(x : number, y : number, z : number) : Matrix {
        this.m[12] = x;
        this.m[13] = y;
        this.m[14] = z;
        return this;
    }

    public setTranslation(vector3 : Vector3) : Matrix {
        this.m[12] = vector3.x;
        this.m[13] = vector3.y;
        this.m[14] = vector3.z;
        return this;
    }

    public getTranslation(result? : Vector3) : Vector3 {
        return (result || new Vector3()).set(this.m[12], this.m[13], this.m[14]);
    }

    /**
     * Remove rotation and scaling part from the Matrix.
     * Returns the updated Matrix.
     */
    public removeRotationAndScaling() : Matrix {
        this.setRowFromFloats(0, 1, 0, 0, 0);
        this.setRowFromFloats(1, 0, 1, 0, 0);
        this.setRowFromFloats(2, 0, 0, 1, 0);
        return this;
    }

    public multiply(other : Matrix) : Matrix {
        return Matrix.Multiply(this, other, this);
    }

    public copy(other : Matrix) : Matrix {
        for (var index = 0; index < 16; index++) {
            this.m[index] = other.m[index];
        }
        return this;
    }

    public static MakeIdentityInFloatBuffer(buffer : Float32Array, offset : integer) {
        buffer[offset + 0] = 1;
        buffer[offset + 1] = 0;
        buffer[offset + 2] = 0;
        buffer[offset + 3] = 0;
        buffer[offset + 4] = 0;
        buffer[offset + 5] = 1;
        buffer[offset + 6] = 0;
        buffer[offset + 7] = 0;
        buffer[offset + 8] = 0;
        buffer[offset + 9] = 0;
        buffer[offset + 10] = 1;
        buffer[offset + 11] = 0;
        buffer[offset + 12] = 0;
        buffer[offset + 13] = 0;
        buffer[offset + 14] = 0;
        buffer[offset + 15] = 1;
    }

    public static FloatArrayMultiply(
        source : Float32Array, srcOffset : integer,
        target : Float32Array, targetOffset : integer,
        dest : Float32Array, destOffset : integer) {

        const m = source;
        const om = target;
        var tm0 = m[srcOffset + 0];
        var tm1 = m[srcOffset + 1];
        var tm2 = m[srcOffset + 2];
        var tm3 = m[srcOffset + 3];
        var tm4 = m[srcOffset + 4];
        var tm5 = m[srcOffset + 5];
        var tm6 = m[srcOffset + 6];
        var tm7 = m[srcOffset + 7];
        var tm8 = m[srcOffset + 8];
        var tm9 = m[srcOffset + 9];
        var tm10 = m[srcOffset + 10];
        var tm11 = m[srcOffset + 11];
        var tm12 = m[srcOffset + 12];
        var tm13 = m[srcOffset + 13];
        var tm14 = m[srcOffset + 14];
        var tm15 = m[srcOffset + 15];

        var om0 = om[targetOffset + 0];
        var om1 = om[targetOffset + 1];
        var om2 = om[targetOffset + 2];
        var om3 = om[targetOffset + 3];
        var om4 = om[targetOffset + 4];
        var om5 = om[targetOffset + 5];
        var om6 = om[targetOffset + 6];
        var om7 = om[targetOffset + 7];
        var om8 = om[targetOffset + 8];
        var om9 = om[targetOffset + 9];
        var om10 = om[targetOffset + 10];
        var om11 = om[targetOffset + 11];
        var om12 = om[targetOffset + 12];
        var om13 = om[targetOffset + 13];
        var om14 = om[targetOffset + 14];
        var om15 = om[targetOffset + 15];

        dest[destOffset + 0] = tm0 * om0 + tm1 * om4 + tm2 * om8 + tm3 * om12;
        dest[destOffset + 1] = tm0 * om1 + tm1 * om5 + tm2 * om9 + tm3 * om13;
        dest[destOffset + 2] = tm0 * om2 + tm1 * om6 + tm2 * om10 + tm3 * om14;
        dest[destOffset + 3] = tm0 * om3 + tm1 * om7 + tm2 * om11 + tm3 * om15;

        dest[destOffset + 4] = tm4 * om0 + tm5 * om4 + tm6 * om8 + tm7 * om12;
        dest[destOffset + 5] = tm4 * om1 + tm5 * om5 + tm6 * om9 + tm7 * om13;
        dest[destOffset + 6] = tm4 * om2 + tm5 * om6 + tm6 * om10 + tm7 * om14;
        dest[destOffset + 7] = tm4 * om3 + tm5 * om7 + tm6 * om11 + tm7 * om15;

        dest[destOffset + 8] = tm8 * om0 + tm9 * om4 + tm10 * om8 + tm11 * om12;
        dest[destOffset + 9] = tm8 * om1 + tm9 * om5 + tm10 * om9 + tm11 * om13;
        dest[destOffset + 10] = tm8 * om2 + tm9 * om6 + tm10 * om10 + tm11 * om14;
        dest[destOffset + 11] = tm8 * om3 + tm9 * om7 + tm10 * om11 + tm11 * om15;

        dest[destOffset + 12] = tm12 * om0 + tm13 * om4 + tm14 * om8 + tm15 * om12;
        dest[destOffset + 13] = tm12 * om1 + tm13 * om5 + tm14 * om9 + tm15 * om13;
        dest[destOffset + 14] = tm12 * om2 + tm13 * om6 + tm14 * om10 + tm15 * om14;
        dest[destOffset + 15] = tm12 * om3 + tm13 * om7 + tm14 * om11 + tm15 * om15;
    }

    //todo -- bottom row never changes, no need to multiply (probably)
    public multiplyNew(other : Matrix, result? : Matrix) : Matrix {
        const m = this.m;
        const om = other.m;
        var tm0 = m[0];
        var tm1 = m[1];
        var tm2 = m[2];
        var tm3 = m[3];
        var tm4 = m[4];
        var tm5 = m[5];
        var tm6 = m[6];
        var tm7 = m[7];
        var tm8 = m[8];
        var tm9 = m[9];
        var tm10 = m[10];
        var tm11 = m[11];
        var tm12 = m[12];
        var tm13 = m[13];
        var tm14 = m[14];
        var tm15 = m[15];

        var om0 = om[0];
        var om1 = om[1];
        var om2 = om[2];
        var om3 = om[3];
        var om4 = om[4];
        var om5 = om[5];
        var om6 = om[6];
        var om7 = om[7];
        var om8 = om[8];
        var om9 = om[9];
        var om10 = om[10];
        var om11 = om[11];
        var om12 = om[12];
        var om13 = om[13];
        var om14 = om[14];
        var om15 = om[15];
        result = result || new Matrix();
        const resultMatrix = result.m;
        resultMatrix[0] = tm0 * om0 + tm1 * om4 + tm2 * om8 + tm3 * om12;
        resultMatrix[1] = tm0 * om1 + tm1 * om5 + tm2 * om9 + tm3 * om13;
        resultMatrix[2] = tm0 * om2 + tm1 * om6 + tm2 * om10 + tm3 * om14;
        resultMatrix[3] = tm0 * om3 + tm1 * om7 + tm2 * om11 + tm3 * om15;

        resultMatrix[4] = tm4 * om0 + tm5 * om4 + tm6 * om8 + tm7 * om12;
        resultMatrix[5] = tm4 * om1 + tm5 * om5 + tm6 * om9 + tm7 * om13;
        resultMatrix[6] = tm4 * om2 + tm5 * om6 + tm6 * om10 + tm7 * om14;
        resultMatrix[7] = tm4 * om3 + tm5 * om7 + tm6 * om11 + tm7 * om15;

        resultMatrix[8] = tm8 * om0 + tm9 * om4 + tm10 * om8 + tm11 * om12;
        resultMatrix[9] = tm8 * om1 + tm9 * om5 + tm10 * om9 + tm11 * om13;
        resultMatrix[10] = tm8 * om2 + tm9 * om6 + tm10 * om10 + tm11 * om14;
        resultMatrix[11] = tm8 * om3 + tm9 * om7 + tm10 * om11 + tm11 * om15;

        resultMatrix[12] = tm12 * om0 + tm13 * om4 + tm14 * om8 + tm15 * om12;
        resultMatrix[13] = tm12 * om1 + tm13 * om5 + tm14 * om9 + tm15 * om13;
        resultMatrix[14] = tm12 * om2 + tm13 * om6 + tm14 * om10 + tm15 * om14;
        resultMatrix[15] = tm12 * om3 + tm13 * om7 + tm14 * om11 + tm15 * om15;
        return result;
    }

    /**
     * Boolean : True is the current Matrix and the passed one values are strictly equal.
     */
    public equals(value : Matrix) : boolean {
        return value &&
            (this.m[0] === value.m[0] && this.m[1] === value.m[1] && this.m[2] === value.m[2] && this.m[3] === value.m[3] &&
            this.m[4] === value.m[4] && this.m[5] === value.m[5] && this.m[6] === value.m[6] && this.m[7] === value.m[7] &&
            this.m[8] === value.m[8] && this.m[9] === value.m[9] && this.m[10] === value.m[10] && this.m[11] === value.m[11] &&
            this.m[12] === value.m[12] && this.m[13] === value.m[13] && this.m[14] === value.m[14] && this.m[15] === value.m[15]);
    }

    public clone(out? : Matrix) : Matrix {
        out = out || new Matrix();
        return Matrix.FromValues(this.m[0], this.m[1], this.m[2], this.m[3],
            this.m[4], this.m[5], this.m[6], this.m[7],
            this.m[8], this.m[9], this.m[10], this.m[11],
            this.m[12], this.m[13], this.m[14], this.m[15], out);
    }

    public getHashCode() : number {
        let hash = this.m[0] || 0;
        for (let i = 1; i < 16; i++) {
            hash = (hash * 397) ^ (this.m[i] || 0);
        }
        return hash;
    }

    /**
     * Decomposes the current Matrix into :
     * - a scale vector3 passed as a reference to highPriorityUpdate,
     * - a rotation quaternion passed as a reference to highPriorityUpdate,
     * - a translation vector3 passed as a reference to highPriorityUpdate.
     * Returns the boolean `true`.
     */
    public decompose(scale : Vector3, rotation : Quaternion, translation : Vector3) : boolean {
        translation.x = this.m[12];
        translation.y = this.m[13];
        translation.z = this.m[14];

        var xs = MathUtil.sign(this.m[0] * this.m[1] * this.m[2] * this.m[3]) < 0 ? -1 : 1;
        var ys = MathUtil.sign(this.m[4] * this.m[5] * this.m[6] * this.m[7]) < 0 ? -1 : 1;
        var zs = MathUtil.sign(this.m[8] * this.m[9] * this.m[10] * this.m[11]) < 0 ? -1 : 1;

        scale.x = xs * Math.sqrt(this.m[0] * this.m[0] + this.m[1] * this.m[1] + this.m[2] * this.m[2]);
        scale.y = ys * Math.sqrt(this.m[4] * this.m[4] + this.m[5] * this.m[5] + this.m[6] * this.m[6]);
        scale.z = zs * Math.sqrt(this.m[8] * this.m[8] + this.m[9] * this.m[9] + this.m[10] * this.m[10]);

        if (scale.x === 0 || scale.y === 0 || scale.z === 0) {
            rotation.x = 0;
            rotation.y = 0;
            rotation.z = 0;
            rotation.w = 1;
            return false;
        }
        Matrix.FromValues(
            this.m[0] / scale.x, this.m[1] / scale.x, this.m[2] / scale.x, 0,
            this.m[4] / scale.y, this.m[5] / scale.y, this.m[6] / scale.y, 0,
            this.m[8] / scale.z, this.m[9] / scale.z, this.m[10] / scale.z, 0,
            0, 0, 0, 1, internalScratch0);

        Quaternion.FromRotationMatrix(internalScratch0, rotation);

        return true;
    }

    public getScaleVector(out? : Vector3) : Vector3 {
        out = out || new Vector3();
        var xs = MathUtil.sign(this.m[0] * this.m[1] * this.m[2] * this.m[3]) < 0 ? -1 : 1;
        var ys = MathUtil.sign(this.m[4] * this.m[5] * this.m[6] * this.m[7]) < 0 ? -1 : 1;
        var zs = MathUtil.sign(this.m[8] * this.m[9] * this.m[10] * this.m[11]) < 0 ? -1 : 1;
        out.x = xs * Math.sqrt(this.m[0] * this.m[0] + this.m[1] * this.m[1] + this.m[2] * this.m[2]);
        out.y = ys * Math.sqrt(this.m[4] * this.m[4] + this.m[5] * this.m[5] + this.m[6] * this.m[6]);
        out.z = zs * Math.sqrt(this.m[8] * this.m[8] + this.m[9] * this.m[9] + this.m[10] * this.m[10]);
        return out;
    }

    public getScaleX() : number {
        var xs = MathUtil.sign(this.m[0] * this.m[1] * this.m[2] * this.m[3]) < 0 ? -1 : 1;
        return xs * Math.sqrt(this.m[0] * this.m[0] + this.m[1] * this.m[1] + this.m[2] * this.m[2]);
    }

    public getScaleY() : number {
        var ys = MathUtil.sign(this.m[4] * this.m[5] * this.m[6] * this.m[7]) < 0 ? -1 : 1;
        return ys * Math.sqrt(this.m[4] * this.m[4] + this.m[5] * this.m[5] + this.m[6] * this.m[6]);
    }

    public getScaleZ() : number {
        var zs = MathUtil.sign(this.m[8] * this.m[9] * this.m[10] * this.m[11]) < 0 ? -1 : 1;
        return zs * Math.sqrt(this.m[8] * this.m[8] + this.m[9] * this.m[9] + this.m[10] * this.m[10]);
    }

    /**
     * Returns a new Matrix as the extracted rotation matrix from the current one.
     */
    public getRotationMatrix(out? : Matrix) : Matrix {
        const result = out instanceof Matrix ? out : Matrix.Identity();
        var m = this.m;

        var xs = m[0] * m[1] * m[2] * m[3] < 0 ? -1 : 1;
        var ys = m[4] * m[5] * m[6] * m[7] < 0 ? -1 : 1;
        var zs = m[8] * m[9] * m[10] * m[11] < 0 ? -1 : 1;

        var sx = xs * Math.sqrt(m[0] * m[0] + m[1] * m[1] + m[2] * m[2]);
        var sy = ys * Math.sqrt(m[4] * m[4] + m[5] * m[5] + m[6] * m[6]);
        var sz = zs * Math.sqrt(m[8] * m[8] + m[9] * m[9] + m[10] * m[10]);

        Matrix.FromValues(
            m[0] / sx, m[1] / sx, m[2] / sx, 0,
            m[4] / sy, m[5] / sy, m[6] / sy, 0,
            m[8] / sz, m[9] / sz, m[10] / sz, 0,
            0, 0, 0, 1, result);
        return result;
    }

    public static FromArray(array : Array<number>, offset = 0, out : Matrix = null) : Matrix {
        if(out === null) {
            out = new Matrix();
        }
        const m = out.m;
        m[0] = array[offset + 0];
        m[1] = array[offset + 1];
        m[2] = array[offset + 2];
        m[3] = array[offset + 3];
        m[4] = array[offset + 4];
        m[5] = array[offset + 5];
        m[6] = array[offset + 6];
        m[7] = array[offset + 7];
        m[8] = array[offset + 8];
        m[9] = array[offset + 9];
        m[10] = array[offset + 10];
        m[11] = array[offset + 11];
        m[12] = array[offset + 12];
        m[13] = array[offset + 13];
        m[14] = array[offset + 14];
        m[15] = array[offset + 15];
        return out;
    }

    public static FromValues(initialM11 : number, initialM12 : number, initialM13 : number, initialM14 : number,
                             initialM21 : number, initialM22 : number, initialM23 : number, initialM24 : number,
                             initialM31 : number, initialM32 : number, initialM33 : number, initialM34 : number,
                             initialM41 : number, initialM42 : number, initialM43 : number, initialM44 : number, result? : Matrix) : Matrix {

        result = result || new Matrix();
        result.m[0] = initialM11;
        result.m[1] = initialM12;
        result.m[2] = initialM13;
        result.m[3] = initialM14;
        result.m[4] = initialM21;
        result.m[5] = initialM22;
        result.m[6] = initialM23;
        result.m[7] = initialM24;
        result.m[8] = initialM31;
        result.m[9] = initialM32;
        result.m[10] = initialM33;
        result.m[11] = initialM34;
        result.m[12] = initialM41;
        result.m[13] = initialM42;
        result.m[14] = initialM43;
        result.m[15] = initialM44;
        return result;
    }

    /**
     * Sets the index-th row of the current matrix with the passed 4 x float values.
     * Returns the updated Matrix.
     */
    public setRowFromFloats(index : number, x : number, y : number, z : number, w : number) : Matrix {
        if (index < 0 || index > 3) {
            return this;
        }
        const i = index * 4;
        this.m[i + 0] = x;
        this.m[i + 1] = y;
        this.m[i + 2] = z;
        this.m[i + 3] = w;
        return this;
    }

    // public static FloatArrayCompose(buffer : Float32Array, offset : integer, dest : Float32Array, destOffset : integer) {
    //     dest[destOffset + 0] = buffer[offset + LocalTransformIndices.ScaleX];
    //     dest[destOffset + 1] = 0;
    //     dest[destOffset + 2] = 0;
    //     dest[destOffset + 3] = 0;
    //     dest[destOffset + 4] = 0;
    //     dest[destOffset + 5] = buffer[offset + LocalTransformIndices.ScaleY];
    //     dest[destOffset + 6] = 0;
    //     dest[destOffset + 7] = 0;
    //     dest[destOffset + 8] = 0;
    //     dest[destOffset + 9] = 0;
    //     dest[destOffset + 10] = buffer[offset + LocalTransformIndices.ScaleZ];
    //     dest[destOffset + 11] = 0;
    //     dest[destOffset + 12] = 0;
    //     dest[destOffset + 13] = 0;
    //     dest[destOffset + 14] = 0;
    //     dest[destOffset + 15] = 1;
    //     const rotation = Quaternion.scratch0;
    //     rotation.x = buffer[offset + LocalTransformIndices.RotationX];
    //     rotation.y = buffer[offset + LocalTransformIndices.RotationY];
    //     rotation.z = buffer[offset + LocalTransformIndices.RotationW];
    //     rotation.w = buffer[offset + LocalTransformIndices.RotationZ];
    //     // todo -- rotation needs to work!
    //     // rotation.toRotationMatrix(internalScratch1);
    //     // internalScratch0.multiplyNew(internalScratch1, out);
    //     dest[destOffset + 12] = buffer[offset + LocalTransformIndices.PositionX];
    //     dest[destOffset + 13] = buffer[offset + LocalTransformIndices.PositionY];
    //     dest[destOffset + 14] = buffer[offset + LocalTransformIndices.PositionZ];
    // }

    public static Compose(scale : Vector3, rotation : Quaternion, translation : Vector3, result? : Matrix) : Matrix {
        result = result || new Matrix();
        const m = result.m;
        m[0] = scale.x;
        m[1] = 0;
        m[2] = 0;
        m[3] = 0;
        m[4] = 0;
        m[5] = scale.y;
        m[6] = 0;
        m[7] = 0;
        m[8] = 0;
        m[9] = 0;
        m[10] = scale.z;
        m[11] = 0;
        m[12] = 0;
        m[13] = 0;
        m[14] = 0;
        m[15] = 1;

        if(!rotation.isIdentity()) {
            rotation.toRotationMatrix(internalScratch1);
            internalScratch0.multiplyNew(internalScratch1, result);
        }

        m[12] = translation.x;
        m[13] = translation.y;
        m[14] = translation.z;

        return result;
    }

    public static Identity(out? : Matrix) : Matrix {
        out = out || new Matrix();
        return Matrix.FromValues(1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0, out);
    }

    /**
     * Returns a new zero Matrix.
     */
    public static Zero() : Matrix {
        return Matrix.FromValues(0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0,
            0.0, 0.0, 0.0, 0.0);
    }

    /**
     * Returns a new rotation matrix for "angle" radians around the X axis.
     */
    public static RotationX(angle : number) : Matrix {
        var result = new Matrix();
        Matrix.RotationXToRef(angle, result);
        return result;
    }

    public static Multiply(mat0 : Matrix, mat1 : Matrix, result? : Matrix) : Matrix {
        return mat0.multiplyNew(mat1, result || new Matrix());
    }

    /**
     * Sets the passed matrix "result" as a rotation matrix for "angle" radians around the X axis.
     */
    public static RotationXToRef(angle : number, result : Matrix) : void {
        var s = Math.sin(angle);
        var c = Math.cos(angle);

        result.m[0] = 1.0;
        result.m[15] = 1.0;

        result.m[5] = c;
        result.m[10] = c;
        result.m[9] = -s;
        result.m[6] = s;

        result.m[1] = 0.0;
        result.m[2] = 0.0;
        result.m[3] = 0.0;
        result.m[4] = 0.0;
        result.m[7] = 0.0;
        result.m[8] = 0.0;
        result.m[11] = 0.0;
        result.m[12] = 0.0;
        result.m[13] = 0.0;
        result.m[14] = 0.0;
    }

    /**
     * Returns a new rotation matrix for "angle" radians around the Y axis.
     */
    public static RotationY(angle : number) : Matrix {
        var result = new Matrix();
        Matrix.RotationYToRef(angle, result);
        return result;
    }

    /**
     * Sets the passed matrix "result" as a rotation matrix for "angle" radians around the Y axis.
     */
    public static RotationYToRef(angle : number, result : Matrix) : void {
        var s = Math.sin(angle);
        var c = Math.cos(angle);

        result.m[5] = 1.0;
        result.m[15] = 1.0;

        result.m[0] = c;
        result.m[2] = -s;
        result.m[8] = s;
        result.m[10] = c;

        result.m[1] = 0.0;
        result.m[3] = 0.0;
        result.m[4] = 0.0;
        result.m[6] = 0.0;
        result.m[7] = 0.0;
        result.m[9] = 0.0;
        result.m[11] = 0.0;
        result.m[12] = 0.0;
        result.m[13] = 0.0;
        result.m[14] = 0.0;
    }

    /**
     * Returns a new rotation matrix for "angle" radians around the Z axis.
     */
    public static RotationZ(angle : number) : Matrix {
        var result = new Matrix();
        Matrix.RotationZToRef(angle, result);
        return result;
    }

    /**
     * Sets the passed matrix "result" as a rotation matrix for "angle" radians around the Z axis.
     */
    public static RotationZToRef(angle : number, result : Matrix) : void {
        var s = Math.sin(angle);
        var c = Math.cos(angle);

        result.m[10] = 1.0;
        result.m[15] = 1.0;

        result.m[0] = c;
        result.m[1] = s;
        result.m[4] = -s;
        result.m[5] = c;

        result.m[2] = 0.0;
        result.m[3] = 0.0;
        result.m[6] = 0.0;
        result.m[7] = 0.0;
        result.m[8] = 0.0;
        result.m[9] = 0.0;
        result.m[11] = 0.0;
        result.m[12] = 0.0;
        result.m[13] = 0.0;
        result.m[14] = 0.0;
    }

    /**
     * Returns a new rotation matrix for "angle" radians around the passed axis.
     */
    public static RotationAxis(axis : Vector3, angle : number) : Matrix {
        var result = Matrix.Zero();
        Matrix.RotationAxisToRef(axis, angle, result);
        return result;
    }

    /**
     * Sets the passed matrix "result" as a rotation matrix for "angle" radians around the passed axis.
     */
    public static RotationAxisToRef(axis : Vector3, angle : number, result : Matrix) : void {
        var s = Math.sin(-angle);
        var c = Math.cos(-angle);
        var c1 = 1 - c;

        axis.normalize();

        result.m[0] = (axis.x * axis.x) * c1 + c;
        result.m[1] = (axis.x * axis.y) * c1 - (axis.z * s);
        result.m[2] = (axis.x * axis.z) * c1 + (axis.y * s);
        result.m[3] = 0.0;

        result.m[4] = (axis.y * axis.x) * c1 + (axis.z * s);
        result.m[5] = (axis.y * axis.y) * c1 + c;
        result.m[6] = (axis.y * axis.z) * c1 - (axis.x * s);
        result.m[7] = 0.0;

        result.m[8] = (axis.z * axis.x) * c1 - (axis.y * s);
        result.m[9] = (axis.z * axis.y) * c1 + (axis.x * s);
        result.m[10] = (axis.z * axis.z) * c1 + c;
        result.m[11] = 0.0;

        result.m[15] = 1.0;
    }

    /**
     * Returns a new Matrix as a rotation matrix from the Euler angles (y, x, z).
     */
    public static RotationYawPitchRoll(yaw : number, pitch : number, roll : number, out? : Matrix) : Matrix {
        out = out || new Matrix();
        const q = Quaternion.scratch0;
        Quaternion.RotationYawPitchRoll(yaw, pitch, roll, q);
        return q.toRotationMatrix(out);
    }

    public static CreateScale(x : number, y : number, z : number, result? : Matrix) : Matrix {
        result = result || new Matrix();
        result.m[0] = x;
        result.m[1] = 0.0;
        result.m[2] = 0.0;
        result.m[3] = 0.0;
        result.m[4] = 0.0;
        result.m[5] = y;
        result.m[6] = 0.0;
        result.m[7] = 0.0;
        result.m[8] = 0.0;
        result.m[9] = 0.0;
        result.m[10] = z;
        result.m[11] = 0.0;
        result.m[12] = 0.0;
        result.m[13] = 0.0;
        result.m[14] = 0.0;
        result.m[15] = 1.0;
        return result;
    }

    public static CreateTranslation(x : number, y : number, z : number, out? : Matrix) : Matrix {
        return Matrix.FromValues(1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            x, y, z, 1.0, out || new Matrix());
    }

    public static CreateTRS() {

    }

    /**
     * Returns a new Matrix whose values are the interpolated values for "gradien" (float) between the ones of the matrices "startValue" and "endValue".
     */
    public static Lerp(startValue : Matrix, endValue : Matrix, gradient : number) : Matrix {
        var result = Matrix.Zero();
        for (var index = 0; index < 16; index++) {
            result.m[index] = startValue.m[index] * (1.0 - gradient) + endValue.m[index] * gradient;
        }
        return result;
    }

    /**
     * Returns a new Matrix whose values are computed by :
     * - decomposing the the "startValue" and "endValue" matrices into their respective scale, rotation and translation matrices,
     * - interpolating for "gradient" (float) the values between each of these decomposed matrices between the start and the end,
     * - recomposing a new matrix from these 3 interpolated scale, rotation and translation matrices.
     */
    public static DecomposeLerp(startValue : Matrix, endValue : Matrix, gradient : number) : Matrix {
        var startScale = new Vector3(0, 0, 0);
        var startRotation = new Quaternion();
        var startTranslation = new Vector3(0, 0, 0);
        startValue.decompose(startScale, startRotation, startTranslation);

        var endScale = new Vector3(0, 0, 0);
        var endRotation = new Quaternion();
        var endTranslation = new Vector3(0, 0, 0);
        endValue.decompose(endScale, endRotation, endTranslation);

        var resultScale = Vector3.Lerp(startScale, endScale, gradient);
        var resultRotation = Quaternion.Slerp(startRotation, endRotation, gradient);
        var resultTranslation = Vector3.Lerp(startTranslation, endTranslation, gradient);

        return Matrix.Compose(resultScale, resultRotation, resultTranslation);
    }

    public static GetAsMatrix2x2(matrix : Matrix) : Float32Array {
        return new Float32Array([
            matrix.m[0], matrix.m[1],
            matrix.m[4], matrix.m[5]
        ]);
    }

    public static GetAsMatrix3x3(matrix : Matrix) : Float32Array {
        return new Float32Array([
            matrix.m[0], matrix.m[1], matrix.m[2],
            matrix.m[4], matrix.m[5], matrix.m[6],
            matrix.m[8], matrix.m[9], matrix.m[10]
        ]);
    }

    /**
     * Compute the transpose of the passed Matrix.
     * Returns a new Matrix.
     */
    public static Transpose(matrix : Matrix) : Matrix {
        var result = new Matrix();

        result.m[0] = matrix.m[0];
        result.m[1] = matrix.m[4];
        result.m[2] = matrix.m[8];
        result.m[3] = matrix.m[12];

        result.m[4] = matrix.m[1];
        result.m[5] = matrix.m[5];
        result.m[6] = matrix.m[9];
        result.m[7] = matrix.m[13];

        result.m[8] = matrix.m[2];
        result.m[9] = matrix.m[6];
        result.m[10] = matrix.m[10];
        result.m[11] = matrix.m[14];

        result.m[12] = matrix.m[3];
        result.m[13] = matrix.m[7];
        result.m[14] = matrix.m[11];
        result.m[15] = matrix.m[15];

        return result;
    }

    /**
     * Sets the passed matrix "mat" as a rotation matrix composed from the 3 passed  left handed axis.
     */
    public static FromXYZAxesToRef(xaxis : Vector3, yaxis : Vector3, zaxis : Vector3, mat : Matrix) {

        mat.m[0] = xaxis.x;
        mat.m[1] = xaxis.y;
        mat.m[2] = xaxis.z;

        mat.m[3] = 0.0;

        mat.m[4] = yaxis.x;
        mat.m[5] = yaxis.y;
        mat.m[6] = yaxis.z;

        mat.m[7] = 0.0;

        mat.m[8] = zaxis.x;
        mat.m[9] = zaxis.y;
        mat.m[10] = zaxis.z;

        mat.m[11] = 0.0;

        mat.m[12] = 0.0;
        mat.m[13] = 0.0;
        mat.m[14] = 0.0;

        mat.m[15] = 1.0;

    }

    /**
     * Sets the passed matrix "result" as a rotation matrix according to the passed quaternion.
     */
    public static FromQuaternionToRef(quat : Quaternion, result : Matrix) {

        var xx = quat.x * quat.x;
        var yy = quat.y * quat.y;
        var zz = quat.z * quat.z;
        var xy = quat.x * quat.y;
        var zw = quat.z * quat.w;
        var zx = quat.z * quat.x;
        var yw = quat.y * quat.w;
        var yz = quat.y * quat.z;
        var xw = quat.x * quat.w;

        result.m[0] = 1.0 - (2.0 * (yy + zz));
        result.m[1] = 2.0 * (xy + zw);
        result.m[2] = 2.0 * (zx - yw);
        result.m[3] = 0.0;
        result.m[4] = 2.0 * (xy - zw);
        result.m[5] = 1.0 - (2.0 * (zz + xx));
        result.m[6] = 2.0 * (yz + xw);
        result.m[7] = 0.0;
        result.m[8] = 2.0 * (zx + yw);
        result.m[9] = 2.0 * (yz - xw);
        result.m[10] = 1.0 - (2.0 * (yy + xx));
        result.m[11] = 0.0;

        result.m[12] = 0.0;
        result.m[13] = 0.0;
        result.m[14] = 0.0;

        result.m[15] = 1.0;
    }

    public static scratch0 = new Matrix();
    public static scratch1 = new Matrix();
    public static scratch2 = new Matrix();
    public static scratch3 = new Matrix();
    public static scratch4 = new Matrix();
    public static scratch5 = new Matrix();

}

const internalScratch0 = new Matrix();
const internalScratch1 = new Matrix();