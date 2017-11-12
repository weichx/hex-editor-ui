import {Stack} from "./stack";

interface ITreeNode {
    children : ITreeNode[];
}

export function stackTraverse(root : ITreeNode, fn : (child : ITreeNode) => any, stack : Stack<ITreeNode> = null) : void {
    if(stack === null) {
        stack = new Stack<ITreeNode>(32);
    }
    else {
        stack.clear();
    }

    for(let i = 0; i < root.children.length; i++) {
        stack.push(root.children[i]);
    }

    while(stack.count > 0) {
        var current = stack.pop();
        fn(current);
        for(var i = 0; i < current.children.length; i++) {
            stack.push(current.children[i]);
        }
    }

}