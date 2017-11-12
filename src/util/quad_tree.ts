import {Rectangle} from "../geometry/rectangle";
import {Vector2} from "../math/vector2";

export interface IBounded {
    bounds : Rectangle;
}

//todo convert to morton (z-curve) quad tree for faster performance
export class QuadTree<T extends IBounded> {

    private children : Array<T>;
    private upperLeft : QuadTree<T>;
    private upperRight : QuadTree<T>;
    private lowerLeft : QuadTree<T>;
    private lowerRight : QuadTree<T>;
    private bounds : Rectangle;

    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.bounds = new Rectangle(x, y, width, height);
        this.children = [];
        this.upperLeft = null;
        this.upperRight = null;
        this.lowerLeft = null;
        this.lowerRight = null;
    }

    public store(item : T) : void {
        //WARNING -- we are in stupid mode for now!
        this.children.push(item);
        // if (this.bounds.containsRectangle(item)) {
        //     this.insert(item);
        // }
        // else {
        //     this.children.push(item);
        //     if (this.children.length > QuadTree.MaxChildCount) {
        //         this.grow();
        //     }
        // }
    }

    //todo this could be more optimal
    public update(item : T) : void {
        item;
        //WARNING -- We are still in stupid mode!
    }

    //todo morton coded version makes this really fast, kinda slow right now
    public remove(item : T) : boolean {
        //WARNING -- Stupid Mode!
        return this.children.unstableRemove(item);
        // return (
        //     this.children.remove(item) ||
        //     (this.upperLeft && (
        //             this.upperLeft.remove(item) ||
        //             this.upperRight.remove(item) ||
        //             this.lowerLeft.remove(item) ||
        //             this.lowerRight.remove(item)
        //         )
        //     )
        // );
    }

    public queryPoint(point : Vector2, out? : Array<T>) : Array<T> {
        out = out || [];
        for(let i = 0; i < this.children.length; i++) {
            const bounds = this.children[i].bounds;
            if(bounds.containsPoint(point)) {
                out.push(this.children[i]);
            }
        }
        return out;
    }

    // public queryRectangle(rect : Rectangle, out? : Array<T>) : Array<T> {
    //     // out = out || [];
    //     //
    //     //
    //     // // if (this.bounds.containsRectangle(rect)) {
    //     // //     if (this.upperLeft) {
    //     // //         this.upperLeft.queryRectangle(rect, out);
    //     // //         this.upperRight.queryRectangle(rect, out);
    //     // //         this.lowerRight.queryRectangle(rect, out);
    //     // //         this.lowerLeft.queryRectangle(rect, out);
    //     // //     }
    //     // // }
    //     //
    //     // for(let i = 0; i < this.children.length; i++) {
    //     //     if(rect.containsOrIntersectsRectangle(this.children[i].bounds)) {
    //     //         out.push(this.children[i] as T);
    //     //     }
    //     // }
    //     //
    //     // return out.sort(depthSort);
    // }

    // public queryRectangleIntersection(rect : Rectangle, out? : Array<T>) : Array<T> {
    //     return [];
    // }
    //
    // public queryRectangleContainment(rect : Rectangle, out? : Array<T>) : Array<T> {
    //     return [];
    // }

    private insert(item : T) : void {
        //if we contain the item fully try to add it to a child
        if (this.upperLeft) {
            const itemBounds = item.bounds;
            if (this.upperLeft.bounds.containsRectangle(itemBounds)) {
                this.upperLeft.insert(item);
            }
            else if (this.upperRight.bounds.containsRectangle(itemBounds)) {
                this.upperRight.insert(item);
            }
            else if (this.lowerLeft.bounds.containsRectangle(itemBounds)) {
                this.lowerLeft.insert(item);
            }
            else if (this.lowerRight.bounds.containsRectangle(itemBounds)) {
                this.lowerRight.insert(item);
            }
            else {
                this.children.push(item);
            }
        }
        else {
            this.children.push(item);
            if (this.children.length > QuadTree.MaxChildCount) {
                this.grow();
            }
        }
    }

    private grow() : void {

        const x = this.bounds.x;
        const y = this.bounds.y;
        const halfWidth = this.bounds.width * 0.5;
        const halfHeight = this.bounds.height * 0.5;

        this.upperLeft = new QuadTree<T>(x, y, halfWidth, halfHeight);
        this.upperRight = new QuadTree<T>(x + halfWidth, y, halfWidth, halfHeight);
        this.lowerLeft = new QuadTree<T>(x, y + halfWidth, halfWidth, halfHeight);
        this.lowerRight = new QuadTree<T>(x + halfWidth, y + halfHeight, halfWidth, halfHeight);

        for (let i = 0; i < this.children.length; i++) {
            const item = this.children[i];
            const inserted = (
                this.upperLeft.insert(item) ||
                this.upperRight.insert(item) ||
                this.lowerRight.insert(item) ||
                this.lowerLeft.insert(item)
            );
            if (inserted) {
                this.children.removeAt(i);
                i--;
            }
        }

    }

    //number of children before we subdivide
    private static MaxChildCount = 10;

}