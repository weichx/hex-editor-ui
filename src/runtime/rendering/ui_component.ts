import {Component} from "../component";
import {TagType} from "../e_tag_type";
import {RenderFlag, RenderSystem} from "./render_system";
import {Entity} from "../entity";
import {TransformFlag} from "../transform";
import {Material} from "./material";
import {PaintPropertyId} from "./style/style_property_set";
import {Color} from "../color";
import {Vector2} from "../../math/vector2";
import {BackgroundClip, BackgroundRepeat, BackgroundScroll} from "./background";
import {HexImage} from "../../resources/hex_image";
import {UnitValue} from "../unit";

//todo Font settings should cascade downwards

export class UIComponent extends Component {

    public id : integer;
    public attributes : Map<string, string>;
    public tagType : TagType;
    public siblingIndex : integer;

    protected renderSystem : RenderSystem;
    public parentUIComponent : UIComponent;
    public uiComponentChildren : Array<UIComponent>;
    public renderFlags : RenderFlag;
    public insertIndex : number; //todo this doesn't belong here
    public material : Material;

    protected textString : string;

    constructor(entity : Entity) {
        super(entity);
        this.id = entity.id as integer;
        this.tagType = TagType.Div;
        this.renderFlags = 0;
        this.renderSystem = entity.application.renderSystem;
        this.attributes = null;
        this.uiComponentChildren = [];
        this.parentUIComponent = null;
        this.material = new Material();
        this.textString = "";
    }

    public onInitialize() {
        this.parentUIComponent = this.getComponentInAncestors(UIComponent);
        this.renderSystem.createUIComponent(this);
    }

    public onUpdate() {
        if ((this.transform.flags & TransformFlag.DimensionDirty) !== 0) {
            this.renderSystem.resizeUIComponent(this);

        }
        if ((this.transform.flags & TransformFlag.TransformDirty) !== 0) {
            this.renderSystem.transformUIComponent(this);
        }
        //todo -- move this!
        this.transform.flags = 0;
    }

    public getContent() : string {
        return this.textString;
    }

    public setContent(textString : string) : void {
        this.textString = textString;
        this.renderSystem.setUIComponentContent(this);
    }

    public setImageContent(src : string) {
        this.setStyle({backgroundImage: `url('${src}')`});
        this.setAttribute("src", src);
    }

    public setAttribute(attributeName : string, value : string) {
        if (value !== null && this.attributes === null) {
            this.attributes = new Map<string, string>();
        }
        this.attributes.set(attributeName, value);
        this.renderSystem.setUIComponentAttribute(this);
    }

    public setStyle(style : any) : void {
        this.renderSystem.setUIComponentStyle(this);
        const styleKeys : Array<PaintPropertyId> = Object.keys(style) as any;
        for (var i = 0; i < styleKeys.length; i++) {
            this.material.setStyleValue(styleKeys[i] as PaintPropertyId, style[styleKeys[i]], "base");
        }
    }

    public setBackgroundColor(color : Color) : void {
        this.material.setStyleValue("backgroundColor", color, "base");
        this.renderSystem.setUIComponentStyle(this);
    }

    public setBackgroundSize(size : Vector2) : void {
        this.material.setStyleValue(PaintPropertyId.BackgroundSize, size, "base");
        this.renderSystem.setUIComponentStyle(this);
    }

    public setBackgroundPosition(vector2 : Vector2) : void {
        this.material.setStyleValue(PaintPropertyId.BackgroundPosition, vector2, "base");
        this.renderSystem.setUIComponentStyle(this);
    }

    public setBackgroundImage(image : HexImage) : void {
        this.material.setStyleValue(PaintPropertyId.BackgroundImage, image, "base");
        this.renderSystem.setUIComponentStyle(this);
    }

    public setBackgroundClip(clip : BackgroundClip) : void {
        this.material.setStyleValue(PaintPropertyId.BackgroundClip, clip, "base");
        this.renderSystem.setUIComponentStyle(this);
    }

    public setBackgroundRepeat(repeat : BackgroundRepeat) : void {
        this.material.setStyleValue(PaintPropertyId.BackgroundRepeat, repeat, "base");
        this.renderSystem.setUIComponentStyle(this);
    }

    public setBackgroundScroll(scroll : BackgroundScroll) : void {
        this.material.setStyleValue(PaintPropertyId.BackgroundScroll, scroll, "base");
        this.renderSystem.setUIComponentStyle(this);
    }

    public setTagType(tagType : TagType) {
        this.tagType = tagType;
    }

    public onEnable() {
        this.assignChildIndices();
    }

    public onChildMoved(child : Entity, newIndex : number) {
        if (child.getComponent(UIComponent) !== null) {
            this.assignChildIndices();
        }
    }

    public onParentChanged(oldParent : Entity, newParent : Entity) {
        this.parentUIComponent = this.getComponentInAncestors(UIComponent);
        this.parentUIComponent.assignChildIndices();
        this.renderSystem.setUIComponentParent(this, this.parentUIComponent);
    }

    protected assignChildIndices() : void {
        const children = this.uiComponentChildren;
        for (var i = 0; i < children.length; i++) {
            const child = children[i];
            if (child.siblingIndex !== i) {
                child.flags |= RenderFlag.SiblingIndex;
                child.siblingIndex = i;
            }
        }
    }

    public getVisibilityType() {

    }

    public getRenderedRect() {

    }

    public onDestroy() {

    }

    public onPreRender() {
        if (this.renderFlags === 0) return;

        //if view !== lastView
        //if lastframeparent !== parent
        //if dimension !== lastDimension
        //if enabled !== wasEnabled
        //if depth !== lastDepth
        //if siblingIndex !== lastSiblingIndex
        //if pendingAttributes.length !== 0
        //if content !== lastContent
        //if destroyed
        //if created
        //if pending style changes.length !== 0

        //transform is 'dirty' only if it changed relative to it's parent
        //or if transform was re-parented
        if ((this.transform.flags & TransformFlag.TransformDirty) !== 0) {
            // this.renderSystem.addDirtyTransform(this);
            //this.recomputeViewMatrix();
        }

        this.renderFlags = 0;
    }

    public shouldRenderChildren() : boolean {
        return true;
    }

}

export class UITextString extends UIComponent {

}

export class UITextInput extends UIComponent {

}

export class UIImage extends UIComponent {

    private image : HexImage;

    public shouldRenderChildren() {
        return false;
    }

    public setImageWidth(value : UnitValue) : void {
        this.setAttribute("width", value.getValue().toString());
    }

    public setImageHeight() : void {};

    public setImage(image : HexImage) {
        this.setAttribute("src", image.source);
    }

}

export class UILink extends UIComponent {

    public setHref() {}

    public setTextContent() {}

}