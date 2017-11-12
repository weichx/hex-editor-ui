import {Vector3} from "../math/vector3";
import {Quaternion} from "../math/quaternion";
import {Matrix} from "../math/matrix4x4";
import {IVector2, Vector2} from "../math/vector2";
import {Space} from "../math/e_space";
import {Entity} from "./entity";
import {Queue} from "../util/queue";
import {UnitType, UnitValue} from "./unit";

export const enum TransformFlag {
    None = 0,
    RotationDirty = 1 << 0,
    TranslateDirty = 1 << 1,
    ScaleDirty = 1 << 2,
    WidthDirty = 1 << 3,
    HeightDirty = 1 << 4,
    TransformDirty = RotationDirty | TranslateDirty | ScaleDirty,
    DimensionDirty = WidthDirty | HeightDirty
}

const ScratchQueue = new Queue<Transform>(128);

export class Transform {

    public readonly position : Vector3;
    public readonly rotation : Quaternion;
    public readonly scale : Vector3;
    public readonly worldMatrix : Matrix;
    public readonly entity : Entity;

    public children : Array<Transform>;

    public parent : Transform;

   // public widthValue : UnitValue;
   // public heightValue : UnitValue;

    public flags : TransformFlag;
    protected layoutParent : Transform; //used for layout offset. if no layout component present then layoutparent === parent

    constructor(entity : Entity = null) {
        this.flags = TransformFlag.None;
        this.entity = entity;
        this.parent = null;
        this.layoutParent = null;
        this.children = [];

        if (this.entity !== null && this.entity.parent !== null) {
            this.parent = entity.parent.transform;
            this.layoutParent = this.parent;
        }

        this.position = new Vector3();
        this.rotation = new Quaternion(); //can possibly save on allocating this
        this.scale = new Vector3(1, 1, 1); //can possibly save on allocating this
        this.worldMatrix = new Matrix();
      //  this.widthValue = new UnitValue(10, UnitType.Pixel);
       // this.heightValue = new UnitValue(10, UnitType.Pixel);
    }

    // public set width(value : number) {
    //     this.setWidth(value, UnitType.Pixel);
    // }
    //
    // public get width() : number {
    //     return this.widthValue.getValue();
    // }
    //
    // public set height(value : number) {
    //     this.setHeight(value, UnitType.Pixel);
    // }
    //
    // public get height() : number {
    //     return this.heightValue.getValue();
    // }
    //
    // public getWidth() : number {
    //     return this.widthValue.getValue();
    // }

    // public setWidth(width : number, newUnit : UnitType = UnitType.Pixel) : void {
    //     this.flags |= TransformFlag.DimensionDirty;
    //     const widthValue = this.widthValue;
    //     const parent = this.parent;
    //     widthValue.multiple = width;
    //     widthValue.unit = newUnit;
    //     if (parent !== null && parent.widthValue.unit === UnitType.Content) {
    //         var newUnitIsRelative = (newUnit === UnitType.Percent) || (newUnit === UnitType.ParentContent);
    //         if (newUnitIsRelative) {
    //             parent.updateParentContentWidth();
    //             return;
    //         }
    //     }
    //
    //     switch (newUnit) {
    //         case UnitType.Pixel:
    //             widthValue.referenceValue = 1.0;
    //             break;
    //         case UnitType.Percent:
    //         case UnitType.ParentContent:
    //             widthValue.referenceValue = parent.getWidth();
    //             break;
    //         case UnitType.Content:
    //             this.updateParentContentWidth();
    //             return; //note!
    //     }
    //
    //     this.updateRelativeChildWidth();
    //     // if (!layoutTransform) {
    //     //     rect.sizeDelta = new Vector2(GetWidth(), rect.sizeDelta.y);
    //     // }
    // }
    //
    // public getHeight() : number {
    //     return this.heightValue.getValue();
    // }
    //
    // public setHeight(height : number, newUnit : UnitType = UnitType.Pixel) : void {
    //     this.flags |= TransformFlag.DimensionDirty;
    //     const heightValue = this.heightValue;
    //     const parent = this.parent;
    //
    //     heightValue.multiple = height;
    //     heightValue.unit = newUnit;
    //     if (parent !== null && parent.heightValue.unit === UnitType.Content) {
    //         if (newUnit === UnitType.Percent || newUnit === UnitType.ParentContent) {
    //             parent.updateParentContentHeight();
    //             return;
    //         }
    //     }
    //
    //     switch (newUnit) {
    //         case UnitType.Pixel:
    //             heightValue.referenceValue = 1.0;
    //             break;
    //         case UnitType.Percent:
    //         case UnitType.ParentContent:
    //             heightValue.referenceValue = parent.getHeight();
    //             break;
    //         case UnitType.Content:
    //             this.updateParentContentHeight();
    //             return; //note!
    //     }
    //
    //     this.updateRelativeChildHeight();
    //     // if (!layoutTransform) {
    //     //     rect.sizeDelta = new Vector2(rect.sizeDelta.x, GetHeight());
    //     // }
    // }
    //
    // public setSize(width : number, height : number, unit : UnitType = UnitType.Pixel) {
    //     this.setWidth(width, unit);
    //     this.setHeight(height, unit);
    // }

