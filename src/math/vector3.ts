import {Quaternion} from "./quaternion";
import {Matrix} from "./matrix4x4";

export class Vector3 {

    public x : number;
    public y : number;
    public z : number;

    constructor(x : number = 0, y : number = 0, z : number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public toString() : string {
        return "{x: " + this.x + " y:" + this.y + " z:" + this.z + "}";
    }

    public getHashCode() : number {
        let hash = this.x || 0;
        hash = (hash * 397) ^ (this.y || 0);
        hash = (hash * 397) ^ (this.z || 0);
        return hash;
    }

    public toQuaternion(out? : Quaternion) : Quaternion {
        var result = out || new Quaternion(0.0, 0.0, 0.0, 1.0);

        var cosxPlusz = Math.cos((this.x + this.z) * 0.5);
        var sinxPlusz = Math.sin((this.x + this.z) * 0.5);
        var coszMinusx = Math.cos((this.z - this.x) * 0.5);
        var sinzMinusx = Math.sin((this.z - this.x) * 0.5);
        var cosy = Math.cos(this.y * 0.5);
        var siny = Math.sin(this.y * 0.5);

        result.x = coszMinusx * siny;
        result.y = -sinzMinusx * siny;
        result.z = sinxPlusz * cosy;
        result.w = cosxPlusz * cosy;
        return result;
    }

    public addVector(otherVector : Vector3) : Vector3 {
        this.x += otherVector.x;
        this.y += otherVector.y;
        this.z += otherVector.z;
        return this;
    }

    public addVectorNew(other : Vector3, out? : Vector3) : Vector3 {
        return (out || new Vector3()).set(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    public addValues(x : number, y : number, z : number) : this {
        this.x += x;
        this.y += y;
        this.z += z;
        return this;
    }

    public subVector(other : Vector3) : Vector3 {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        return this;
    }

    public subVectorNew(other : Vector3, out? : Vector3) : Vector3 {
        return (out || new Vector3()).set(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    public subValues(x : number, y : number, z : number) : Vector3 {
        this.x -= x;
        this.y -= y;
        this.z -= z;
        return this;
    }

    public invert() : Vector3 {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }

    public invertNew(out? : Vector3) {
        return (out || new Vector3()).set(-this.x, -this.y, -this.z);
    }

    public scale(scale : number) : Vector3 {
        this.x *= scale;
        this.y *= scale;
        this.z *= scale;
        return this;
    }

    public scaleNew(scale : number, out? : Vector3) : Vector3 {
        return (out || new Vector3()).set(this.x * scale, this.y * scale, this.z * scale);
    }

    public equals(other : Vector3) : boolean {
        return other && this.x === other.x && this.y === other.y && this.z === other.z;
    }

    public hasValues(x : number, y : number, z : number) : boolean {
        return this.x === x && this.y === y && this.z === z;
    }

    public multiply(other : Vector3) : Vector3 {
        this.x *= other.x;
        this.y *= other.y;
        this.z *= other.z;
        return this;
    }

    public multiplyNew(other : Vector3, out? : Vector3) : Vector3 {
        out = out || new Vector3();
        out.x = this.x * other.x;
        out.y = this.y * other.y;
        out.z = this.z * other.z;
        return this;
    }

    public multiplyValues(x : number, y : number, z : number) : Vector3 {
        this.x *= x;
        this.y *= y;
        this.z *= z;
        return this;
    }

    public divide(other : Vector3) : Vector3 {
        this.x /= other.x;
        this.y /= other.y;
        this.z /= other.z;
        return this;
    }

    public divideNew(otherVector : Vector3, result? : Vector3) : Vector3 {
        result = result || new Vector3();
        result.x = this.x / otherVector.x;
        result.y = this.y / otherVector.y;
        result.z = this.z / otherVector.z;
        return result;
    }

    public minimize(other : Vector3) : Vector3 {
        if (other.x < this.x) this.x = other.x;
        if (other.y < this.y) this.y = other.y;
        if (other.z < this.z) this.z = other.z;
        return this;
    }

    public maximize(other : Vector3) : Vector3 {
        if (other.x > this.x) this.x = other.x;
        if (other.y > this.y) this.y = other.y;
        if (other.z > this.z) this.z = other.z;
        return this;
    }

    public length() : number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    public lengthSquared() : number {
        return (this.x * this.x + this.y * this.y + this.z * this.z);
    }

    public normalize() : Vector3 {
        var len = this.length();
        if (len === 0 || len === 1.0)
            return this;

        var num = 1.0 / len;
        this.x *= num;
        this.y *= num;
        this.z *= num;
        return this;
    }

    public clone(out? : Vector3) : Vector3 {
        out = out || new Vector3();
        out.x = this.x;
        out.y = this.y;
        out.z = this.z;
        return out;
    }

    public copy(source : Vector3) : Vector3 {
        this.x = source.x;
        this.y = source.y;
        this.z = source.z;
        return this;
    }

    public set(x : number, y : number, z : number = 0) : Vector3 {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    public static GetClipFactor(vector0 : Vector3, vector1 : Vector3, axis : Vector3, size : number) {
        var d0 = Vector3.Dot(vector0, axis) - size;
        var d1 = Vector3.Dot(vector1, axis) - size;
        return d0 / (d0 - d1);
    }

    public static readonly Zero : Readonly<Vector3> = new Vector3();
    public static readonly Up : Readonly<Vector3> = new Vector3(0.0, 1.0, 0.0);
    public static Forward : Readonly<Vector3> = new Vector3(0.0, 0.0, 1.0);
    public static Right : Readonly<Vector3> = new Vector3(1.0, 0.0, 0.0);
    public static Left : Readonly<Vector3> = new Vector3(-1.0, 0.0, 0.0);

    //Transforms coordiantes into matrix's space, does not transform direction
    public static TransformCoordinates(vector : Vector3, transformation : Matrix, out? : Vector3) : Vector3 {
        var result = out || new Vector3();
        var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + (vector.z * transformation.m[8]) + transformation.m[12];
        var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + (vector.z * transformation.m[9]) + transformation.m[13];
        var z = (vector.x * transformation.m[2]) + (vector.y * transformation.m[6]) + (vector.z * transformation.m[10]) + transformation.m[14];
        var w = (vector.x * transformation.m[3]) + (vector.y * transformation.m[7]) + (vector.z * transformation.m[11]) + transformation.m[15];

        result.x = x / w;
        result.y = y / w;
        result.z = z / w;
        return result;
    }

    //Transforms coordiantes into matrix's space, does not transform direction
    public static TransformCoordinatesFromFloats(x : number, y : number, z : number, transformation : Matrix, result? : Vector3) : Vector3 {
        result = result || new Vector3();
        var rx = (x * transformation.m[0]) + (y * transformation.m[4]) + (z * transformation.m[8]) + transformation.m[12];
        var ry = (x * transformation.m[1]) + (y * transformation.m[5]) + (z * transformation.m[9]) + transformation.m[13];
        var rz = (x * transformation.m[2]) + (y * transformation.m[6]) + (z * transformation.m[10]) + transformation.m[14];
        var rw = (x * transformation.m[3]) + (y * transformation.m[7]) + (z * transformation.m[11]) + transformation.m[15];

        result.x = rx / rw;
        result.y = ry / rw;
        result.z = rz / rw;
        return result;
    }

    /**
     * Returns a new Vector3 set with the result of the normal transformation by the passed matrix of the passed vector.
     * This methods computes transformed normalized direction vectors only.
     */
    public static TransformNormal(vector : Vector3, transformation : Matrix, out? : Vector3) : Vector3 {
        var result = out || new Vector3();
        var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + (vector.z * transformation.m[8]);
        var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + (vector.z * transformation.m[9]);
        var z = (vector.x * transformation.m[2]) + (vector.y * transformation.m[6]) + (vector.z * transformation.m[10]);
        result.x = x;
        result.y = y;
        result.z = z;
        return result;
    }

    /**
     * Sets the passed vector "result" with the result of the normal transformation by the passed matrix of the passed floats (x, y, z).
     * This methods computes transformed normalized direction vectors only.
     */
    public static TransformNormalFromFloats(x : number, y : number, z : number, transformation : Matrix, result? : Vector3) : Vector3 {
        result = result || new Vector3();
        result.x = (x * transformation.m[0]) + (y * transformation.m[4]) + (z * transformation.m[8]);
        result.y = (x * transformation.m[1]) + (y * transformation.m[5]) + (z * transformation.m[9]);
        result.z = (x * transformation.m[2]) + (y * transformation.m[6]) + (z * transformation.m[10]);
        return result;
    }

    /**
     * Returns a new Vector3 located for "amount" on the CatmullRom interpolation spline defined by the vectors "value1", "value2", "value3", "value4".
     */
    public static CatmullRom(value1 : Vector3, value2 : Vector3, value3 : Vector3, value4 : Vector3, amount : number, result? : Vector3) : Vector3 {
        result = result || new Vector3();
        var squared = amount * amount;
        var cubed = amount * squared;

        var x = 0.5 * ((((2.0 * value2.x) + ((-value1.x + value3.x) * amount)) +
            (((((2.0 * value1.x) - (5.0 * value2.x)) + (4.0 * value3.x)) - value4.x) * squared)) +
            ((((-value1.x + (3.0 * value2.x)) - (3.0 * value3.x)) + value4.x) * cubed));

        var y = 0.5 * ((((2.0 * value2.y) + ((-value1.y + value3.y) * amount)) +
            (((((2.0 * value1.y) - (5.0 * value2.y)) + (4.0 * value3.y)) - value4.y) * squared)) +
            ((((-value1.y + (3.0 * value2.y)) - (3.0 * value3.y)) + value4.y) * cubed));

        var z = 0.5 * ((((2.0 * value2.z) + ((-value1.z + value3.z) * amount)) +
            (((((2.0 * value1.z) - (5.0 * value2.z)) + (4.0 * value3.z)) - value4.z) * squared)) +
            ((((-value1.z + (3.0 * value2.z)) - (3.0 * value3.z)) + value4.z) * cubed));
        result.x = x;
        result.y = y;
        result.z = z;
        return result;
    }

    /**
     * Returns a new Vector3 set with the coordinates of "value", if the vector "value" is in the cube defined by the vectors "min" and "max".
     * If a coordinate value of "value" is lower than one of the "min" coordinate, then this "value" coordinate is set with the "min" one.
     * If a coordinate value of "value" is greater than one of the "max" coordinate, then this "value" coordinate is set with the "max" one.
     */
    public static Clamp(value : Vector3, min : Vector3, max : Vector3, out? : Vector3) : Vector3 {
        out = out || new Vector3();
        var x = value.x;
        x = (x > max.x) ? max.x : x;
        x = (x < min.x) ? min.x : x;

        var y = value.y;
        y = (y > max.y) ? max.y : y;
        y = (y < min.y) ? min.y : y;

        var z = value.z;
        z = (z > max.z) ? max.z : z;
        z = (z < min.z) ? min.z : z;
        out.x = x;
        out.y = y;
        out.z = z;
        return out;
    }

    public static Hermite(value1 : Vector3, tangent1 : Vector3, value2 : Vector3, tangent2 : Vector3, amount : number, out? : Vector3) : Vector3 {
        out = out || new Vector3();
        var squared = amount * amount;
        var cubed = amount * squared;
        var part1 = ((2.0 * cubed) - (3.0 * squared)) + 1.0;
        var part2 = (-2.0 * cubed) + (3.0 * squared);
        var part3 = (cubed - (2.0 * squared)) + amount;
        var part4 = cubed - squared;

        out.x = (((value1.x * part1) + (value2.x * part2)) + (tangent1.x * part3)) + (tangent2.x * part4);
        out.y = (((value1.y * part1) + (value2.y * part2)) + (tangent1.y * part3)) + (tangent2.y * part4);
        out.z = (((value1.z * part1) + (value2.z * part2)) + (tangent1.z * part3)) + (tangent2.z * part4);
        return out;
    }

    public static Lerp(start : Vector3, end : Vector3, amount : number, out? : Vector3) : Vector3 {
        var result = out || new Vector3(0, 0, 0);
        result.x = start.x + ((end.x - start.x) * amount);
        result.y = start.y + ((end.y - start.y) * amount);
        result.z = start.z + ((end.z - start.z) * amount);
        return result;
    }

    public static Dot(left : Vector3, right : Vector3) : number {
        return (left.x * right.x + left.y * right.y + left.z * right.z);
    }

    public static Cross(left : Vector3, right : Vector3, out? : Vector3) : Vector3 {
        var result = out || new Vector3();
        result.x = left.y * right.z - left.z * right.y;
        result.y = left.z * right.x - left.x * right.z;
        result.z = left.x * right.y - left.y * right.x;
        return result;
    }

    public static Normalize(vector : Vector3, out? : Vector3) : Vector3 {
        const result = out instanceof Vector3 ? out : new Vector3();
        result.x = vector.x;
        result.y = vector.y;
        result.z = vector.z;
        return result.normalize();
    }

    public static minimize(left : Vector3, right : Vector3) : Vector3 {
        var min = left.clone();
        min.minimize(right);
        return min;
    }

    public static Maximize(left : Vector3, right : Vector3) : Vector3 {
        var max = left.clone();
        max.maximize(right);
        return max;
    }

    public static Distance(value1 : Vector3, value2 : Vector3) : number {
        return Math.sqrt(Vector3.DistanceSquared(value1, value2));
    }

    public static DistanceSquared(value1 : Vector3, value2 : Vector3) : number {
        var x = value1.x - value2.x;
        var y = value1.y - value2.y;
        var z = value1.z - value2.z;
        return (x * x) + (y * y) + (z * z);
    }

    public static Center(value1 : Vector3, value2 : Vector3, out? : Vector3) : Vector3 {
        return value1.addVectorNew(value2, out).scale(0.5);
    }

    /**
     * Given three orthogonal normalized left-handed oriented Vector3 axis in space (target system),
     * RotationFromAxis() returns the rotation Euler angles (ex : rotation.x, rotation.y, rotation.z) to apply
     * to something in order to rotate it from its local system to the given target system.
     * Note : axis1, axis2 and axis3 are normalized during this operation.
     * Returns a new Vector3.
     */
    public static RotationFromAxis(axis1 : Vector3, axis2 : Vector3, axis3 : Vector3, out? : Vector3) : Vector3 {
        out = out || new Vector3();
        Quaternion.RotationQuaternionFromAxis(axis1, axis2, axis3, Quaternion.scratch0);
        return Quaternion.scratch0.toEulerAngles(out);
    }

    public static readonly scratch0 = new Vector3();
    public static readonly scratch1 = new Vector3();
    public static readonly scratch2 = new Vector3();
    public static readonly scratch3 = new Vector3();
    public static readonly scratch4 = new Vector3();

}
