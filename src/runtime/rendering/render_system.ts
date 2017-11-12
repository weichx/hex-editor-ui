//CORRECT THEN FAST! its ok for this to be slow for the moment
//excessive dirty checking is allowed

import {TagType} from "../e_tag_type";
import {HexApplication} from "../../hex_application";
import {Entity} from "../entity";
import {Stack} from "../../util/stack";
import {UIComponent} from "./ui_component";
import {ContentBox} from "../../components/content_box";
import {Transform} from "../transform";

export enum RenderFlag {
    Position = 1 << 1,
    Rotation = 1 << 2,
    Scale = 1 << 3,
    Parent = 1 << 4,
    Paint = 1 << 5,
    Enabled = 1 << 6,
    Created = 1 << 7,
    Destroyed = 1 << 8,
    Dimensions = 1 << 9,
    Content = 1 << 10,
    Attribute = 1 << 11,
    SiblingIndex = 1 << 12,
    Transform = Position | Rotation | Scale,
    RequiresInsert = Created | SiblingIndex | Parent
}

class RootUIComponent extends UIComponent {

    //avoid default behavior
    onInitialize() {}

}

function tagTypeToString(tagType : TagType) {
    switch (tagType) {
        case TagType.Div:
            return "div"
    }
    return "div";
}

function traversalIndexSort(a : UIComponent, b : UIComponent) : integer {
    return (a.entity.traversalIdx > b.entity.traversalIdx) ? -1 : 1;
}

export class RenderSystem {

    public styleQueue : Array<UIComponent>;
    public contentQueue : Array<UIComponent>;
    public creationQueue : Array<UIComponent>;
    public insertionQueue : Array<UIComponent>;
    public transformQueue : Array<UIComponent>;
    public dimensionQueue : Array<ContentBox>;
    public attributeQueue : Array<UIComponent>;

    private dirtyUIElements : UIComponent[];
    private domNodes : Map<number, HTMLElement>;

    protected application : HexApplication;
    protected domRoot : HTMLElement;
    protected parentElementsReceivingInsert : Array<UIComponent>;
    protected traversalStack : Stack<Entity>;
    protected rootContentBox : ContentBox;

    constructor(application : HexApplication) {
        this.application = application;
        this.dirtyUIElements = [];
        this.creationQueue = [];
        this.insertionQueue = [];
        this.transformQueue = [];
        this.dimensionQueue = [];
        this.attributeQueue = [];
        this.styleQueue = [];
        this.contentQueue = [];
        this.domNodes = new Map<number, HTMLElement>();
        this.parentElementsReceivingInsert = [];
        this.rootContentBox = null;
        this.traversalStack = new Stack<Entity>(128);
    }

    public setRenderTarget(rootNode : HTMLElement) : void {
        this.domRoot = rootNode;
        this.domRoot.style.width = "100%";
        this.domRoot.style.height = "100%";
        const rootUIComponent = this.application
        .getRootEntity()
        .addComponent(RootUIComponent);
        this.rootContentBox = rootUIComponent.entity.contentBox;
        this.domNodes.set(rootUIComponent.id, this.domRoot);
    }

    public setUIComponentContent(uiComponent : UIComponent) : void {
        this.setUIComponentDirty(uiComponent, RenderFlag.Content);
    }

    public setUIComponentStyle(uiComponent : UIComponent) : void {
        this.setUIComponentDirty(uiComponent, RenderFlag.Paint);
        // uiComponent.material.setStyleValue("backgroundColor", 0xffffffff, "base");
        // const states = Object.keys(style);
        // for(var i = 0; i < states.length; i++) {
        //     const state : any = states[i];
        //     const properties = Object.keys(state);
        //     for(var j = 0; j < properties.length; j++) {
        //         const patch = new StylePatch(uiComponent.id, "backgroundColor", state[properties[j]]);
        //         this.styleQueue.push(patch);
        //     }
        // }
    }

    public setUIComponentAttribute(uiComponent : UIComponent) : void {

    }

    public resizeUIComponent(uiComponent : UIComponent) : void {
        this.setUIComponentDirty(uiComponent, RenderFlag.Dimensions);
    }

