import {Vector2} from "../math/vector2";
import {MathUtil} from "../math/math_util";
import {bitAbs} from "../util/bitwise";
import {IBounded} from "../util/quad_tree";

export class Rectangle implements IBounded {

    public minX : number;
    public minY : number;
    public maxX : number;
    public maxY : number;

    constructor(x : number = 0, y = 0, width : number = 0, height : number = 0) {
        this.minX = x;
        this.minY = y;
        this.maxX = x + width;
        this.maxY = y + height;
    }

    public get bounds() : Rectangle {
        return this;
    }

    public get x() : number {
        return this.minX;
    }

    public set x(value : number) {
        this.minX = value;
    }

    public get y() : number {
        return this.minY;
    }

    public set y(value : number) {
        this.minY = value;
    }

    public get width() : number {
        return this.maxX - this.minX;
    }

    public set width(value : number) {
        this.maxX = Math.max(this.minX + value, 0);
    }

    public get height() : number {
        return this.maxY - this.minY;
    }

    public set height(value : number) {
        this.maxY = Math.max(this.minY + value, 0);
    }

    public getTopLeft(out? : Vector2) : Vector2 {
        return (out || new Vector2()).set(this.minX, this.minY);
    }

    public getTopRight(out? : Vector2) : Vector2 {
        return (out || new Vector2()).set(this.maxX, this.minY);
    }

    public getBottomRight(out? : Vector2) : Vector2 {
        return (out || new Vector2()).set(this.maxX, this.maxY);
    }

    public getBottomLeft(out? : Vector2) : Vector2 {
        return (out || new Vector2()).set(this.minX, this.maxY);
    }

    public containsPoint(target : Vector2) : boolean {
        return (
            target.x > this.minX && target.x < this.maxX
            &&
            target.y > this.minY && target.y < this.maxY
        );
    }

    public containsOrIntersectsPoint(target : Vector2) : boolean {
        return (
            target.x >= this.minX && target.x <= this.maxX
            &&
            target.y >= this.minY && target.y <= this.maxY
        );
    }

    public containsRectangle(target : Rectangle) : boolean {
        const v = Vector2.scratch0;
        return (
            this.containsPoint(v.set(target.minX, target.minY)) &&
            this.containsPoint(v.set(target.maxX, target.maxY))
        );
    }

    public containsOrIntersectsRectangle(target : Rectangle) : boolean {
        const minX = this.minX;
        const minY = this.minY;
        const maxX = this.maxX;
        const maxY = this.maxY;
        const tMinX = target.minX;
        const tMinY = target.minY;
        const tMaxX = target.maxX;
        const tMaxY = target.maxY;
        return ( // << 1 is a faster multiply by 2
                (bitAbs(minX - tMinX) << 1) < ((maxX - minX) + (tMaxX - tMinX)) &&
                (bitAbs(minY - tMinY) << 1) < ((maxY - minY) + (tMaxY - tMinY))
            ) || (
                (tMinX >= minX && tMinX <= maxX && tMinY >= minY && tMinY <= maxY) &&
                (tMaxX >= minX && tMaxX <= maxX && tMaxX >= minY && tMaxY <= maxY)
            );
    }

    public intersectRect(target : Rectangle) : boolean {
        return ( // << 1 is a faster multiply by 2
            (bitAbs(this.minX - target.minX) << 1) < ((this.maxX - this.minX) + (target.maxX - target.minX)) &&
            (bitAbs(this.minY - target.minY) << 1) < ((this.maxY - this.minY) + (target.maxY - target.minY))
        );
    }

    public intersectOrTouchRect(target : Rectangle) : boolean {
        return (
            // << 1 is a faster multiply by 2, bitAbs will do an integer cast,
            // we are unlinkely to need sub pixel precision here
            (bitAbs(this.minX - target.minX) << 1) <= ((this.maxX - this.minX) + (target.maxX - target.minX)) &&
            (bitAbs(this.minY - target.minY) << 1) <= ((this.maxY - this.minY) + (target.maxY - target.minY))
        );
    }

    public overlapsRectangle(target : Rectangle) : boolean {
        return (
            (
                MathUtil.between(this.minX, target.minX, target.maxX) ||
                MathUtil.between(target.minX, this.minX, this.maxX)
            ) && (
                MathUtil.between(this.minY, target.minY, target.maxY) ||
                MathUtil.between(target.minY, this.minY, this.maxY)
            )
        );
    }

    public set(minX : number, minY : number, maxX : number, maxY : number) : this {
        this.minX = Math.min(minX, maxX);
        this.minY = Math.min(minY, maxY);
        this.maxX = Math.max(minX, maxX);
        this.maxY = Math.max(minY, maxY);
        return this;
    }

    public setFromWidthHeight(x : number, y : number, width : number, height : number) : this {
        this.minX = x;
        this.minY = y;
        this.maxX = x + width;
        this.maxY = y + height;
        return this;
    }

    public setFromVector2(min : Vector2, max : Vector2) : this {
        this.minX = Math.min(min.x, max.x);
        this.minY = Math.min(min.y, max.y);
        this.maxX = Math.max(min.x, max.x);
        this.maxY = Math.max(min.y, max.y);
        return this;
    }

    public copy(rect : Rectangle) : this {
        this.minX = rect.minX;
        this.minY = rect.minY;
        this.maxX = rect.maxX;
        this.maxY = rect.maxY;
        return this;
    }

    public clone(out? : Rectangle) : Rectangle {
        return (out || new Rectangle()).set(this.minX, this.minY, this.maxX, this.maxY);
    }

    public static FromValues(minX : number, minY : number, maxX : number, maxY : number) : Rectangle {
        return new Rectangle().set(minX, minY, maxX, maxY);
    }

    public static FromVector2(min : Vector2, max : Vector2) : Rectangle {
        return new Rectangle().setFromVector2(min, max);
    }

    public static scratch0 = new Rectangle();
    public static scratch1 = new Rectangle();
    public static scratch2 = new Rectangle();
    public static scratch3 = new Rectangle();
}