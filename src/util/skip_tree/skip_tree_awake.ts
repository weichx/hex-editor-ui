// import {IPoolable1} from "../pool";
// import {Entity} from "../../runtime/entity";
// import {Component, ComponentFlag} from "../../runtime/component";
// import {SkipTreeNode} from "./skip_tree_node2";
// import {LinkedList} from "../linked_list";
// import {SkipTree} from "../skip_tree2";
//
// export class AwakeSkipNode implements IPoolable1<Entity> {
//
//     public readonly children : LinkedList<SkipTreeNode>;
//     public entity : Entity;
//
//     private readonly components : LinkedList<Component>;
//
//     constructor() {
//         this.entity = null;
//         this.components = new LinkedList<Component>();
//         this.children = new LinkedList<SkipTreeNode>();
//     }
//
//     public traverse(nextTree : SkipTree) : void {
//         var ptr = this.components.getHeadNode();
//         var entity = this.entity;
//
//         while(ptr !== null) {
//             var next = ptr.next;
//             var component = ptr.element;
//
//             if(!entity.getActive()) break;
//
//             component.awake();
//
//             ptr.remove(); //todo -- despawn ptr
//
//             nextTree.addComponent(component, true);
//
//             ptr = next;
//         }
//
//         this.traverseChildren();
//         //if no components left, move to parent and nuke self
//     }
//
//     protected traverseChildren() : void {
//         var ptr = this.children.getHeadNode();
//
//         while (ptr !== null) {
//             var node = ptr.element;
//             var next = ptr.next;
//             node.traverse(0);
//             ptr = next;
//         }
//     }
//
//     public add(component : Component) : void {
//         if(__inline_isBitSet(component.flags, ComponentFlag.Awake)) return;
//         this.components.push(component);
//     }
//
//     public onSpawn(entity : Entity) : void {
//         this.entity = entity;
//     }
//
//     public onDespawn() : void {}
//
// }