    public transformUIComponent(uiComponent : UIComponent) : void {
        this.setUIComponentDirty(uiComponent, RenderFlag.Transform);
    }

    public setUIComponentParent(uiComponent : UIComponent, parent : UIComponent) : void {

    }

    public createUIComponent(uiComponent : UIComponent) {
        if (uiComponent.renderFlags === 0) {
            this.dirtyUIElements.push(uiComponent);
        }
        uiComponent.renderFlags |= RenderFlag.Created;
    }

    public enableUIComponent(uiComponent : UIComponent) {
        if (uiComponent.renderFlags === 0) {
            this.dirtyUIElements.push(uiComponent);
        }
        uiComponent.renderFlags |= RenderFlag.Enabled;
    }

    public setRenderTargetSize(width : float, height : float) {
        const rootUIComponent = this.application
        .getRootEntity()
        .addComponent(RootUIComponent);
        this.rootContentBox = rootUIComponent.entity.contentBox;
        this.rootContentBox.setSize(width.px, height.px);
    }

    public render() : void {

        if (this.domRoot === null) return;

        const dirtyContentBoxes = ContentBox.FlushDirtyContentBoxes();
        //const dirtyTransforms = Transform.FlushDirtyTransforms();

        for(var i = 0; i < dirtyContentBoxes.length; i++) {
            this.dimensionQueue.push(dirtyContentBoxes[i]);
        }
        //todo -- may be able to only assign traversals for some elements instead of the whole tree
        //i think its only the insert queue that requires this to be sorted

        this.assignTraversalIndices(); //maybe don't use the entity to store the index

        this.dirtyUIElements.sort(traversalIndexSort);

        //eventually want to special case creation so we do only one actual dom insert

        for (var i = 0; i < this.dirtyUIElements.length; i++) {

            const uiComponent = this.dirtyUIElements[i];

            if (uiComponent.isDestroyed()) continue; //todo nuke the node!

            const flags = uiComponent.renderFlags;

            //todo maybe just push directly into queues instead of setting flags
            //though because of sorting requirement maybe not
            //todo figure out what queues need sorting and only sort those
            if ((flags & RenderFlag.Created) !== 0) {
                this.creationQueue.push(uiComponent);
            }

            if ((flags & RenderFlag.Transform) !== 0) {
                this.transformQueue.push(uiComponent);
            }

            // if ((flags & RenderFlag.Dimensions) !== 0) {
            //     this.dimensionQueue.push(uiComponent);
            // }

            if ((flags & RenderFlag.Parent) !== 0) {

            }

            if ((flags & RenderFlag.Paint) !== 0) {
                this.styleQueue.push(uiComponent);
            }

            if ((flags & RenderFlag.Attribute) !== 0) {
                this.attributeQueue.push(uiComponent);
            }

            if ((flags & RenderFlag.Content) !== 0) {
                this.contentQueue.push(uiComponent);
            }

            if ((flags & RenderFlag.RequiresInsert) !== 0) {
                //this can be done via flag check instead of indexof check probably
                const parent = uiComponent.parentUIComponent;
                const idx = this.parentElementsReceivingInsert.indexOf(parent);
                if (idx === -1 && parent !== null) {
                    this.parentElementsReceivingInsert.push(parent);
                }
                this.insertionQueue.push(uiComponent);
            }

            uiComponent.renderFlags = 0;

        }
        this.dirtyUIElements.length = 0;
        this.destroyElements();
        this.createElements();
        this.updateContent();
        this.updateAttributes();
        this.updateTransforms();
        this.updateDimensions();
        this.updateStyles();
        this.insertElements();
    }

    protected setUIComponentDirty(uiComponent : UIComponent, flag : RenderFlag) : void {
        if (uiComponent.renderFlags === 0) {
            this.dirtyUIElements.push(uiComponent);
        }
        uiComponent.renderFlags |= flag;
    }