    public reset() : void {
        this.position.x = 0;
        this.position.y = 0;
        this.position.z = 0;
        this.scale.x = 1;
        this.scale.y = 1;
        this.scale.z = 1;
        this.rotation.x = 0;
        this.rotation.y = 0;
        this.rotation.z = 0;
        this.rotation.w = 1;
    }

    /** @internal*/
    public setParent(newParent : Transform) : void {
        const oldParent = this.parent;
        if(oldParent !== null) {
            oldParent.children.unstableRemove(this);
        }
        this.parent = newParent;
        if(newParent !== null) {
            newParent.children.push(this);
        }
       //  this.layoutParent.parent = this.parent.parent;
    }

    public getLayoutParent() : Transform {
        return this.layoutParent;
    }

    //todo -- do we need safety checks here?
    public setLayoutParent(transform : Transform) : void {
        if(transform === this || transform === null) {
            this.layoutParent = this.parent;
        }
        else if(transform !== this.parent) {
            this.layoutParent = transform;
            this.layoutParent.parent = this.parent;
        }
    }

    public get localPosition() : Vector2 {
        return this.position as any;
    }

    public set localPosition(vector3 : Vector2) {
        this.position.copy(vector3 as any);
    }

    public getLocalMatrix(out? : Matrix) : Matrix {
        return Matrix.Compose(this.scale, this.rotation, this.position, out || new Matrix());
    }

    public getUpdatedWorldMatrix(out? : Matrix) : Matrix {
        return this.updateWorldMatrix().clone(out);
    }

    public getWorldMatrix(out? : Matrix) {
        return this.worldMatrix.clone(out);
    }

    protected updateWorldMatrix() : Matrix {
        const localMatrix = Matrix.Compose(this.scale, this.rotation, this.position, this.worldMatrix);
        this.layoutParent.updateWorldMatrix();
        localMatrix.multiplyNew(this.layoutParent.worldMatrix, this.worldMatrix);
        return this.worldMatrix;
    }

    public pointToLocalSpace(point : IVector2, out : Vector2 = null) : Vector2 {
        this.layoutParent.getWorldMatrix(Matrix.scratch0).invert();
        const scratch = Vector3.scratch0.set(point.x, point.y, 0);
        Vector3.TransformCoordinates(scratch, Matrix.scratch0, scratch);
        if (out === null) {
            out = new Vector2();
        }
        out.x = scratch.x;
        out.y = scratch.y;
        return out;
    }

    public translate(translation : Vector2, relativeTo = Space.World) : this {
        return this.translateValues(translation.x, translation.y, relativeTo);
    }

    public translateValues(x : number, y : number, relativeTo = Space.World) : this {
        if (relativeTo === Space.World) {
            this.layoutParent.getWorldMatrix(Matrix.scratch0).invert();
            const scratch = Vector3.scratch0.set(x, y, 0);
            Vector3.TransformCoordinates(scratch, Matrix.scratch0, scratch);
            this.position.addValues(scratch.x, scratch.y, 0);
        }
        else {
            this.position.addValues(x, y, 0);
        }
        return this;
    }

    public setLocalPosition(position : IVector2) : this {
        return this.setLocalPositionValues(position.x, position.y);
    }

