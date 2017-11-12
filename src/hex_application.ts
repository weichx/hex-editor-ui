import * as array from "./util/array";
import {Entity, RootEntity} from "./runtime/entity";
import {Component, ComponentFlag} from "./runtime/component";
import {Input} from "./input/input";
import {QuadTree} from "./util/quad_tree";
import {inverseDepthSort} from "./util/compare";
import {InputStateModule} from "./input/input_state_module";
import {Vector2} from "./math/vector2";
import {Time, TimeData} from "./runtime/time";
import {OnOffList} from "./util/on_off_list";
import {RenderSystem} from "./runtime/rendering/render_system";
//noinspection BadExpressionStatementJS
array;//need reference or TS eliminates this

const Component$onInitialize = Component.prototype.onInitialize;
const Component$onReady = Component.prototype.onReady;
const Component$onUpdate = Component.prototype.onUpdate;
const Component$onEnable = Component.prototype.onEnable;
const Component$onDisable = Component.prototype.onDisable;

//todo -- onofflist.remove may not make sense since we already store iteration frames

export class HexApplication {

    public readonly id : number;
    public readonly name : string;

    protected entityRegistry : Map<EntityId, Entity>;

    public readonly layouts : any[];
    public readonly rootEntity : RootEntity;
    public readonly renderSystem : RenderSystem;
    public readonly input : Input;
    public readonly viewportQuadTree : QuadTree<Entity>;

    protected mouseOverEntities : Array<Entity>;
    protected inputStateModule : InputStateModule;
    protected mousePositionCache : Vector2;
    protected idGenerator : number;
    protected lastFrameTime = 0;
    protected time : TimeData;

    protected initList : OnOffList<Component>;
    protected readyList : OnOffList<Component>;
    protected enableList : OnOffList<Component>;
    protected disableList : OnOffList<Component>;
    protected updateList : OnOffList<Component>;
    protected renderList : OnOffList<Component>;

    constructor(name : string) {
        this.id = ++HexApplication.AppId;
        this.name = name;
        this.entityRegistry = new Map<EntityId, Entity>();
        this.input = new Input();
        this.idGenerator = 0;
        this.layouts = [];

        this.viewportQuadTree = new QuadTree<Entity>();
        this.mouseOverEntities = [];
        this.inputStateModule = new InputStateModule(this.input);
        this.mousePositionCache = new Vector2();
        this.time = new TimeData(performance.now());

        this.initList = new OnOffList<Component>(this.iterateInitList.bind(this));
        this.readyList = new OnOffList<Component>(this.iterateReadyList.bind(this));
        this.enableList = new OnOffList<Component>(this.iterateEnableList.bind(this));
        this.disableList = new OnOffList<Component>(this.iterateDisableList.bind(this));
        this.updateList = new OnOffList<Component>(this.iterateUpdateList.bind(this));
        this.renderList = new OnOffList<Component>(this.iterateRenderList.bind(this));

        this.renderSystem = new RenderSystem(this);
        this.rootEntity = new RootEntity(this);
        // this.rootEntity.addComponent(View);

    }

    public setMountPoint(element : HTMLElement) {
        this.renderSystem.setRenderTarget(element);
        this.input.setTargetElement(element);
    }

    public start() : void {
        this.update(0);
    }

    public update(time : number) {
        //todo deadline for updates
        this.time.update(time);

        Time.setTimeData(this.time);

        //enable / disable effect should be immediate but callbacks can be deferred

        this.initList.iterate();
        this.initList.clearActive();

        this.readyList.iterate();
        this.readyList.clearActive();

        this.enableList.iterate();
        this.enableList.clearActive();

        this.updateList.iterate();

        this.disableList.iterate();
        this.disableList.clearActive();

        for (let i = 0; i < this.layouts.length; i++) {
            this.layouts[i].doLayout();
        }

        this.mouseOverEntities.length = 0;
        this.input.getMousePosition(this.mousePositionCache);
        this.viewportQuadTree.queryPoint(this.mousePositionCache, this.mouseOverEntities);

        this.mouseOverEntities = this.mouseOverEntities.sort(inverseDepthSort);
        this.inputStateModule.update(this.mouseOverEntities);
        this.input.update();

        this.renderSystem.render();
        this.lastFrameTime = time;

        //this.renderSystem.setCursor();
        //if we have a drag action, try to use its cursor command
        //if not,
        //find top most cursorComponent that is not set to 'auto'
        //if no cursor component found use app default or 'auto'
    }

