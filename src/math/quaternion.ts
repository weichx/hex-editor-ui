import {Matrix} from "./matrix4x4";
import {Vector3} from "./vector3";

export class Quaternion {

    public x : number;
    public y : number;
    public z : number;
    public w : number;

    constructor(x : number = 0.0, y : number = 0.0, z : number = 0.0, w : number = 1.0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    public isIdentity() : boolean {
        return this.x === 0 && this.y === 0 && this.z === 0 && this.w === 1;
    }

    public clone(out? : Quaternion) : Quaternion {
        return (out || new Quaternion()).set(this.x, this.y, this.z, this.w);
    }

    public copy(other : Quaternion) : Quaternion {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
        this.w = other.w;
        return this;
    }

    public set(x : number, y : number, z : number, w : number) : Quaternion {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        return this;
    }

    public addQuaternion(other : Quaternion) : Quaternion {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        this.w += other.w;
        return this;
    }

    public subQuaternion(other : Quaternion) : Quaternion {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        this.w -= other.w;
        return this;
    }

    public scale(value : number) : Quaternion {
        this.x *= value;
        this.y *= value;
        this.z *= value;
        this.w *= value;
        return this;
    }

    public multiply(q1 : Quaternion) : Quaternion {
        return Quaternion.Multiply(this, q1, this);
    }

    public conjugate() : Quaternion {
        return Quaternion.Conjugate(this, this);
    }

    public length() : number {
        return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z) + (this.w * this.w));
    }

    public normalize() : Quaternion {
        var length = 1.0 / this.length();
        this.x *= length;
        this.y *= length;
        this.z *= length;
        this.w *= length;
        return this;
    }

    public toEulerAngles(out? : Vector3) : Vector3 {
        const result = out || new Vector3();
        const qz = this.z;
        const qx = this.x;
        const qy = this.y;
        const qw = this.w;

        const sqw = qw * qw;
        const sqz = qz * qz;
        const sqx = qx * qx;
        const sqy = qy * qy;

        const zAxisY = qy * qz - qx * qw;
        const limit = .4999999;

        if (zAxisY < -limit) {
            result.y = 2 * Math.atan2(qy, qw);
            result.x = Math.PI / 2;
            result.z = 0;
        } else if (zAxisY > limit) {
            result.y = 2 * Math.atan2(qy, qw);
            result.x = -Math.PI / 2;
            result.z = 0;
        } else {
            result.z = Math.atan2(2.0 * (qx * qy + qz * qw), (-sqz - sqx + sqy + sqw));
            result.x = Math.asin(-2.0 * (qz * qy - qx * qw));
            result.y = Math.atan2(2.0 * (qz * qx + qy * qw), (sqz - sqx - sqy + sqw));
        }
        return result;
    }

    public getRotationX() : number {
        const qz = this.z;
        const qx = this.x;
        const qy = this.y;
        const qw = this.w;

        const zAxisY = qy * qz - qx * qw;
        const limit = .4999999;

        if (zAxisY < -limit) {
            return Math.PI / 2;
        } else if (zAxisY > limit) {
            return -Math.PI / 2;
        } else {
            return Math.asin(-2.0 * (qz * qy - qx * qw));
        }
    }

    public getRotationY() : number {
        const qz = this.z;
        const qx = this.x;
        const qy = this.y;
        const qw = this.w;

        const sqw = qw * qw;
        const sqz = qz * qz;
        const sqx = qx * qx;
        const sqy = qy * qy;

        const zAxisY = qy * qz - qx * qw;
        const limit = .4999999;

        if (zAxisY < -limit) {
            return 2 * Math.atan2(qy, qw);
        } else if (zAxisY > limit) {
            return 2 * Math.atan2(qy, qw);
        } else {
            return Math.atan2(2.0 * (qz * qx + qy * qw), (sqz - sqx - sqy + sqw));
        }
    }

    public getRotationZ() : number {
        const qz = this.z;
        const qx = this.x;
        const qy = this.y;
        const qw = this.w;

        const sqw = qw * qw;
        const sqz = qz * qz;
        const sqx = qx * qx;
        const sqy = qy * qy;

        const zAxisY = qy * qz - qx * qw;
        const limit = .4999999;

        if (zAxisY < -limit || zAxisY > limit) {
            return 0;
        } else {
            return Math.atan2(2.0 * (qx * qy + qz * qw), (-sqz - sqx + sqy + sqw));
        }
    }

    //todo this can be done faster if we assume input matrix
    public toRotationMatrix(result? : Matrix) : Matrix {
        result = result || new Matrix();
        var xx = this.x * this.x;
        var yy = this.y * this.y;
        var zz = this.z * this.z;
        var xy = this.x * this.y;
        var zw = this.z * this.w;
        var zx = this.z * this.x;
        var yw = this.y * this.w;
        var yz = this.y * this.z;
        var xw = this.x * this.w;

        result.m[0] = 1.0 - (2.0 * (yy + zz));
        result.m[1] = 2.0 * (xy + zw);
        result.m[2] = 2.0 * (zx - yw);
        result.m[3] = 0;
        result.m[4] = 2.0 * (xy - zw);
        result.m[5] = 1.0 - (2.0 * (zz + xx));
        result.m[6] = 2.0 * (yz + xw);
        result.m[7] = 0;
        result.m[8] = 2.0 * (zx + yw);
        result.m[9] = 2.0 * (yz - xw);
        result.m[10] = 1.0 - (2.0 * (yy + xx));
        result.m[11] = 0;
        result.m[12] = 0;
        result.m[13] = 0;
        result.m[14] = 0;
        result.m[15] = 1.0;
        return result;
    }

    public fromRotationMatrix(matrix : Matrix) : Quaternion {
        return Quaternion.FromRotationMatrix(matrix, this);
    }

    public toString() : string {
        return "{x: " + this.x + " y:" + this.y + " z:" + this.z + " w:" + this.w + "}";
    }

    public getHashCode() : number {
        let hash = this.x || 0;
        hash = (hash * 397) ^ (this.y || 0);
        hash = (hash * 397) ^ (this.z || 0);
        hash = (hash * 397) ^ (this.w || 0);
        return hash;
    }

    public equals(otherQuaternion : Quaternion) : boolean {
        return otherQuaternion && this.x === otherQuaternion.x && this.y === otherQuaternion.y && this.z === otherQuaternion.z && this.w === otherQuaternion.w;
    }

    public static Conjugate(q0 : Quaternion, out? : Quaternion) {
        out = out || new Quaternion();
        out.x = -q0.x;
        out.y = -q0.y;
        out.z = -q0.z;
        return out;
    }

    public static Multiply(q0 : Quaternion, q1 : Quaternion, out? : Quaternion) : Quaternion {
        out = out || new Quaternion();
        var x = q0.x * q1.w + q0.y * q1.z - q0.z * q1.y + q0.w * q1.x;
        var y = -q0.x * q1.z + q0.y * q1.w + q0.z * q1.x + q0.w * q1.y;
        var z = q0.x * q1.y - q0.y * q1.x + q0.z * q1.w + q0.w * q1.z;
        var w = -q0.x * q1.x - q0.y * q1.y - q0.z * q1.z + q0.w * q1.w;
        out.x = x;
        out.y = y;
        out.z = z;
        out.w = w;
        return out;
    }

    public static FromRotationMatrix(matrix : Matrix, out? : Quaternion) : Quaternion {
        var result = out || new Quaternion();
        var data = matrix.m;
        var m11 = data[0], m12 = data[4], m13 = data[8];
        var m21 = data[1], m22 = data[5], m23 = data[9];
        var m31 = data[2], m32 = data[6], m33 = data[10];
        var trace = m11 + m22 + m33;
        var s;

        if (trace > 0) {

            s = 0.5 / Math.sqrt(trace + 1.0);

            result.w = 0.25 / s;
            result.x = (m32 - m23) * s;
            result.y = (m13 - m31) * s;
            result.z = (m21 - m12) * s;
        } else if (m11 > m22 && m11 > m33) {

            s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);

            result.w = (m32 - m23) / s;
            result.x = 0.25 * s;
            result.y = (m12 + m21) / s;
            result.z = (m13 + m31) / s;
        } else if (m22 > m33) {

            s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);

            result.w = (m13 - m31) / s;
            result.x = (m12 + m21) / s;
            result.y = 0.25 * s;
            result.z = (m23 + m32) / s;
        } else {

            s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);

            result.w = (m21 - m12) / s;
            result.x = (m13 + m31) / s;
            result.y = (m23 + m32) / s;
            result.z = 0.25 * s;
        }
        return result;
    }

    public static Invert(q : Quaternion, out? : Quaternion) : Quaternion {
        return (out || new Quaternion()).set(-q.x, -q.y, -q.z, q.w);
    }

    public static IsIdentity(quaternion : Quaternion) {
        return quaternion && quaternion.x === 0 && quaternion.y === 0 && quaternion.z === 0 && quaternion.w === 1;
    }

    public static readonly Zero : Readonly<Quaternion> = new Quaternion(0, 0, 0, 0);
    public static readonly Identity : Readonly<Quaternion> = new Quaternion(0.0, 0.0, 0.0, 1.0);

    public static RotationAxis(axis : Vector3, angle : number, out? : Quaternion) : Quaternion {
        out = out || new Quaternion();
        var sin = Math.sin(angle * 0.5);
        axis.normalize();
        out.w = Math.cos(angle * 0.5);
        out.x = axis.x * sin;
        out.y = axis.y * sin;
        out.z = axis.z * sin;
        return out;
    }

    public static RotationYawPitchRoll(yaw : number, pitch : number, roll : number, out? : Quaternion) : Quaternion {
        out = out || new Quaternion();
        var halfRoll = roll * 0.5;
        var halfPitch = pitch * 0.5;
        var halfYaw = yaw * 0.5;

        var sinRoll = Math.sin(halfRoll);
        var cosRoll = Math.cos(halfRoll);
        var sinPitch = Math.sin(halfPitch);
        var cosPitch = Math.cos(halfPitch);
        var sinYaw = Math.sin(halfYaw);
        var cosYaw = Math.cos(halfYaw);

        out.x = (cosYaw * sinPitch * cosRoll) + (sinYaw * cosPitch * sinRoll);
        out.y = (sinYaw * cosPitch * cosRoll) - (cosYaw * sinPitch * sinRoll);
        out.z = (cosYaw * cosPitch * sinRoll) - (sinYaw * sinPitch * cosRoll);
        out.w = (cosYaw * cosPitch * cosRoll) + (sinYaw * sinPitch * sinRoll);

        return out;
    }

    public static RotationAlphaBetaGamma(alpha : number, beta : number, gamma : number, out? : Quaternion) : Quaternion {
        var out = out || new Quaternion();
        var halfGammaPlusAlpha = (gamma + alpha) * 0.5;
        var halfGammaMinusAlpha = (gamma - alpha) * 0.5;
        var halfBeta = beta * 0.5;

        out.x = Math.cos(halfGammaMinusAlpha) * Math.sin(halfBeta);
        out.y = Math.sin(halfGammaMinusAlpha) * Math.sin(halfBeta);
        out.z = Math.sin(halfGammaPlusAlpha) * Math.cos(halfBeta);
        out.w = Math.cos(halfGammaPlusAlpha) * Math.cos(halfBeta);
        return out;
    }

    //returns rotation value to reach the target orientation
    public static RotationQuaternionFromAxis(axis1 : Vector3, axis2 : Vector3, axis3 : Vector3, out? : Quaternion) : Quaternion {
        out = out || new Quaternion();
        var rotMat = Matrix.Identity(Matrix.scratch0);
        Matrix.FromXYZAxesToRef(axis1.normalize(), axis2.normalize(), axis3.normalize(), rotMat);
        Quaternion.FromRotationMatrix(rotMat, out);
        return out;
    }

    public static Slerp(left : Quaternion, right : Quaternion, amount : number, out? : Quaternion) : Quaternion {

        out = out || new Quaternion();

        var num2;
        var num3;
        var num = amount;
        var num4 = (((left.x * right.x) + (left.y * right.y)) + (left.z * right.z)) + (left.w * right.w);
        var flag = false;

        if (num4 < 0) {
            flag = true;
            num4 = -num4;
        }

        if (num4 > 0.999999) {
            num3 = 1 - num;
            num2 = flag ? -num : num;
        }
        else {
            var num5 = Math.acos(num4);
            var num6 = (1.0 / Math.sin(num5));
            num3 = (Math.sin((1.0 - num) * num5)) * num6;
            num2 = flag ? ((-Math.sin(num * num5)) * num6) : ((Math.sin(num * num5)) * num6);
        }

        out.x = (num3 * left.x) + (num2 * right.x);
        out.y = (num3 * left.y) + (num2 * right.y);
        out.z = (num3 * left.z) + (num2 * right.z);
        out.w = (num3 * left.w) + (num2 * right.w);
        return out;

    }

    /*todo -- rotate vector
    *   t = 2 * cross(q.xyz, v)
        v' = v + q.w * t + cross(q.xyz, t)
    * */
    public static readonly scratch0 = new Quaternion();
    public static readonly scratch1 = new Quaternion();
    public static readonly scratch2 = new Quaternion();
    public static readonly scratch3 = new Quaternion();

}