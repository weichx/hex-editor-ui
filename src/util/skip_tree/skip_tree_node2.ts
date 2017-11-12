import {Entity} from "../../runtime/entity";
import {LinkedList} from "../linked_list";
import {Component} from "../../runtime/component";

export class SkipTreeNode {

    public entity : Entity;
    public readonly components : LinkedList<Component>;
    public readonly children : LinkedList<SkipTreeNode>;

    constructor(entity : Entity) {
        this.entity = entity;
        this.components = new LinkedList<Component>();
        this.children = new LinkedList<SkipTreeNode>();
    }

}