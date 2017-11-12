//Reminder: to check multiple bits being set: (value & (bit1 | bit2)) === (bit1 | bit2)
//Reminder: bitwise modulus = x & (y - 1) where y is a power of 2

import {UnitType} from "../runtime/unit";

export function getNextPowerOfTwo(n : number) {
    n = n | 0;
    n = n - 1;
    n = n | (n >> 1);
    n = n | (n >> 2);
    n = n | (n >> 4);
    n = n | (n >> 8);
    n = n | (n >> 16);
    return n + 1;
}

export function getPreviousPowerOfTwo(x : number) {
    if(x <= 0) return 0;
    x = x | 0;
    x = x | (x >> 1);
    x = x | (x >> 2);
    x = x | (x >> 4);
    x = x | (x >> 8);
    x = x | (x >> 16);
    return x - (x >> 1);
}

//set bit conditionally without branching
//this.flags |= (this.flags & ~EntityFlag.ParentActive) | (-(parentActive | 0) & EntityFlag.ParentActive);

export function bitAbs(value : number) : number {
    const x = value | 0;
    const shift = x >> 1;
    return (x ^ shift) - shift;
}

export function setBitConditionally(value : number, bitValueToSet : number, trueFalseBit : 1 | 0) : number {
    return (value & ~bitValueToSet) | (-trueFalseBit | 0) & bitValueToSet;
}

export function getBits(value : number, offset : number, size : number) : number {
    return (((value >>> offset) & (1 << size) - 1) >>> 0);
}

export function setNthByte(target : number, byteNumber : number, value : number) : number {
    const n = byteNumber << 3;
    return (~(0xff << n) & (target | 0)) | (value << n);
}

export function getNthByte(target : number, byteNumber : number) : number {
    return ((target | 0) >> (byteNumber << 3)) & 0xff;
}

export function setHighLowBits(high : number, low : number) : number {
    return (high << 16) | (low & 0xffff);
}

export function getLow16Bits(value : number) : number {
    return value & 0xFFFF;
}

export function getHigh16Bits(value : number) : number {
    return (value >> 16) & ( 1 << 16) - 1;
}

export function setHigh16Bits(target : number, value : number) : number {
    return (0x00ff & target) | (value << 16);
}

export function setLow16Bits(target : number, value : number) : number {
    return (0xff & target) | value;
}

export function setBits(target : uint32, size : number, offset : number, value : number ) {
    var mask = (((1 << (size)) - 1) << (offset)) >>> 0;
    return ((target & mask) | (value << offset) >>> 0);
}
export function getLow24Bits(target :integer) : integer {
    return (target & 0xFFFFFF00);
}

export function getHigh8Bits(target : integer) : integer {
    return target >> (24) & 0xFF;
}

export function getUnitTypeByte(target : UnitValueInt) : UnitType {
    return target >> (24) & 0xFF;
}

export function getUnitValueByte(target : UnitValueInt) : float {
    return (target & 0xFFFFFF00) / 1000.0;
}

export function setUnitByte(target : UnitValueInt, value : UnitType) : UnitValueInt {
    target = target | 0;
    return (~(0xff << 24) & target) | (value << 24);
}
export function setValueBytes(target : UnitValueInt, value : float) : UnitValueInt {
    value *= 1000.0;
    target = target | 0;
    return (~0x00ffffff & target) | value;
}

// Conditionally negate a value without branching
//
// If you need to negate only when a flag is false, then use the following to avoid branching:
//     bool fDontNegate;  // Flag indicating we should not negate v.
// int v;             // Input value to negate if fDontNegate is false.
// int r;             // result = fDontNegate ? v : -v;
//
// r = (fDontNegate ^ (fDontNegate - 1)) * v;
// If you need to negate only when a flag is true, then use this:
// bool fNegate;  // Flag indicating if we should negate v.
// int v;         // Input value to negate if fNegate is true.
// int r;         // result = fNegate ? -v : v;
//
// r = (v ^ -fNegate) + fNegate;
//code for AND int64 numbers, you can replace AND with other bitwise operation
// function and(v1, v2) {
//     var hi = 0x80000000;
//     var low = 0x7fffffff;
//     var hi1 = ~~(v1 / hi);
//     var hi2 = ~~(v2 / hi);
//     var low1 = v1 & low;
//     var low2 = v2 & low;
//     var h = hi1 & hi2;
//     var l = low1 & low2;
//     return h*hi + l;
// }
