export type VoidFn = () => void;

class StateChartTransition<T> {

    public target : string;
    public evt : StateChartEvent<T>;
    public guardFn : (data? : T) => boolean;

    constructor(evt : StateChartEvent<T>, target : string, guardFn? : (data? : T) => boolean) {
        this.evt = evt;
        this.target = target;
        this.guardFn = guardFn || StateChartTransition.NoOpGuard;
    }

    private static NoOpGuard() { return true; }

}

export class StateChartEvent<T> {
    public _brand : T; //used only for type checking, no runtime effect
}

export class StateChartBehavior {

    protected readonly chart : StateChart;

    public enter() {}

    public update() {}

    public exit() {}

}

interface IEventPackage<T> {
    event : StateChartEvent<T>;
    data : T;
}

interface IStateChartEventHandler<T> {
    handler : (data? : T) => void;
    event : StateChartEvent<T>;
}


class StateChartState {

    public readonly id : string;
    public states : Array<StateChartState>;
    public events : Array<IStateChartEventHandler<any>>;
    public transitions : Array<StateChartTransition<any>>;
    public isActive : boolean;
    public behavior : StateChartBehavior;
    public parent : StateChartState;
    public initFns : Array<() => void>;
    public enterFns : Array<() => void>;
    public updateFns : Array<() => void>;
    public exitFns : Array<() => void>;

    constructor(id : string, parent : StateChartState, behavior : StateChartBehavior) {
        this.id = id;
        this.parent = parent;
        this.behavior = behavior;
        this.isActive = false;
        this.states = [];
        this.events = [];
        this.transitions = [];
        this.initFns = null;
        this.enterFns = null;
        this.exitFns = null;
        this.updateFns = null;
    }

    public onInit(fn : () => void) {
        this.initFns = this.initFns || [];
        this.initFns.push(fn);
    }

    public onUpdated(fn : () => void) {
        this.updateFns = this.updateFns || [];
        this.updateFns.push(fn);
    }

    public onEntered(fn : () => void) {
        this.enterFns = this.enterFns || [];
        this.enterFns.push(fn);
    }

    public onExited(fn : () => void) {
        this.exitFns = this.exitFns || [];
        this.exitFns.push(fn);
    }

    public addEventHandler<T>(evt : StateChartEvent<T>, callback : (data? : T) => void) : void {
        this.events.push({ event: evt, handler: callback });
    }

    public handleEvent<T>(evtPackage : IEventPackage<T>) : { targetId : string, from : StateChartState } {
        const evt = evtPackage.event;
        const data = evtPackage.data;
        for (let i = 0; i < this.events.length; i++) {
            if (this.events[i].event === evt && this.events[i].handler) {
                this.events[i].handler(data);
            }
        }

        for(let i = 0; i < this.transitions.length; i++) {
            const transition = this.transitions[i];
            if(transition.evt === evt && transition.guardFn(data)) {
                return { targetId: transition.target, from: this };
            }
        }

        for (let i = 0; i < this.states.length; i++) {
            if (this.states[i].isActive) {
                const retn = this.states[i].handleEvent(evtPackage);
                if (retn) return retn;
            }
        }
        return null;
    }

    public enter(enterPath? : StateChartState[]) {
        if (this.isActive) return;
        //if(logging) console.log("Enter - ", this.id);
        this.isActive = true;
        this.behavior && this.behavior.enter();
        this.initFns && this.initFns.forEach(fn => fn());
        this.enterFns && this.enterFns.forEach(fn => fn());
        this.initFns = null;
        if (enterPath && enterPath.length > 0) {
            const child = enterPath.pop();
            if (child.parent !== this) {
                throw new Error("Invalid StateChart enter path");
            }
            else {
                child.enter(enterPath);
            }
        }
        else if (this.states.length > 0) {
            this.states[0].enter();
        }
    }

    public update() {
        this.behavior && this.behavior.update();
        this.updateFns && this.updateFns.forEach(fn => fn());
        for (let i = 0; i < this.states.length; i++) {
            if (this.states[i].isActive) {
                this.states[i].update();
            }
        }
    }

    public exit() {
        if (!this.isActive) return;
        //if(logging) console.log("Enter - ", this.id);
        this.isActive = false;
        this.behavior && this.behavior.exit();
        this.exitFns && this.exitFns.forEach(fn => fn());
        this.exitChildren();
    }

    public exitChildren(enterPath : StateChartState[] = null) {
        for (let i = 0; i < this.states.length; i++) {
            if (this.states[i].isActive) {
                if(enterPath) {
                    if(enterPath.indexOf(this.states[i]) === -1) {
                        this.states[i].exit();
                    }
                }
                this.states[i].exit();
            }
        }
    }

    public isParentOf(other : StateChartState) {
        let ptr = other.parent;
        while(ptr) {
            if(ptr === this) {
                return true;
            }
            ptr = ptr.parent;
        }
        return false;
    }

}

