import {StateTree} from "../../src/state_tree/state_tree";
import {ValueType} from "../../src/state_tree/state_tree_node";

describe("StateTree", function () {

    var stateTree : StateTree;

    beforeEach(function () {
        stateTree = new StateTree();
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
            expect(ref.getValue<string>()).toBe("some string");
            ref.set(1);
            expect(ref.getValue<number>()).toBe(1);
            ref.set(true);
            expect(ref.getValue<boolean>()).toBe(true);
        });

        it("should set object values and return them", function () {
            const ref = stateTree.getRef("/test");
            const original = { hello: "world" };
            ref.set(original);
            expect(ref.getValue<any>()).toEqual({ hello: "world" });
            expect(ref.getValue<any>()).not.toBe(original);
            expect(ref.getChildCount()).toBe(1);
        });

        it("should set array values and return them", function () {
            const ref = stateTree.getRef("/test");
            const original = [1, 2, 3, 4];
            ref.set(original);
            expect(ref.getValue<any>()).toEqual([1, 2, 3, 4]);
            expect(ref.getValue<any>()).not.toBe(original);
            expect(ref.getChildCount()).toBe(4);
        });

        it("should return null for unset value", function () {
            expect(stateTree.getRef("/test").getValue()).toBe(null);
            expect(stateTree.getRef("/test").getValueType()).toBe(ValueType.None);
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
                expect(parentRef.getValue()).toEqual({ test: { stuff: 1 } })
            });

            it("should overwrite parent array nodes when setting value on non connected child", function () {
                const ref = stateTree.getRef("/some/test/stuff");
                const parentRef = stateTree.getRef("/some");
                parentRef.set([1, 2, 3]);
                ref.set(1);
                expect(ref.getValue()).toBe(1);
                expect(parentRef.getValue()).toEqual({ test: { stuff: 1 } })
            });


        });

    });

});