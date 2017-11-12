import {Component} from "../runtime/component";
import {Entity} from "../runtime/entity";

type Callback<T> = (t : T, arg? : any) => any;

export class SkipTreeNode {

    public readonly children : Array<SkipTreeNode>;
    public readonly components : Array<Component>;
    public readonly entity : Entity;
    public readonly traverseFn : Callback<Component>;

    constructor(entity : Entity, traverseFn : Callback<Component>) {
        this.entity = entity;
        this.children = [];
        this.components = [];
        this.traverseFn = traverseFn;
    }

    public traverse(arg? : any) : boolean {
        const element = this.entity;
        if (!element.getActive()) {
            return true;
        }
        const components = this.components;
        const traverseFn = this.traverseFn;

        for (let i = 0; i < components.length; i++) {
            traverseFn(components[i], arg);
        }

        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i].traverse(arg)) {
                this.children.removeAt(--i);
            }
        }

        return this.components.length === 0;
    };

}

export class SkipTree {

    private nodeMap : Map<Entity, SkipTreeNode>;
    private rootNodes : Array<SkipTreeNode>;
    private traverseFn : Callback<Component>;

    constructor(traverseFn : Callback<Component>) {
        this.traverseFn = traverseFn;
        this.nodeMap = new Map<Entity, SkipTreeNode>();
        this.rootNodes = [];
    }

    public traverseFromNode(entity : Entity, arg? : any) {
        var node = this.nodeMap.get(entity) || this.findParent(entity);
        if(!node) return;
        this.traverseStep(node, arg)
    }

    public traverse(arg? : any) : void {
        for(let i = 0; i < this.rootNodes.length; i++) {
            if(this.traverseStep(this.rootNodes[i], arg)) {
                this.rootNodes.removeAt(i--);
            }
        }
    }

    private traverseStep(node : SkipTreeNode, arg? : any) : boolean {
        const element = node.entity;

        if (!element.getActive()) {
            return true;
        }

        const children = node.children;
        const components = node.components;
        const traverseFn = this.traverseFn;

        for (let i = 0; i < components.length; i++) {
            traverseFn(components[i], arg);
        }

        for (let i = 0; i < children.length; i++) {
            if (children[i].traverse(arg)) {
                children.removeAt(--i);
            }
        }

        return components.length === 0;
    }

    public add<T extends Component>(component : T) {
        const entity = component.entity;
        let currentNode = this.nodeMap.get(entity);
        if(currentNode) {
            currentNode.components.push(component);
            return;
        }
        currentNode = new SkipTreeNode(entity, this.traverseFn);
        currentNode.components.push(component);
        this.insert(currentNode);
    }

    public remove(component : Component) : void {
        let node = this.nodeMap.get(component.entity);
        if(node === void 0) return;
        this.nodeMap.delete(component.entity);

        if(this.rootNodes.remove(node)) {
            for(let i = 0; i < node.children.length; i++) {
                this.rootNodes.push(node.children[i]);
            }
            return;
        }

        const parentNode = this.nodeMap.get(component.entity.parent);
        if(parentNode === void 0) return;

        parentNode.children.remove(node);

        for(let i = 0; i < node.children.length; i++) {
            parentNode.children.push(node.children[i]);
        }

    }

    public clear() {
        if(this.rootNodes.length === 0) return;
        for(let i = 0; i < this.rootNodes.length; i++) {
            this.rootNodes[i] = null;
        }
        this.nodeMap.clear();
        this.rootNodes.length = 0;
    }

    private insert(treeNode : SkipTreeNode) : void {
        this.nodeMap.set(treeNode.entity, treeNode);
        const parentTreeNode = this.findParent(treeNode.entity);
        if(!parentTreeNode) return this.insertAtRoot(treeNode);
        for(let i = 0; i < parentTreeNode.children.length; i++) {
            const childNode = parentTreeNode.children[i];
            if(childNode.entity.isDescendantOf(treeNode.entity)) {
                treeNode.children.push(childNode);
                parentTreeNode.children.removeAt(i);
            }
        }
        parentTreeNode.children.push(treeNode);
    }

    private insertAtRoot(treeNode : SkipTreeNode) : void {
        //if any root nodes should be children of this node, remove from root and push to new node
        for(let i = 0; i < this.rootNodes.length; i++) {
            const node = this.rootNodes[i];
            if(node.entity.isDescendantOf(treeNode.entity)) {
                treeNode.children.push(node);
                this.rootNodes.removeAt(i);
            }
        }
        this.rootNodes.push(treeNode);
    }

    private findParent(entity : Entity) : SkipTreeNode {
        let ptr = entity.parent;
        while (ptr) {
            const node = this.nodeMap.get(ptr);
            if (node) return node;
            ptr = ptr.parent;
        }
        return null;
    }

}