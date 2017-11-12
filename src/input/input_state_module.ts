import {Input} from "./input";
import {Entity} from "../runtime/entity";
import {StateChart, StateChartBuilder} from "../util/state_chart";
import {Vector2} from "../math/vector2";
import {HexDragEvent} from "./drag_event";
import {InputEventType} from "./e_input";
import {InputEventEmitter} from "./input_event_emitter";
import {HexMouseEvent} from "./mouse_event";
import {HexScrollEvent} from "./scroll_event";

const Evt_MouseDown = StateChart.createEvent<Vector2>();
// const Evt_MouseMove = StateChart.createEvent<Vector2>();
// const Evt_MouseStay = StateChart.createEvent<Vector2>();
// const Evt_MouseEnter = StateChart.createEvent<Vector2>();
// const Evt_MouseExit = StateChart.createEvent<Vector2>();
const Evt_MouseUp = StateChart.createEvent<Vector2>();

// const Evt_Scroll = StateChart.createEvent<Vector2>();

const Evt_DragStart = StateChart.createEvent<Vector2>();
const Evt_DragCancel = StateChart.createEvent<Vector2>();
// const Evt_DragEnd = StateChart.createEvent<Vector2>();
// const Evt_DragMove = StateChart.createEvent<Vector2>();
// const Evt_DragStay = StateChart.createEvent<Vector2>();
// const Evt_DragDrop = StateChart.createEvent<Vector2>();
// const Evt_DragEnter = StateChart.createEvent<Vector2>();
// const Evt_DragExit = StateChart.createEvent<Vector2>();

export class InputStateModule {

    private lastFrameEntities : Array<Entity>;
    private currentFrameEntities : ReadonlyArray<Entity>;
    private mouseDownFrameEntities : ReadonlyArray<Entity>;
    private stateChart : StateChart;
    private input : Input;
    private mousePosition : Vector2;

    public currentDragEvent : HexDragEvent;

    constructor(input : Input) {
        this.input = input;
        this.lastFrameEntities = [];
        this.currentFrameEntities = [];
        this.mouseDownFrameEntities = null;
        this.stateChart = this.createStateChart();
        this.mousePosition = new Vector2();
    }

    public update(currentFrameEntities : ReadonlyArray<Entity>) {
        this.currentFrameEntities = currentFrameEntities;
        // console.log(this.currentFrameEntities.map(e => e.name + "[" + e.depth + "]"));
        const lastFrameEntities = this.lastFrameEntities;

        this.input.getMousePosition(this.mousePosition);

        this.stateChart.update();

        lastFrameEntities.length = currentFrameEntities.length;
        for (let i = 0; i < currentFrameEntities.length; i++) {
            lastFrameEntities[i] = currentFrameEntities[i];
        }
    }

    private invokeScrollEvent(eventType : InputEventType, entityList : ReadonlyArray<Entity>) : void {
        var delta = this.input.getScrollDelta();
        var evt = new HexScrollEvent(delta.x, delta.y);
        for (let i = 0; i < entityList.length; i++) {
            const emitter = entityList[i].getComponent(InputEventEmitter);
            if (emitter !== null) {
                emitter.invoke(evt, null, eventType);
            }
        }
    }

    private invokeEvent(eventType : InputEventType, entityList : ReadonlyArray<Entity>) {
        const evt = new HexMouseEvent();//this.mousePosition, entityList);
        for (let i = 0; i < entityList.length; i++) {
            const emitter = entityList[i].getComponent(InputEventEmitter);
            if (emitter !== null) {
                emitter.invoke(evt, null, eventType);
            }
        }
    }

    private invokeDragEvent(eventType : InputEventType, entityList : ReadonlyArray<Entity>) {
        const evt = this.currentDragEvent;
        const action = evt.getDragAction();

        for (let i = 0; i < entityList.length; i++) {
            const emitter = entityList[i].getComponent(InputEventEmitter);
            if (emitter !== null) {
                emitter.invoke(evt, action, eventType);
            }
        }

    }

    private updateMouseUp() {
        var lastFrameEntities = this.lastFrameEntities;
        var currentFrameEntities = this.currentFrameEntities;
        for (let i = 0; i < lastFrameEntities.length; i++) {
            const emitter = lastFrameEntities[i].getComponent(InputEventEmitter);
            if (emitter !== null && currentFrameEntities.indexOf(lastFrameEntities[i]) === -1) {
                emitter.invoke(new HexMouseEvent(), null, InputEventType.MouseExit);
            }
        }

        for (let i = 0; i < currentFrameEntities.length; i++) {
            const emitter = currentFrameEntities[i].getComponent(InputEventEmitter);
            if (emitter !== null && !lastFrameEntities.contains(currentFrameEntities[i])) {
                emitter.invoke(new HexMouseEvent(), null, InputEventType.MouseEnter);
            }
        }
    }

