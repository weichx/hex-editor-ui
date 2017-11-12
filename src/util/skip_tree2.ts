import {Component} from "../runtime/component";
import {Entity} from "../runtime/entity";
import {SkipTreeNode} from "./skip_tree/skip_tree_node2";
import {LinkedList} from "./linked_list";

export class SkipTree {

    public readonly rootNodes : LinkedList<SkipTreeNode>;
    private nodeMap : Map<Entity, SkipTreeNode>;

    constructor() {
        this.rootNodes = new LinkedList<SkipTreeNode>();
        this.nodeMap = new Map<Entity, SkipTreeNode>();
    }

    public addComponent(component : Component) : void {
        var node = this.getOrCreateNode(component.entity);
        node.components.addLast(component);
    }

    public removeComponent(component : Component) : void {
        var node = this.nodeMap.get(component.entity);
        if (node === void 0) {
            return;
        }
        node.components.remove(component);
        if (node.components.count === 0) {
            this.removeNode(node);
        }

    }

    public removeNode(node : SkipTreeNode) : void {
        node = this.nodeMap.get(node.entity);
        if (node === void 0) {
            return;
        }

        var ptr = node.children.getHeadNode();
        var newParent = this.findParent(node.entity);
        var targetList : LinkedList<SkipTreeNode> = null;
        if (newParent !== null) {
            targetList = newParent.children;
        }
        else {
            targetList = this.rootNodes;
        }
        targetList.remove(node);
        //todo find topmost parent with no components
        //remove everything else in the path
        while (ptr !== null) {
            targetList.addLast(ptr.element);
            ptr = ptr.next;
        }

        this.nodeMap.delete(node.entity);
    }

    private getOrCreateNode(entity : Entity) : SkipTreeNode {
        var node = this.nodeMap.get(entity);
        if (node !== void 0) return node;

        node = new SkipTreeNode(entity);
        this.nodeMap.set(entity, node);
        var parent = this.findParent(entity);

        if (parent !== null) {
            return this.insert(parent, node);
        }

        var ptr = this.rootNodes.getHeadNode();

        while (ptr !== null) {
            var next = ptr.next;
            var testEntity = ptr.element.entity;
            if (testEntity.isDescendantOf(entity)) {
                this.rootNodes.remove(ptr.element);
                node.children.addLast(ptr.element);
            }
            ptr = next;
        }
        this.rootNodes.addLast(node);

        return node;
    }

    public getNode(entity : Entity) : SkipTreeNode {
        const node = this.nodeMap.get(entity);
        return node !== void 0 ? node : null;
    }

    public getNextAncestor(entity : Entity) : Component {
        var node = this.nodeMap.get(entity);
        if(node === void 0) {
            node = this.findParent(entity);
        }
        return node !== null ? node.components.getFirst() : null;
    }

    private insert(parent : SkipTreeNode, treeNode : SkipTreeNode) : SkipTreeNode {
        var ptr = parent.children.getHeadNode();
        while (ptr !== null) {
            var next = ptr.next;
            var element = ptr.element;
            var entity = element.entity;
            if (entity.isDescendantOf(treeNode.entity)) {
                parent.children.remove(element);
                treeNode.children.addLast(element);
            }
            ptr = next;
        }
        parent.children.addLast(treeNode);
        return treeNode;
    }

    private findParent(entity : Entity) : SkipTreeNode {
        let ptr = entity.parent;
        while (ptr !== null) {
            const node = this.nodeMap.get(ptr);
            if (node !== void 0) return node;
            ptr = ptr.parent;
        }
        return null;
    }

}
