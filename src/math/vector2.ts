import {MathUtil} from "./math_util";

export interface IVector2 {
    x : number;
    y : number;
}

export class Vector2 {

    public x : number;
    public y : number;

    constructor(x : number = 0, y : number = 0) {
        this.x = x;
        this.y = y;
    }

    public set(x : number, y : number) : Vector2 {
        this.x = x;
        this.y = y;
        return this;
    }

    public scale(factor : number) : Vector2 {
        this.x *= factor;
        this.y *= factor;
        return this;
    }

    public scaleNew(factor : number, out? : Vector2) : Vector2 {
        return (out || new Vector2()).set(this.x * factor, this.y * factor);
    }

    public addScalar(scalar : number) : Vector2 {
        this.x += scalar;
        this.y += scalar;
        return this;
    }

    public addScalarNew(scalar : number, out? : Vector2) : Vector2 {
        return (out || new Vector2()).set(this.x + scalar, this.y + scalar);
    }

    public subScalar(scalar : number) : Vector2 {
        this.x -= scalar;
        this.y -= scalar;
        return this;
    }

    public divideScalar(scalar : number) : Vector2 {
        if (scalar !== 0) {
            this.x /= scalar;
            this.y /= scalar;
        }
        else {
            this.x = 0;
            this.y = 0;
        }
        return this;
    }

    public divideScalarNew(scalar : number, out? : Vector2) : Vector2 {
        out = out || new Vector2();
        if (scalar !== 0) {
            out.x = this.x / scalar;
            out.y = this.y / scalar;
        }
        return out;
    }

    public subScalarNew(scalar : number) : Vector2 {
        return new Vector2(this.x - scalar, this.y - scalar);
    }

    public invert() : Vector2 {
        this.x *= -1;
        this.y *= -1;
        return this;
    }

    public invertNew(out? : Vector2) : Vector2 {
        return (out || new Vector2).set(this.x * -1, this.y * -1);
    }

    public clamp(length : number) : Vector2 {
        const lengthSq = this.lengthSquared();
        if (length * length > lengthSq) {
            this.normalize();
            this.scale(length);
        }
        return this;
    }

    public clampToVector0(vector : IVector2) : this {
        this.x = MathUtil.clamp(this.x, 0, vector.x);
        this.y = MathUtil.clamp(this.y, 0, vector.y);
        return this;
    }

    public dot(other : IVector2) : number {
        return this.x * other.x + this.y * other.y;
    }

    public cross(other : IVector2) : number {
        return (this.x * other.y ) - (this.y * other.x );
    }

    public normalize() : this {
        var length = this.length();

        if (length === 0) {
            this.x = 1;
            this.y = 0;
        } else {
            this.x /= length;
            this.y /= length;
        }
        return this;
    }

    public normalizeNew() : Vector2 {
        const length = this.length();
        const retn = new Vector2();
        if (length === 0) {
            retn.x = 1;
            retn.y = 0;
        } else {
            retn.x = this.x / length;
            retn.y = this.y / length;
        }
        return this;
    }

    public length() : number {
        return Math.sqrt(this.lengthSquared());
    }

    public lengthSquared() : number {
        return this.x * this.x + this.y * this.y;
    }