    public setWorldPosition(position : IVector2) : this {
        return this.setWorldPositionValues(position.x, position.y);
    }

    public getInverseWorldMatrix(out : Matrix) : Matrix {
        //if(this.worldMatrixDirty) this.updateWorldMatrix();
        return this.worldMatrix.invertNew(out);
    }

    public setLocalPositionValues(x : number, y : number) : this {
        this.position.x = x;
        this.position.y = y;
        Matrix.Compose(this.scale, this.rotation, this.position, this.worldMatrix);
        const children = this.children;
        const childCount = this.children.length;
        this.flags |= TransformFlag.TranslateDirty;
        for(var i = 0; i < childCount; i++) {
            const child = children[i];
            const childLocalMatrix = child.getLocalMatrix();
            childLocalMatrix.multiplyNew(this.worldMatrix, child.worldMatrix);
        }
        return this;
    }

    public setWorldPositionValues(x : number, y : number) : this {
        this.layoutParent.getInverseWorldMatrix(Matrix.scratch0);
        const scratch = Vector3.scratch0.set(x, y, 0);
        Vector3.TransformCoordinates(scratch, Matrix.scratch0, scratch);
        this.position.x = scratch.x;
        this.position.y = scratch.y;
        const localMatrix = Matrix.Compose(this.scale, this.rotation, this.position, this.worldMatrix);
        localMatrix.multiplyNew(this.layoutParent.worldMatrix, this.worldMatrix);
        this.flags |= TransformFlag.TranslateDirty;
        for(var i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            const childLocalMatrix = child.getLocalMatrix();
            childLocalMatrix.multiplyNew(this.worldMatrix, child.worldMatrix);
        }
        return this;
    }

    public setPositionValues(x : number, y : number, relativeTo = Space.World) : this {
        if (relativeTo === Space.World) {
            this.layoutParent.getWorldMatrix(Matrix.scratch0).invert();
            const scratch = Vector3.scratch0.set(x, y, 0);
            Vector3.TransformCoordinates(scratch, Matrix.scratch0, scratch);
            this.position.x = scratch.x;
            this.position.y = scratch.y;
        }
        else {
            this.position.set(x, y, 0);
        }
        return this;
    }

    public setRotation(radians : number) : this {
        Quaternion.RotationAxis(Vector3.Forward, radians, this.rotation);
        return this;
    }

    public getRotation() : number {
        return this.rotation.getRotationZ();
    }

    public rotate(radians : number) : this {
        Quaternion.RotationAxis(Vector3.Forward, radians, Quaternion.scratch0);
        this.rotation.multiply(Quaternion.scratch0);
        return this;
    }

    public setScale(scale : Vector2) : this {
        this.scale.x = scale.x;
        this.scale.y = scale.y;
        return this;
    }

    public setScaleValues(x : number, y : number) : this {
        this.scale.x = x;
        this.scale.y = y;
        return this;
    }

    public getScale(out? : Vector2) : Vector2 {
        return (out || new Vector2).copy(this.scale);
    }

    public getWorldPosition(out? : Vector2) : Vector2 {
        this.updateWorldMatrix();
        return (out || new Vector2()).set(this.worldMatrix.m[12], this.worldMatrix.m[13]);
    }

    public getLocalPosition(out? : Vector2) : Vector2 {
        return (out || new Vector2()).copy(this.position);
    }