    public removeEntity(entity : Entity) : void {
        throw new Error('Method not implemented.');
    }

    public insertEntity(entity : Entity, parent : Entity, index : number) : void {
        throw new Error('Method not implemented.');
        //todo update trees
        //todo call move on components
    }

    /** @internal */
    public setEntityParent(entity : Entity, parent : Entity, oldParent : Entity) : void {

    }

    /** @internal */
    //todo -- currently viewport tree does not store entities without components, should it?
    public addEntity(entity : Entity) {
        const readable = (entity as any);
        readable.id = ++this.idGenerator;
        readable.applicationId = this.id;
        this.entityRegistry.set(entity.id, entity);
        const parentComponents = readable.parent.components;
        for (let i = 0; i < parentComponents.length; i++) {
            parentComponents[i].onChildAdded(entity);
        }
        this.viewportQuadTree.store(entity);

    }

    /** @internal */
    public enableEntity(entity : Entity) {
        //todo - work on this
        this.viewportQuadTree.store(entity);
    }

    /** @internal */
    public disableEntity(entity : Entity) {
        var components = (entity as any).components;
        for (let i = 0; i < components.length; i++) {
            components[i].disable();
        }
        //todo also disable child entities
        this.viewportQuadTree.remove(entity);
    }

    //this needs to handle getting enabled toggled within itself
    //this is just for one off component toggling, NOT for hierarchy traversal
    public enableComponent(component : Component) : void {

        component.flags |= ComponentFlag.Enabled;

        if ((component.flags & ComponentFlag.InitComplete) !== ComponentFlag.InitComplete) {

            if ((component.flags & ComponentFlag.Initialized) === 0) {
                this.initList.activate(component);
            }
            if ((component.flags & ComponentFlag.Ready) === 0) {
                this.readyList.activate(component);
            }

        }
        else {
            if(component.onUpdate !== Component$onUpdate) {
                this.updateList.activate(component)
            }
        }

        this.enableList.activate(component);
        this.disableList.remove(component);

    }

    public disableComponent(component : Component) : void {
        component.flags &= ~ComponentFlag.Enabled;

        this.enableList.remove(component);
        this.disableList.activate(component);
        if (component.onUpdate !== Component$onUpdate) {
            this.updateList.remove(component);
        }
        if ((component.flags & ComponentFlag.InitComplete) !== ComponentFlag.InitComplete) {
            this.initList.remove(component);
            this.readyList.remove(component);
        }
    }

    /** @internal */
    public removeElement(entity : Entity) {
        this.entityRegistry.delete(entity.id);
    }

    /** @internal */
    //todo move most/all of this to compiler transforms
    public addComponent(component : Component) : void {
        component.onCreate();
        component.flags |= ComponentFlag.Created;
        const isEnabled = component.isEnabled();
        if(isEnabled) {
            this.initList.activate(component);
            this.readyList.activate(component);
            this.enableList.activate(component);
        }
        // this.disableList.add(component, !isEnabled);

        if (isEnabled) {
            component.flags |= ComponentFlag.Enabled;
        }

    }

    public unload() : void {

    }

    /** @internal */
    public removeComponent(component : Component) : void {

    }

    public getRenderSystem() : RenderSystem {
        return this.renderSystem;
    }

    public getRootEntity() : Entity {
        return this.rootEntity;
    }

    protected iterateInitList(component : Component) : void {
        component.flags |= ComponentFlag.Initialized;
        component.onInitialize();
        if (component.isEnabled()) {
            this.readyList.activate(component);
        }
    }

    protected iterateReadyList(component : Component) : void {
        component.flags |= ComponentFlag.Ready;
        component.onReady();
        if (component.isEnabled()) {
            this.enableList.activate(component);
        }

    }

    protected iterateEnableList(component : Component) : void {
        component.onEnable();
        if (component.onUpdate !== Component$onUpdate) {
            this.updateList.activate(component);
        }
    }

    protected iterateDisableList(component : Component) : void {
        component.onDisable();
        if (component.onUpdate !== Component$onUpdate) {
            this.updateList.remove(component);
        }
    }

    protected iterateUpdateList(component : Component) : void {
        component.onUpdate(this.time.deltaTime);
    }

    protected iterateRenderList(component : Component) : void {

    }

    private static AppId = 0;

}