class StateChartParallelState extends StateChartState {

    public enter(enterPath? : StateChartState[]) {
        if (this.isActive) return;
        this.isActive = true;
        this.behavior && this.behavior.enter();
        this.initFns && this.initFns.forEach(fn => fn());
        this.initFns = null;
        enterPath && enterPath.pop();
        for (let i = 0; i < this.states.length; i++) {
            this.states[i].enter(enterPath);
        }
    }

}

export type StateDef = {
    (id : string) : void;
    (id : string, definition : VoidFn) : void;
    (id : string, behavior : StateChartBehavior, definition : VoidFn) : void;
    (id : string, behaviorOrDefinition? : StateChartBehavior | VoidFn, definition? : VoidFn) : void;
    parallel : {
        (id : string, definition : VoidFn) : void;
        (id : string, behavior : StateChartBehavior, definition : VoidFn) : void;
        (id : string, behaviorOrDefinition? : StateChartBehavior | VoidFn, definition? : VoidFn) : void;
    }
};

export class StateChart_Internal extends StateChartState {

    public stateMap : Map<string, StateChartState>;
    public stateStack : Array<StateChartState>;
    public eventQueue : Array<IEventPackage<any>>;
    public eventQueue0 : Array<IEventPackage<any>>;
    public eventQueue1 : Array<IEventPackage<any>>;
    public stateDef : StateDef;
    public builder : StateChartBuilder;

    constructor(definition : (builder : StateChartBuilder) => void) {
        super("$root", null, null);
        this.isActive = true;
        this.stateDef = this.getStateFn();
        this.stateMap = new Map<string, StateChartState>();
        this.stateStack = [];
        this.eventQueue0 = [];
        this.eventQueue1 = [];
        this.eventQueue = this.eventQueue0;
        this.stateStack.push(this as any);
        this.builder = new StateChartBuilder(this);
        (this.builder as any).currentState = this;
        definition(this.builder);
        this.stateStack.pop();
        this.stateStack = null;
        this.initFns && this.initFns.forEach(fn => fn());
        this.enterFns && this.enterFns.forEach(fn => fn());
        if (this.states[0] !== void 0) {
            this.states[0].enter();
        }
    }

    public update() {
        //process an event queue tick
        var currentQueue = this.eventQueue;
        //swap event queues
        this.eventQueue = this.eventQueue === this.eventQueue0 ? this.eventQueue1 : this.eventQueue0;
        //do all transitions but queue all events till next frame
        while (currentQueue.length !== 0) {
            var transition = this.handleEvent(currentQueue.shift());
            if(transition) {
                this.goTo(transition.targetId, transition.from);
            }
        }
        if(this.updateFns !== null){
            for(let i = 0; i < this.updateFns.length; i++) {
                this.updateFns[i]();
            }
        }
        var active = this.getActiveState();
        if(active !== null) active.update();
    }

    public isInState(id : string) : boolean {
        const state = this.stateMap.get(id);
        return state !== void 0 && state.isActive;
    }

    public trigger<T>(event : StateChartEvent<T>, data? : T) : void {
        if (this.stateStack) throw new Error("StateChart hasn't entered yet, invalid call to trigger()");
        this.eventQueue.push({event: event, data : data});
    }

    public getConfiguration() {
        const config = new Array<string[]>();
        const leaves = new Array<StateChartState>();
        this.stateMap.forEach((state : StateChartState) => {
            if (state.isActive && state.states.length === 0) {
                leaves.push(state);
            }
        });
        for (let i = 0; i < leaves.length; i++) {
            const leaf = leaves[i];
            const branchConfig = new Array<string>();
            let ptr : any = leaf;
            while (ptr !== this) {
                branchConfig.push(ptr.id);
                ptr = ptr.parent;
            }
            config.push(branchConfig.reverse());
        }
        return config;
    }

    public getStateFn() : StateDef {
        const fn : any = this.state.bind(this);
        fn.parallel = this.parallel.bind(this);
        return fn as StateDef;
    }

    private goTo(targetId : string, from : StateChartState) {
        let ptr = this.stateMap.get(targetId) as StateChartState;
        if (!ptr) {
            throw new Error("Invalid state: " + targetId);
        }
        if (ptr === from) return;
        let enterPath : Array<StateChartState> = [];
        //find highest parent of target that is active
        //if from is a parent of ptr
        if(from.isParentOf(ptr)) {
            //work up from ptr until we hit from, enter as we go
            while(ptr !== from) {
                enterPath.push(ptr);
                ptr = ptr.parent;
            }
            from.exitChildren(enterPath);
            enterPath.shift().enter(enterPath);
        }
        else {
            while (!ptr.isActive) {
                enterPath.unshift(ptr);
                ptr = ptr.parent;
            }
            ptr.exitChildren();
            enterPath.shift().enter(enterPath);
        }
    }