    // protected updateParentContentWidth() : void {
    //
    //     if(this.parent === null) return;
    //
    //     const widthValue = this.widthValue;
    //     const parent = this.parent;
    //     const children = this.children;
    //
    //     if (widthValue.unit !== UnitType.Content) {
    //         return;
    //     }
    //     var maxX = 0.0;
    //     //find max x of children
    //     for (var i = 0; i < children.length; i++) {
    //         var child = children[i];
    //         var unit = child.widthValue.unit;
    //         if (unit !== UnitType.Percent && unit !== UnitType.ParentContent) {
    //             var x = child.localPosition.x + child.getWidth();
    //             if (maxX < x) maxX = x;
    //         }
    //     }
    //
    //     widthValue.referenceValue = Math.max(0, maxX);
    //     this.flags |= TransformFlag.DimensionDirty;
    //
    //     //if any children are relative, update them to reflect new parent size
    //     for (var i = 0; i < children.length; i++) {
    //         var child = children[i];
    //         var unit = child.widthValue.unit;
    //         if (unit === UnitType.Percent || unit === UnitType.ParentContent) {
    //             child.updateRelativeChildWidth();
    //         }
    //     }
    //
    //     //if parent is sized by content, update it with new value
    //     //should not need to worry about infinite recursion because
    //     //we only process relative children
    //     if (parent.widthValue.unit === UnitType.Content) {
    //         parent.updateParentContentWidth();
    //     }
    //
    // }
    //
    // protected updateParentContentHeight() : void {
    //     const heightValue = this.heightValue;
    //     const children = this.children;
    //     const parent = this.parent;
    //
    //     if (heightValue.unit !== UnitType.Content) {
    //         return;
    //     }
    //
    //     var maxY = 0.0;
    //
    //     //find max y of children
    //     for (var i = 0; i < children.length; i++) {
    //         var child = children[i];
    //         var unit = child.heightValue.unit;
    //         if (unit !== UnitType.Percent && unit !== UnitType.ParentContent) {
    //             //may need to adjust for layout transform
    //             var y = child.localPosition.y + child.getHeight();
    //             if (maxY < y) maxY = y;
    //         }
    //     }
    //
    //     heightValue.referenceValue = Math.max(0, maxY);
    //     this.flags |= TransformFlag.DimensionDirty;
    //
    //     //if any children are relative, update them to reflect new parent size
    //     for (var i = 0; i < children.length; i++) {
    //         var child = children[i];
    //         var unit = child.heightValue.unit;
    //         if (unit === UnitType.Percent || unit === UnitType.ParentContent) {
    //             child.updateRelativeChildHeight();
    //         }
    //     }
    //
    //     //if parent is sized by content, update it with new value
    //     //should not need to worry about infinite recursion because
    //     //we only process relative children
    //     if (parent !== null && parent.heightValue.unit === UnitType.Content) {
    //         parent.updateParentContentHeight();
    //     }
    // }
    //
    // protected updateRelativeChildWidth() : void {
    //     const queue = ScratchQueue;
    //     queue.clear();
    //     queue.enqueue(this);
    //     while (queue.count > 0) {
    //         const transform = queue.dequeue();
    //         const childList = transform.children;
    //         const parentWidth = transform.getWidth();
    //         for (var i = 0; i < childList.length; i++) {
    //             var child = childList[i];
    //             var unit = child.widthValue.unit;
    //             if (unit === UnitType.Percent || unit === UnitType.ParentContent) {
    //                 queue.enqueue(child);
    //                 child.widthValue.referenceValue = parentWidth;
    //                 child.flags |= TransformFlag.DimensionDirty;
    //                 // if (child.layoutTransform === null) {
    //                 //     child.rect.sizeDelta = new Vector2(parentWidth * child.widthValue.multiple, child.rect.sizeDelta.y);
    //                 // }
    //             }
    //         }
    //     }
    // }
    //
    // protected updateRelativeChildHeight() : void {
    //     const queue = ScratchQueue;
    //     queue.clear();
    //     queue.enqueue(this);
    //     while (queue.count > 0) {
    //         const transform = queue.dequeue();
    //         const childList = transform.children;
    //         const parentHeight = transform.getHeight();
    //         for (var i = 0; i < childList.length; i++) {
    //             const child = childList[i];
    //             const unit = child.heightValue.unit;
    //             if (unit === UnitType.Percent || unit === UnitType.ParentContent) {
    //                 queue.enqueue(child);
    //                 child.heightValue.referenceValue = parentHeight;
    //                 child.flags |= TransformFlag.DimensionDirty;
    //
    //                 // if (child.layoutTransform === null) {
    //                 //     child.rect.sizeDelta = new Vector2(child.rect.sizeDelta.x, parentHeight * child.heightValue.multiple);
    //                 // }
    //             }
    //         }
    //     }
    // }
}

export class RootTransform extends Transform {

    protected updateWorldMatrix() : Matrix {
        return Matrix.Compose(this.scale, this.rotation, this.position, this.worldMatrix);
    }

}