    private invokeDragUpdate() {
        const evt = this.currentDragEvent;
        const dragAction = evt.getDragAction();
        var lastFrameEntities = this.lastFrameEntities;
        var currentFrameEntities = this.currentFrameEntities;

        for (let i = 0; i < lastFrameEntities.length; i++) {
            const lastFrameEntity = lastFrameEntities[i];
            const emitter = lastFrameEntity.getComponent(InputEventEmitter);
            if (emitter === null) continue;

            if (currentFrameEntities.indexOf(lastFrameEntity) === -1) {
                emitter.invoke(evt, dragAction, InputEventType.DragExit);
            }
            else { //invoke move
                emitter.invoke(evt, dragAction, InputEventType.DragUpdate);
            }
        }

        for (let i = 0; i < currentFrameEntities.length; i++) {
            const emitter = currentFrameEntities[i].getComponent(InputEventEmitter);
            if (emitter !== null && !lastFrameEntities.contains(currentFrameEntities[i])) {
                emitter.invoke(evt, dragAction, InputEventType.DragEnter);
            }
        }
    }

    private createStateChart() {
        return new StateChart((build : StateChartBuilder) => {

            const {
                state, transition, enter, exit, update, event, trigger
            } = build.toDSL();

            ////todo mouse exit viewport
            update(() => {

                if (this.input.hasScrollDelta()) {
                    // trigger(Evt_Scroll, this.input.getScrollDelta());
                    this.invokeScrollEvent(InputEventType.Scroll, this.currentFrameEntities);
                }

                if (this.input.isMouseDownThisFrame()) {
                    trigger(Evt_MouseDown, this.mousePosition);
                }
                else if (this.input.isMouseUpThisFrame()) {
                    trigger(Evt_MouseUp, this.mousePosition);
                }

            });

            state("mouseup", () => {

                enter(() => {
                    this.invokeEvent(InputEventType.MouseUp, this.currentFrameEntities);
                });

                update(() => {
                    this.updateMouseUp();
                });

                transition(Evt_MouseDown, "mousedown");
            });

            state("mousedown", () => {
                var delta : number = 0;
                enter(() => {
                    delta = 0;
                    this.mouseDownFrameEntities = Array.clone(this.currentFrameEntities);
                    this.invokeEvent(InputEventType.MouseDown, this.mouseDownFrameEntities);
                });

                exit(() => {
                    this.mouseDownFrameEntities = null;
                });

                state("not-dragging", () => {
                    //todo -- real click event
                    update(() => {
                        if (this.input.getMouseDownDeltaDistanceSquared() > 25) {
                            trigger(Evt_DragStart, this.input.getMouseDownPosition());
                        }
                    });

                    transition(Evt_DragStart, "dragging");
                    transition(Evt_MouseUp, "mouseup");

                });

                state("dragging", () => {

                    enter(() => {
                        this.currentDragEvent = new HexDragEvent(
                            this.mousePosition,
                            this.mouseDownFrameEntities as any
                        );
                        this.invokeDragEvent(InputEventType.DragStart, this.mouseDownFrameEntities);
                    });

                    update(() => {
                        (this.currentDragEvent as any).currentPosition = this.input.getMousePosition();
                        this.currentDragEvent.update();
                        if (this.currentDragEvent.isCancelled()) {
                            this.invokeDragEvent(InputEventType.DragCancel, this.currentFrameEntities);
                            return;
                        }
                        if (this.input.didMouseMove()) {
                            this.invokeDragUpdate();
                        }
                        else {
                            this.invokeDragEvent(InputEventType.DragHover, this.currentFrameEntities);
                        }

                    });

                    event(Evt_MouseUp, () => {
                        this.currentDragEvent.drop();
                        this.invokeDragEvent(InputEventType.DragDrop, this.currentFrameEntities);
                        this.invokeDragEvent(InputEventType.DragEnd, this.currentDragEvent.initialEntities);
                    });

                    event(Evt_DragCancel, () => {
                        this.invokeDragEvent(InputEventType.DragCancel, this.mouseDownFrameEntities);
                    });

                    transition(Evt_MouseUp, "mouseup");

                });

            });

        });
    }

}