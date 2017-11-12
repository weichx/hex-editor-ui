import {Component} from "../runtime/component";
import {OffsetRectangle} from "../geometry/offset_rectangle";
import {Entity} from "../runtime/entity";
import {UnitType, UnitValue, UnitValue2} from "../runtime/unit";
import {Queue} from "../util/queue";

const ScratchQueue = new Queue<ContentBox>(128);

export const enum ContentBoxFlag {
    WidthDirty = 1 << 0,
    HeightDirty = 1 << 1,
    Dirty = WidthDirty | HeightDirty
}

export class ContentBox extends Component {

    public contentWidth : UnitValue;
    public contentHeight : UnitValue;
    public padding : OffsetRectangle;
    public margin : OffsetRectangle;
    public border : OffsetRectangle;

    public dirtyFlags : ContentBoxFlag;

    /** @internal */
    public parent : ContentBox;
    public children : Array<ContentBox>;

    public readonly constraints : {};

    public marginTop : UnitValue2;
    public marginRight : UnitValue2;
    public marginBottom : UnitValue2;
    public marginLeft : UnitValue2;

    public paddingTop : UnitValue2;
    public paddingRight : UnitValue2;
    public paddingBottom : UnitValue2;
    public paddingLeft : UnitValue2;

    public borderTop : UnitValue2;
    public borderRight : UnitValue2;
    public borderBottom : UnitValue2;
    public borderLeft : UnitValue2;

    constructor(entity : Entity) {
        super(entity);
        this.marginLeft = (100).pct;
        //this.marginLeft.getUnitValue(reference);
        this.parent = null;
        if (this.entity.parent !== null) {
            this.parent = this.entity.parent.contentBox;
            this.parent.children.push(this);
        }
        this.children = [];
        this.contentWidth = new UnitValue(0.5, UnitType.Percent);
        this.contentHeight = new UnitValue(0.5, UnitType.Percent);
        this.padding = new OffsetRectangle();
        this.border = new OffsetRectangle();
        this.margin = new OffsetRectangle();
        /*

            this.stateTree.registerClass(ContentBox, "/contentbox");
            this.stateTree.set("/entities/id/contentBox/", this);

            this.stateTree.set(this.stateTreePath, {
                width: { unit: PX, reference: x, multiple: y }
            });

            this.stateTree.bind(this, "x", "/path/to/value/binding");

            need to either serialize every frame (bad)
            or write setters for each serialized property (annoying)
            or let the tree trace object references (bad for GC)

            for data binding def need setter generation
            can do object path tracing from root scene objects
            or any other object explicitly serialized

            still not sure how to garbage collect the state tree

            should we ask for sizes with getters always? -- probably

         */
    }

    public setParent(parent : ContentBox) : void {
        if (this.parent !== null) {
            this.parent.children.remove(this);
        }
        this.parent = parent;
        if (this.parent !== null) {
            this.parent.children.push(this);
            this.setWidth(this.contentWidth);
        }
    }

    public get id() {
        return this.entity.id;
    }

    public getContentWidth() {
        //this.contentWidth.value * this.contentWith.unit === & ? this.parent.getContentWidth() : 1.0;
        return this.contentWidth.getValue();
    }

    public getFullWidth() {
        return this.margin.left.getValue() +
            this.margin.right.getValue() +
            this.border.left.getValue() +
            this.border.right.getValue() +
            this.padding.left.getValue() +
            this.padding.right.getValue() +
            this.contentWidth.getValue();
    }

    public getWidth() {
        return this.border.left.getValue() +
            this.border.right.getValue() +
            this.padding.left.getValue() +
            this.padding.right.getValue() +
            this.contentWidth.getValue();
    }

    public getHeight() {
        return this.margin.top.getValue() +
            this.margin.bottom.getValue() +
            this.border.top.getValue() +
            this.border.bottom.getValue() +
            this.padding.top.getValue() +
            this.padding.bottom.getValue() +
            this.contentHeight.getValue();
    }

    public setWidth(newWidth : UnitValue) {
        const parent = this.parent;
        const widthValue = this.contentWidth;
        const newUnit = newWidth.unit;
        widthValue.multiple = newWidth.multiple;
        widthValue.unit = newUnit;

        if((this.dirtyFlags & ContentBoxFlag.Dirty) === 0) {
            ContentBox.dirtyContentBoxes.push(this);
            this.dirtyFlags |= ContentBoxFlag.WidthDirty;
        }

        if (parent !== null && parent.contentWidth.unit === UnitType.Content) {
            if ((newUnit & UnitType.Relative) !== 0) {
                parent.updateParentContentWidth();
                return;
            }
        }

        switch (newUnit) {
            case UnitType.Pixel:
                widthValue.referenceValue = 1.0;
                break;
            case UnitType.Percent:
            case UnitType.ParentContent:
                widthValue.referenceValue = parent.contentWidth.getValue();
                break;
            case UnitType.Content:
                this.updateParentContentWidth();
                return; //note!
        }

        this.updateRelativeChildWidth();

    }