    protected createElements() {
        for (var i = 0; i < this.creationQueue.length; i++) {
            const uiComponent = this.creationQueue[i];
            // if (!uiComponent.isEnabled()) continue;
            const domElement = document.createElement(tagTypeToString(uiComponent.tagType));
            domElement.setAttribute("x-id", uiComponent.id.toString());
            domElement.style.position = "absolute";
            domElement.style.background = "white"; //temp!
            const width = uiComponent.entity.contentBox.getWidth();
            const height = uiComponent.entity.contentBox.getHeight();
            domElement.style.width = width + "px";
            domElement.style.height = height + "px";
            this.domNodes.set(uiComponent.id, domElement);
        }
        this.creationQueue.length = 0;
    }

    protected updateDimensions() {
        for (var i = 0; i < this.dimensionQueue.length; i++) {
            const contentBox = this.dimensionQueue[i];
            const domNode = this.domNodes.get(contentBox.entity.id as integer);
            if(domNode !== void 0) {
                const styleNode = domNode.style;
                styleNode.width = contentBox.getWidth() + "px";
                styleNode.height = contentBox.getHeight() + "px";
            }
        }
        this.dimensionQueue.length = 0;
    }

    protected updateTransforms() {
        //transform needs updating when transform changes relative to it's parent
        for (var i = 0; i < this.transformQueue.length; i++) {
            const uiComponent = this.transformQueue[i];
            const style = this.domNodes.get(uiComponent.id).style;
            const vm = uiComponent.transform.worldMatrix.m;
            style.transform = `matrix(${vm[0]},${vm[1]},${vm[4]},${vm[5]},${vm[12]},${vm[13]})`;
        }
        this.transformQueue.length = 0;
    }

    protected updateContent() {
        for (var i = 0; i < this.contentQueue.length; i++) {
            const uiComponent = this.contentQueue[i];
            const domNode = this.domNodes.get(uiComponent.id);
            var textNode = domNode.firstChild as Text;
            if (textNode instanceof Text) {
                textNode.nodeValue = uiComponent.getContent();
            }
            else {
                textNode = document.createTextNode(uiComponent.getContent());
                domNode.insertChild(textNode, 0);
            }
        }
        this.contentQueue.length = 0;
    }

    protected updateStyles() {
        for (var i = 0; i < this.styleQueue.length; i++) {
            const uiComponent = this.styleQueue[i];
            const material = uiComponent.material;
            const domNode = this.domNodes.get(uiComponent.id);
            const styleNode = domNode.style as any;
            for (var j = 0; j < material.dirtyStyleFields.length; j++) {
                const field = material.dirtyStyleFields[j];
                styleNode[field] = material.getStyleValue(field);
            }
            material.dirtyStyleFields.length = 0;
        }
        this.styleQueue.length = 0;
    }

    protected updateAttributes() {
        for (var i = 0; i < this.attributeQueue.length; i++) {
            const uiElement = this.attributeQueue[i];
            const node = this.domNodes.get(uiElement.id);
            const imageNode = node.firstElementChild;
            uiElement.attributes.forEach(function(value : string, key : string) {
                node.setAttribute(key, value);
            });
        }
        this.attributeQueue.length = 0;
    }

    protected destroyElements() : void {}

    protected assignTraversalIndices() {
        var idx = 0;
        const stack = this.traversalStack;
        stack.push(this.application.rootEntity);
        while (stack.count > 0) {
            const entity = stack.pop();
            entity.traversalIdx = idx++;
            for (var i = 0; i < entity.children.length; i++) {
                stack.push(entity.children[i]);
            }
        }
    }

    protected insertElements() : void {

        //might need to do removals first!

        for (let i = 0; i < this.parentElementsReceivingInsert.length; i++) {
            const children = this.parentElementsReceivingInsert[i].uiComponentChildren;
            children.sort(traversalIndexSort);
            for (let j = 0; j < children.length; j++) {
                children[i].insertIndex = i;
            }
        }

        for (var i = 0; i < this.insertionQueue.length; i++) {
            const uiComponent = this.insertionQueue[i];
            const parentNode = this.domNodes.get(uiComponent.parentUIComponent.id);
            const childNode = this.domNodes.get(uiComponent.id);
            parentNode.insertChild(childNode, uiComponent.insertIndex);
        }

        this.insertionQueue.length = 0;
    }

    protected updateParents() {
        for (var i = 0; i < this.dirtyUIElements.length; i++) {
            const el = this.dirtyUIElements[i];
        }
    }

}