    public addVector(other : IVector2) : this {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    public addValues(x : number, y : number) : this {
        this.x += x;
        this.y += y;
        return this;
    }

    public subVector(other : IVector2) : this {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }

    public subValues(x : number, y : number) : this {
        this.x -= x;
        this.y -= y;
        return this;
    }

    public addVectorNew(other : IVector2, out? : Vector2) : Vector2 {
        return (out || new Vector2()).set(this.x + other.x, this.y + other.y);
    }

    public subVectorNew(other : IVector2, out? : Vector2) : Vector2 {
        return (out || new Vector2()).set(this.x - other.x, this.y - other.y);
    }

    public horizontalAngle() : number {
        return Math.atan2(this.y, this.x);
    }

    public verticalAngle() : number {
        //noinspection JSSuspiciousNameCombination
        return Math.atan2(this.x, this.y);
    }

    public rotate(radians : number) : Vector2 {
        const sin = Math.sin(radians);
        const cos = Math.cos(radians);
        const nx = (this.x * cos) - (this.y * sin);
        const ny = (this.x * sin) + (this.y * cos);
        this.x = nx;
        this.y = ny;
        return this;
    }

    public rotateNew(radians : number) : Vector2 {
        const sin = Math.sin(radians);
        const cos = Math.cos(radians);
        return new Vector2(
            (this.x * cos) - (this.y * sin),
            (this.x * sin) + (this.y * cos)
        );
    }

    public rotateAround(radians : number, pivot : ImmutableVector2) : Vector2 {
        let x = this.x - pivot.x;
        let y = this.y - pivot.y;
        const sin = Math.sin(radians);
        const cos = Math.cos(radians);
        this.x = ((x * cos) - (y * sin)) + pivot.x;
        this.y = ((x * sin) + (y * cos)) + pivot.y;
        return this;
    }

    public project(other : IVector2) : Vector2 {
        const e = ( (this.x * other.x) + (this.y * other.y) ) / ((other.x * other.x) + (other.y * other.y));
        this.x = e * other.x;
        this.y = e * other.y;
        return this;
    }

    public projectNew(other : IVector2) : Vector2 {
        const e = ( (this.x * other.x) + (this.y * other.y) ) / ((other.x * other.x) + (other.y * other.y));
        return new Vector2(e * other.x, e * other.y);
    }

    public distanceTo(other : IVector2) : number {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    public distanceToSquared(other : IVector2) : number {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return dx * dx + dy * dy;
    }

    public copy(other : IVector2) : this {
        this.x = other.x;
        this.y = other.y;
        return this;
    }

    public clone(out? : Vector2) : Vector2 {
        return (out || new Vector2()).set(this.x, this.y);
    }

    public isZero() : boolean {
        return this.x === 0 && this.y === 0;
    }

    public equals(other : IVector2) : boolean {
        return this.x === other.x && this.y === other.y;
    }

    public toString() : string {
        return `{x: ${this.x}, y: ${this.y}}`;
    }

    public static lerp(start : IVector2, end : IVector2, amount : number, out? : Vector2) : Vector2 {
        out = out || new Vector2();
        var x = start.x + ((end.x - start.x) * amount);
        var y = start.y + ((end.y - start.y) * amount);
        return out.set(x, y);
    }

    public static catmullRom(value1 : Vector2, value2 : Vector2, value3 : Vector2, value4 : Vector2, amount : number, out? : Vector2) : Vector2 {
        out = out || new Vector2();
        var squared = amount * amount;
        var cubed = amount * squared;

        var x = 0.5 * ((((2.0 * value2.x) + ((-value1.x + value3.x) * amount)) +
            (((((2.0 * value1.x) - (5.0 * value2.x)) + (4.0 * value3.x)) - value4.x) * squared)) +
            ((((-value1.x + (3.0 * value2.x)) - (3.0 * value3.x)) + value4.x) * cubed));

        var y = 0.5 * ((((2.0 * value2.y) + ((-value1.y + value3.y) * amount)) +
            (((((2.0 * value1.y) - (5.0 * value2.y)) + (4.0 * value3.y)) - value4.y) * squared)) +
            ((((-value1.y + (3.0 * value2.y)) - (3.0 * value3.y)) + value4.y) * cubed));

        out.x = x;
        out.y = y;
        return out;
    }

    public static clamp(value : Vector2, min : Vector2, max : Vector2, out? : Vector2) : Vector2 {
        out = out || new Vector2();
        var x = value.x;
        x = (x > max.x) ? max.x : x;
        x = (x < min.x) ? min.x : x;

        var y = value.y;
        y = (y > max.y) ? max.y : y;
        y = (y < min.y) ? min.y : y;
        out.x = x;
        out.y = y;
        return out;
    }

    public static hermite(value1 : Vector2, tangent1 : Vector2, value2 : Vector2, tangent2 : Vector2, amount : number, out? : Vector2) : Vector2 {
        out = out || new Vector2();
        var squared = amount * amount;
        var cubed = amount * squared;
        var part1 = ((2.0 * cubed) - (3.0 * squared)) + 1.0;
        var part2 = (-2.0 * cubed) + (3.0 * squared);
        var part3 = (cubed - (2.0 * squared)) + amount;
        var part4 = cubed - squared;

        var x = (((value1.x * part1) + (value2.x * part2)) + (tangent1.x * part3)) + (tangent2.x * part4);
        var y = (((value1.y * part1) + (value2.y * part2)) + (tangent1.y * part3)) + (tangent2.y * part4);
        out.x = x;
        out.y = y;
        return out;
    }

    public static dot(left : Vector2, right : Vector2) : number {
        return left.x * right.x + left.y * right.y;
    }

    public static readonly up : ImmutableVector2 = new Vector2(0, 1);

    public static readonly right : ImmutableVector2 = new Vector2(1, 0);

    public static readonly down : ImmutableVector2 = new Vector2(0, -1);

    public static readonly left : ImmutableVector2 = new Vector2(-1, 0);

    public static readonly Zero = new Vector2();

    public static scratch0 = new Vector2();
    public static scratch1 = new Vector2();
    public static scratch2 = new Vector2();
    public static scratch3 = new Vector2();
    public static scratch4 = new Vector2();

    public static scratchArray0 = new Array<Vector2>();
    public static scratchArray1 = new Array<Vector2>();

}

export interface ImmutableVector2 {

    readonly x : number;
    readonly y : number;

    clone() : Vector2;
    isZero() : boolean;
    equals(other : IVector2) : boolean;
    distanceTo(other : IVector2) : number;
    lengthSquared() : number;
    length() : number;

    horizontalAngle() : number;
    verticalAngle() : number;

    invertNew() : Vector2;

}