import {UnitType, UnitValue, UnitValue2} from "./runtime/unit";

declare global {
    interface Number {
        pct : UnitValue2;
        percent: UnitValue;
        px: UnitValue;
        unitType : UnitType;
        unitValue : float;
        getUnitValue(reference? : float) : float;
    }
}

Object.defineProperties(Number.prototype, {

    unitType: {
        get: function () {
            return this >> (24 & 0xFF);      
        }
    },
    unitValue: {
        get: function() {
            return ((this | 0) & 0xFFFFFF00) / 1000.0;
        }
    },
    percent: {
        get: function() {
            return new UnitValue(this, UnitType.Percent);
        }
    },
    px: {
        get : function () {
            return new UnitValue(this, UnitType.Pixel);
        }
    }
});

export default 0;