    public setHeight(newHeight : UnitValue) {
        const heightValue = this.contentHeight;
        const parent = this.parent;
        const newUnit = newHeight.unit;

        heightValue.multiple = newHeight.multiple;
        heightValue.unit = newUnit;


        if((this.dirtyFlags & ContentBoxFlag.Dirty) === 0) {
            ContentBox.dirtyContentBoxes.push(this);
            this.dirtyFlags |= ContentBoxFlag.WidthDirty;
        }

        if (parent !== null && parent.contentHeight.unit === UnitType.Content) {
            if ((newUnit & UnitType.Relative) !== 0) {
                parent.updateParentContentHeight();
                return;
            }
        }

        switch (newUnit) {
            case UnitType.Pixel:
                heightValue.referenceValue = 1.0;
                break;
            case UnitType.Percent:
            case UnitType.ParentContent:
                heightValue.referenceValue = parent.getHeight();
                break;
            case UnitType.Content:
                this.updateParentContentHeight();
                return; //note!
        }

        this.updateRelativeChildHeight();
    }

    public setSize(newWidth : UnitValue, newHeight : UnitValue) {
        this.setWidth(newWidth);
        this.setHeight(newHeight);
    }

    protected updateParentContentWidth() : void {

        if (this.parent === null) return;

        const widthValue = this.contentWidth;
        const parent = this.parent;
        const children = this.children;

        if (widthValue.unit !== UnitType.Content) {
            return;
        }
        var maxX = 0.0;
        //find max x of children
        for (var i = 0; i < children.length; i++) {
            const child = children[i];
            if ((child.contentWidth.unit & UnitType.Relative) === 0) {
                var x = child.transform.localPosition.x + child.getWidth();
                if (maxX < x) maxX = x;
            }
        }

        widthValue.referenceValue = Math.max(0, maxX);
        if((this.dirtyFlags & ContentBoxFlag.Dirty) === 0) {
            ContentBox.dirtyContentBoxes.push(this);
            this.dirtyFlags |= ContentBoxFlag.WidthDirty;
        }

        //if any children are relative, update them to reflect new parent size
        for (i = 0; i < children.length; i++) {
            const child = children[i];
            if ((child.contentWidth.unit & UnitType.Relative) !== 0) {
                child.updateRelativeChildWidth();
            }
        }

        //if parent is sized by content, update it with new value
        //should not need to worry about infinite recursion because
        //we only process relative children
        if (parent.contentWidth.unit === UnitType.Content) {
            parent.updateParentContentWidth();
        }

    }

    protected updateParentContentHeight() : void {
        const heightValue = this.contentHeight;
        const children = this.children;
        const parent = this.parent;

        if (heightValue.unit !== UnitType.Content) {
            return;
        }

        var maxY = 0.0;

        //find max y of children
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if ((child.contentHeight.unit & UnitType.Relative) === 0) {
                //may need to adjust for layout transform
                const y = child.transform.localPosition.y + child.getHeight();
                if (maxY < y) maxY = y;
            }
        }

        heightValue.referenceValue = Math.max(0, maxY);
        this.dirtyFlags |= ContentBoxFlag.HeightDirty;

        //if any children are relative, update them to reflect new parent size
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if ((child.contentHeight.unit & UnitType.Relative) !== 0) {
                child.updateRelativeChildHeight();
            }
        }

        //if parent is sized by content, update it with new value
        //should not need to worry about infinite recursion because
        //we only process relative children
        if (parent !== null && parent.contentHeight.unit === UnitType.Content) {
            parent.updateParentContentHeight();
        }
    }

    protected updateRelativeChildWidth() : void {
        const queue = ScratchQueue;
        queue.enqueue(this);
        while (queue.count > 0) {
            const contentBox = queue.dequeue();
            const childList = contentBox.children;
            const parentWidth = contentBox.getWidth();
            for (var i = 0; i < childList.length; i++) {
                var child = childList[i];
                if ((child.contentWidth.unit & UnitType.Relative) !== 0) {
                    queue.enqueue(child);
                    child.contentWidth.referenceValue = parentWidth;
                    if((child.dirtyFlags & ContentBoxFlag.Dirty) === 0) {
                        ContentBox.dirtyContentBoxes.push(child);
                        child.dirtyFlags |= ContentBoxFlag.WidthDirty;
                    }
                }
            }
        }
    }

    protected updateRelativeChildHeight() : void {
        const queue = ScratchQueue;
        queue.enqueue(this);
        while (queue.count > 0) {
            const contentBox = queue.dequeue();
            const childList = contentBox.children;
            const parentHeight = contentBox.getHeight();
            for (var i = 0; i < childList.length; i++) {
                const child = childList[i];
                if ((child.contentHeight.unit & UnitType.Relative) !== 0) {
                    queue.enqueue(child);
                    child.contentHeight.referenceValue = parentHeight;
                    if((child.dirtyFlags & ContentBoxFlag.Dirty) === 0) {
                        ContentBox.dirtyContentBoxes.push(child);
                        child.dirtyFlags |= ContentBoxFlag.HeightDirty;
                    }
                }
            }
        }
    }

    static dirtyContentBoxes : Array<ContentBox> = [];

    static FlushDirtyContentBoxes() : Array<ContentBox> {
        const dirtyContentBoxes = ContentBox.dirtyContentBoxes;
        const retn = new Array<ContentBox>(dirtyContentBoxes.length);
        for (var i = 0; i < dirtyContentBoxes.length; i++) {
            dirtyContentBoxes[i].dirtyFlags = 0;
            retn[i] = dirtyContentBoxes[i];
        }
        ContentBox.dirtyContentBoxes.length = 0;
        return retn;
    }
}