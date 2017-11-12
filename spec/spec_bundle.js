/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(2);


/***/ }),
/* 1 */
/***/ (function(module, exports) {



/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const state_tree_1 = __webpack_require__(3);
describe("StateTree", function () {
    var stateTree;
    beforeEach(function () {
        stateTree = new state_tree_1.StateTree();
    });
    it("should return proper references from getRef without key", function () {
        const ref = stateTree.getRef("/test");
        expect(ref.key).toBe("test");
        expect(ref.path).toBe("/test");
        expect(ref.basepath).toBe("");
    });
    it("should return proper references from getRef with key", function () {
        const ref = stateTree.getRefWithKey("", "test");
        expect(ref.key).toBe("test");
        expect(ref.path).toBe("/test");
        expect(ref.basepath).toBe("");
    });
    describe("State Tree Node", function () {
        it("should set primitive values and return them", function () {
            const ref = stateTree.getRef("/test");
            ref.set("some string");
            expect(ref.getValue()).toBe("some string");
            ref.set(1);
            expect(ref.getValue()).toBe(1);
            ref.set(true);
            expect(ref.getValue()).toBe(true);
        });
        it("should set object values and return them", function () {
            const ref = stateTree.getRef("/test");
            const original = { hello: "world" };
            ref.set(original);
            expect(ref.getValue()).toEqual({ hello: "world" });
            expect(ref.getValue()).not.toBe(original);
            expect(ref.getChildCount()).toBe(1);
        });
        it("should set array values and return them", function () {
            const ref = stateTree.getRef("/test");
            const original = [1, 2, 3, 4];
            ref.set(original);
            expect(ref.getValue()).toEqual([1, 2, 3, 4]);
            expect(ref.getValue()).not.toBe(original);
            expect(ref.getChildCount()).toBe(4);
        });
        it("should return null for unset value", function () {
            expect(stateTree.getRef("/test").getValue()).toBe(null);
            expect(stateTree.getRef("/test").getValueType()).toBe(0 /* None */);
        });
        describe("ValueChange, ValueSet, ValueUnset handlers", function () {
            it("should fire valueChanged handler", function () {
                const ref = stateTree.getRef("/test");
                const valueChanged = jasmine.createSpy("Spy");
                ref.onValueChanged(valueChanged);
                ref.set(1);
                expect(valueChanged).toHaveBeenCalledTimes(1);
                expect(valueChanged.calls.mostRecent().args[0]).toBe(ref);
                expect(valueChanged.calls.mostRecent().args.length).toBe(1);
                ref.set("some string");
                expect(valueChanged).toHaveBeenCalledTimes(2);
                expect(valueChanged.calls.mostRecent().args[0]).toBe(ref);
                expect(valueChanged.calls.mostRecent().args.length).toBe(1, "args");
            });
            it("should not fire valueChanged when set to same value", function () {
                const ref = stateTree.getRef("/test");
                const valueChanged = jasmine.createSpy("Spy");
                ref.onValueChanged(valueChanged);
                ref.set(1);
                expect(valueChanged).toHaveBeenCalledTimes(1);
                expect(valueChanged.calls.mostRecent().args[0]).toBe(ref);
                expect(valueChanged.calls.mostRecent().args.length).toBe(1);
                ref.set(1);
                expect(valueChanged).toHaveBeenCalledTimes(1);
                expect(valueChanged.calls.mostRecent().args[0]).toBe(ref);
                expect(valueChanged.calls.mostRecent().args.length).toBe(1);
            });
            it("should fire valueChanged when set to null or undefined", function () {
                const ref = stateTree.getRef("/test");
                const valueChanged = jasmine.createSpy("Spy");
                ref.onValueChanged(valueChanged);
                ref.set(1);
                expect(valueChanged).toHaveBeenCalledTimes(1);
                expect(valueChanged.calls.mostRecent().args[0]).toBe(ref);
                expect(valueChanged.calls.mostRecent().args.length).toBe(1);
                ref.set(null);
                expect(valueChanged).toHaveBeenCalledTimes(2);
                expect(valueChanged.calls.mostRecent().args[0]).toBe(ref);
                expect(valueChanged.calls.mostRecent().args.length).toBe(1);
            });
            it("should fire valueSet when value was unset and becomes set", function () {
                const ref = stateTree.getRef("/test");
                const onValueSet = jasmine.createSpy("Spy");
                ref.onValueSet(onValueSet);
                ref.set(1);
                expect(onValueSet).toHaveBeenCalledTimes(1);
                ref.set(null);
                expect(onValueSet).toHaveBeenCalledTimes(1);
                ref.set(2);
                expect(onValueSet).toHaveBeenCalledTimes(2);
            });
            it("should fire valueUnset when value was set and becomes unset", function () {
                const ref = stateTree.getRef("/test");
                const onValueUnset = jasmine.createSpy("Spy");
                ref.onValueUnset(onValueUnset);
                ref.set(1);
                expect(onValueUnset).toHaveBeenCalledTimes(0);
                ref.set(null);
                expect(onValueUnset).toHaveBeenCalledTimes(1);
                ref.set(2);
                expect(onValueUnset).toHaveBeenCalledTimes(1);
            });
        });
        describe("Child Nodes", function () {
            it("should allow references to 'non connected' nodes", function () {
                const ref = stateTree.getRef("/test/but/not/here");
                ref.set(1);
                expect(stateTree.getRef("/test").getValue()).toEqual({
                    but: { not: { here: 1 } }
                });
                expect(ref.getValue()).toBe(1);
            });
            //todo test array types and primitive stuff
            it("should overwrite parent primitive nodes when setting value on non connected child", function () {
                const ref = stateTree.getRef("/some/test/stuff");
                const parentRef = stateTree.getRef("/some");
                parentRef.set("primitive");
                ref.set(1);
                expect(ref.getValue()).toBe(1);
                expect(parentRef.getValue()).toEqual({ test: { stuff: 1 } });
            });
            it("should overwrite parent array nodes when setting value on non connected child", function () {
                const ref = stateTree.getRef("/some/test/stuff");
                const parentRef = stateTree.getRef("/some");
                parentRef.set([1, 2, 3]);
                ref.set(1);
                expect(ref.getValue()).toBe(1);
                expect(parentRef.getValue()).toEqual({ test: { stuff: 1 } });
            });
        });
    });
});


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const state_tree_node_1 = __webpack_require__(4);
class StateTree {
    constructor() {
        this.refMap = new Map();
        this.lastRandChars = [];
    }
    getRefWithKey(path, key) {
        if (!key && (path === "" || path === "/"))
            return null;
        const fullPath = path + "/" + key;
        const parentPath = path;
        var ref = this.refMap.get(fullPath);
        if (ref === void 0) {
            ref = new state_tree_node_1.StateTreeNode(this, parentPath, key);
            this.refMap.set(fullPath, ref);
        }
        return ref;
    }
    getRef(path) {
        if (path === "" || path === "/")
            return null;
        const key = this.getKey(path);
        const parentPath = this.getParentPath(path);
        const fullPath = path;
        var ref = this.refMap.get(fullPath);
        if (ref === void 0) {
            ref = new state_tree_node_1.StateTreeNode(this, parentPath, key);
            this.refMap.set(fullPath, ref);
        }
        return ref;
    }
    getParentPath(path) {
        return path.substring(0, path.lastIndexOf("/"));
    }
    getKey(path) {
        const slashIdx = path.lastIndexOf("/");
        if (slashIdx === -1) {
            return path;
        }
        else {
            return path.substr(slashIdx + 1);
        }
    }
    // https://gist.github.com/mikelehen/3596a30bd69384624c11
    /** @internal */
    generatePushId() {
        var now = Date.now();
        var duplicateTime = (now === this.lastPushTime);
        this.lastPushTime = now;
        var timeStampChars = new Array(8);
        for (var i = 7; i >= 0; i--) {
            timeStampChars[i] = StateTree.PushCharacters.charAt(now % 64);
            // NOTE: Can't use << here because javascript will convert to int and lose the upper bits.
            now = Math.floor(now / 64);
        }
        if (now !== 0)
            throw new Error('We should have converted the entire timestamp.');
        var id = timeStampChars.join('');
        if (!duplicateTime) {
            for (i = 0; i < 12; i++) {
                this.lastRandChars[i] = Math.floor(Math.random() * 64);
            }
        }
        else {
            // If the timestamp hasn't changed since last push, use the same random number, except incremented by 1.
            for (i = 11; i >= 0 && this.lastRandChars[i] === 63; i--) {
                this.lastRandChars[i] = 0;
            }
            this.lastRandChars[i]++;
        }
        for (i = 0; i < 12; i++) {
            id += StateTree.PushCharacters.charAt(this.lastRandChars[i]);
        }
        if (id.length != 20)
            throw new Error('Length should be 20.');
        return id;
    }
}
StateTree.PushCharacters = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
exports.StateTree = StateTree;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ChangeHandlerType;
(function (ChangeHandlerType) {
    ChangeHandlerType[ChangeHandlerType["ChildAdded"] = 0] = "ChildAdded";
    ChangeHandlerType[ChangeHandlerType["ChildRemoved"] = 1] = "ChildRemoved";
    ChangeHandlerType[ChangeHandlerType["ChildMoved"] = 2] = "ChildMoved";
    ChangeHandlerType[ChangeHandlerType["ValueSet"] = 3] = "ValueSet";
    ChangeHandlerType[ChangeHandlerType["ValueUnset"] = 4] = "ValueUnset";
    ChangeHandlerType[ChangeHandlerType["ValueChange"] = 5] = "ValueChange";
    ChangeHandlerType[ChangeHandlerType["Move"] = 6] = "Move";
})(ChangeHandlerType || (ChangeHandlerType = {}));
class ChangeHandler {
    constructor(type, fn) {
        this.type = type;
        this.fn = fn;
    }
}
//note -- this.value is ONLY ever going to be a primitive value, all other values are computed
class StateTreeNode {
    constructor(tree, parentPath, key) {
        this.tree = tree;
        this.key = key;
        this.value = null;
        this.basepath = parentPath;
        this.valueType = 0 /* None */;
        this.children = [];
        this.handlers = [];
        this.parent = this.tree.getRef(parentPath);
    }
    get path() {
        return this.basepath + "/" + this.key;
    }
    onValueChanged(fn) {
        this.handlers.push(new ChangeHandler(ChangeHandlerType.ValueChange, fn));
    }
    onChildAdded(fn) {
        this.handlers.push(new ChangeHandler(ChangeHandlerType.ChildAdded, fn));
    }
    onChildRemoved(fn) {
        this.handlers.push(new ChangeHandler(ChangeHandlerType.ChildRemoved, fn));
    }
    onValueSet(fn) {
        this.handlers.push(new ChangeHandler(ChangeHandlerType.ValueSet, fn));
    }
    onValueUnset(fn) {
        this.handlers.push(new ChangeHandler(ChangeHandlerType.ValueUnset, fn));
    }
    offValueChanged(fn) {
        this.removeHandler(fn, ChangeHandlerType.ValueChange);
    }
    offChildAdded(fn) {
        this.removeHandler(fn, ChangeHandlerType.ChildAdded);
    }
    offChildRemoved(fn) {
        this.removeHandler(fn, ChangeHandlerType.ChildRemoved);
    }
    offValueSet(fn) {
        this.removeHandler(fn, ChangeHandlerType.ValueSet);
    }
    offValueUnset(fn) {
        this.removeHandler(fn, ChangeHandlerType.ValueUnset);
    }
    removeHandler(fn, type) {
        for (var i = 0; i < this.handlers.length; i++) {
            const handler = this.handlers[i];
            if (handler.type === type && handler.fn === fn) {
                this.handlers.removeAt(i);
                break;
            }
        }
    }
    getChildCount() {
        return this.children.length;
    }
    getChild(childKey) {
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].key === childKey) {
                return this.children[i];
            }
        }
        return this.tree.getRefWithKey(this.path, childKey);
    }
    get hasValue() {
        return this.valueType !== 0 /* None */;
    }
    getValueType() {
        return this.valueType;
    }
    getValue() {
        switch (this.valueType) {
            case 1 /* Primitive */:
                return this.value;
            case 3 /* Object */:
                const retnObject = {};
                for (var i = 0; i < this.children.length; i++) {
                    const child = this.children[i];
                    retnObject[child.key] = child.getValue();
                }
                return retnObject;
            case 2 /* Array */:
                const retnArray = new Array(this.children.length);
                for (var i = 0; i < this.children.length; i++) {
                    retnArray[i] = this.children[i].getValue();
                }
                return retnArray;
        }
        return this.value;
    }
    //
    // public push(value : any) : void {
    //
    // }
    remove() {
        if (!this.hasValue)
            return;
        const oldValue = this.value;
        this.value = null;
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].remove();
        }
        for (var i = 0; i < this.handlers.length; i++) {
            var handler = this.handlers[i];
            if (handler.type !== ChangeHandlerType.ValueUnset) {
                handler.fn(oldValue, this);
            }
        }
        // this.parent.children.remove(this);
    }
    removeInternal() {
    }
    computeValueType(value) {
        if (value === null || value === void 0)
            return 0 /* None */;
        if (Array.isArray(value))
            return 2 /* Array */;
        if (typeof value === "object")
            return 3 /* Object */;
        return 1 /* Primitive */;
    }
    getAncestors() {
        const retn = [];
        var ptr = this.parent;
        while (ptr !== null) {
            retn.push(ptr);
            ptr = ptr.parent;
        }
        return retn.reverse();
    }
    createObjectPath(ancestors, closestSetIndex, value) {
        const retn = {};
        var ptr = retn;
        for (var i = closestSetIndex; i < ancestors.length; i++) {
            ptr[ancestors[i].key] = {};
            ptr = ptr[ancestors[i].key];
        }
        ptr[this.key] = value;
        return retn;
    }
    getClosestSetAncestorIndex(ancestry) {
        for (var i = 1; i < ancestry.length; i++) {
            if (ancestry[i].valueType !== 0 /* None */) {
                return i;
            }
        }
        return 1;
    }
    set(value) {
        if (value === this.value)
            return;
        if (this.parent !== null && this.parent.valueType === 0 /* None */) {
            if (value === null || value === void 0)
                return;
            const ancestors = this.getAncestors();
            const idx = this.getClosestSetAncestorIndex(ancestors);
            const obj = this.createObjectPath(ancestors, idx, value);
            ancestors[idx - 1].set(obj);
            return;
        }
        const hadValue = this.hasValue;
        this.value = null; //value is null if array or object, its will be computed off children
        this.valueType = this.computeValueType(value);
        switch (this.valueType) {
            case 0 /* None */:
                this.remove(); //todo -- unset value instead
                break;
            case 2 /* Array */:
                this.setValueFromArray(value);
                break;
            case 3 /* Object */:
                this.setValueFromObject(value);
                break;
            case 1 /* Primitive */:
                this.value = value;
                break;
        }
        if (this.hasValue && !hadValue) {
            this.emitValueSet();
        }
        else if (hadValue && !this.hasValue) {
            this.emitValueUnset();
        }
        this.emitValueChanged();
    }
    clear() {
        for (var i = 0; i < this.children.length; i++) {
            this.emitChildRemoved(this.children[i]);
        }
        this.children.length = 0;
    }
    emitValueChanged() {
        for (var i = 0; i < this.handlers.length; i++) {
            const handler = this.handlers[i];
            if (handler.type === ChangeHandlerType.ValueChange) {
                handler.fn(this);
            }
        }
    }
    emitValueSet() {
        for (var i = 0; i < this.handlers.length; i++) {
            const handler = this.handlers[i];
            if (handler.type === ChangeHandlerType.ValueSet) {
                handler.fn(this);
            }
        }
    }
    emitValueUnset() {
        for (var i = 0; i < this.handlers.length; i++) {
            const handler = this.handlers[i];
            if (handler.type === ChangeHandlerType.ValueUnset) {
                handler.fn(this);
            }
        }
    }
    emitChildAdded(child) {
        for (var i = 0; i < this.handlers.length; i++) {
            const handler = this.handlers[i];
            if (handler.type === ChangeHandlerType.ChildAdded) {
                handler.fn(this, child);
            }
        }
    }
    emitChildRemoved(child) {
        for (var i = 0; i < this.handlers.length; i++) {
            const handler = this.handlers[i];
            if (handler.type === ChangeHandlerType.ChildRemoved) {
                handler.fn(this, child);
            }
        }
    }
    setValueFromArray(value) {
        for (let i = value.length; i < this.children.length; i++) {
            this.children[i].remove();
        }
        const path = this.path;
        const childCount = this.children.length;
        for (let i = 0; i < value.length; i++) {
            if (childCount > i) {
                this.children[i].set(value[i]);
            }
            else {
                const ref = this.tree.getRefWithKey(path, i.toString());
                this.children.push(ref);
                ref.set(value[i]);
            }
        }
    }
    setValueFromObject(value) {
        const keys = Object.keys(value);
        const path = this.path;
        for (var i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            if (keys.indexOf(child.key) === -1) {
                //child.remove(); todo fix this
            }
        }
        for (var i = 0; i < keys.length; i++) {
            const valueForKey = value[keys[i]];
            if (valueForKey === void 0 || valueForKey === null) {
                continue;
            }
            const ref = this.tree.getRefWithKey(path, keys[i]);
            if (ref.valueType === 0 /* None */) {
                this.children.push(ref);
            }
            ref.set(value[keys[i]]);
        }
    }
}
exports.StateTreeNode = StateTreeNode;


/***/ })
/******/ ]);