    public transition<T>(evt : StateChartEvent<T>, targetStateId : string, guardFunction? : (data? : T) => boolean) {
        if (!this.stateStack) throw new Error("StateChart has already entered, cannot call 'transition()'");
        this.stateStack.getLast().transitions.push(new StateChartTransition(evt, targetStateId, guardFunction));
    }

    private state(id : string) : void;
    private state(id : string, definition : VoidFn) : void;
    private state(id : string, behavior : StateChartBehavior, definition : VoidFn) : void;
    private state(id : string, behaviorOrDefinition? : StateChartBehavior | VoidFn, definition? : VoidFn) : void {

        if (arguments.length === 1) {
            this.createState(id, null, null, false);
        }
        else if (arguments.length === 2) {
            this.createState(id, behaviorOrDefinition as VoidFn, null, false);
        }
        else if (arguments.length === 3) {
            this.createState(id, definition, behaviorOrDefinition as StateChartBehavior, false);
        }

    }

    private parallel(id : string, definition : VoidFn) : void;
    private parallel(id : string, behavior : StateChartBehavior, definition : VoidFn) : void;
    private parallel(id : string, behaviorOrDefinition : StateChartBehavior | VoidFn, definition? : VoidFn) : void {

        if (arguments.length === 2) {
            this.createState(id, behaviorOrDefinition as VoidFn, null, true);
        }
        else if (arguments.length === 3) {
            this.createState(id, definition, behaviorOrDefinition as StateChartBehavior, true);
        }

    }

    private createState(id : string, definition : VoidFn, behavior : StateChartBehavior, isParallel = false) {

        if (!this.stateStack) throw new Error("StateChart has already entered, cannot call 'parallel()'");
        if (this.stateMap.get(id)) {
            throw new Error("States within a StateChart cannot have duplicate ids, '" + id + "' was already registered");
        }

        const parentState = this.stateStack.getLast();
        const Type = (isParallel) ? StateChartParallelState : StateChartState;

        const state = new Type(id, parentState, behavior);

        parentState.states.push(state);
        this.stateMap.set(id, state);

        if (typeof definition === "function") {
            this.stateStack.push(state);
            (this.builder as any).currentState = state;
            definition();
            this.stateStack.pop();
        }

        if (state.behavior) {
            (state.behavior as any).chart = this;
        }
    }

    private getActiveState() {
        return this.states.find(function (state : StateChartState) {
            return state.isActive;
        });
    }

}

//[Hack!] weirdness w/ typescript compiler makes it hard to hide methods from subclass...no idea why.
//export a shadow class instead with only the properly exposed signature
export class StateChart {

    public trigger : <T>(event : StateChartEvent<T>, data? : T) => void;
    public update : () => void;
    public getConfiguration: () => string[][];
    public isInState : (id : string) => boolean;

    constructor(fn : (builder : StateChartBuilder) => void) {
        return new StateChart_Internal(fn);
    }

    public static createEvent<T>() : StateChartEvent<T> {
        return new StateChartEvent<T>();
    }
}

export interface IStateChartDSL {
    state : StateDef;
    transition<T>(evt : StateChartEvent<T>, targetStateId : string, guard? : (data? : T) => boolean) : void;
    init(fn : () => void) : void;
    enter(fn : () => void) : void;
    update(fn : () => void) : void;
    exit(fn : () => void) : void;
    event<T>(evt : StateChartEvent<T>, callback : (data? : T) => void) : void;
    trigger<T>(evt : StateChartEvent<T>, data : T) : void;
    isInState(stateId : string) : boolean;
}

type Callback = (fn : () => void) => void;

export class StateChartBuilder {

    private chart : StateChart_Internal;

    constructor(chart : StateChart_Internal) {
        this.chart = chart;
    }

    public init(fn : () => void) {
        this.chart.stateStack.getLast().onInit(fn);
    }

    public enter(fn : () => void) {
        this.chart.stateStack.getLast().onEntered(fn);
    }

    public exit(fn : () => void) {
        this.chart.stateStack.getLast().onExited(fn);
    }

    public update(fn : () => void) {
        this.chart.stateStack.getLast().onUpdated(fn);
    }

    public event<T>(evtType : StateChartEvent<T>, callback? : (data? : T) => void) : void {
        this.chart.stateStack.getLast().addEventHandler(evtType, callback);
    }

    public trigger<T>(evt : StateChartEvent<T>, data? : T) {
        this.chart.trigger(evt, data);
    }

    public toDSL() : IStateChartDSL {
        return {
            enter: this.enter.bind(this) as Callback,
            exit: this.exit.bind(this) as Callback,
            update: this.update.bind(this) as Callback,
            init: this.init.bind(this) as Callback,
            trigger: this.chart.trigger.bind(this.chart),
            state: this.chart.getStateFn() as StateDef,
            event: this.event.bind(this),
            isInState: this.chart.isInState.bind(this.chart),
            transition: this.chart.transition.bind(this.chart)
        }
    }

}




