function getInputEventType(evtString) {
    switch (evtString) {
        case "MouseDown":
            return "1 << 0 /*MouseDown*/";
        case "MouseUp":
            return "1 << 1 /*MouseUp*/";
        case "MouseMove":
            return "1 << 2 /*MouseMove*/";
        case "MouseHover":
            return "1 << 3 /*MouseHover*/";
        case "MouseEnter":
            return "1 << 4 /*MouseEnter*/";
        case "MouseExit":
            return "1 << 5 /*MouseExit*/";
        case "MouseUpdate":
            return "(1 << 2) | (1 << 3) /*MouseUpdate*/";


        case "KeyDown":
            return "1 << 6 /*KeyDown*/";
        case "KeyUp":
            return "1 << 7 /*KeyUp*/";
        case "KeyPress":
            return "1 << 8 /*KeyPress*/";

        case "DragStart":
            return "1 << 9 /*DragStart*/";
        case "DragEnd":
            return "1 << 10 /*DragEnd*/";
        case "DragMove":
            return "1 << 11 /*DragMove*/";
        case "DragHover":
            return "1 << 12 /*DragHover*/";
        case "DragEnter":
            return "1 << 13 /*DragEnter*/";
        case "DragExit":
            return "1 << 14 /*DragExit*/";
        case "DragDrop":
            return "1 << 15 /*DragDrop*/";
        case "DragCancel":
            return "1 << 16 /*DragCancel*/";
        case "DragUpdate":
            return "(1 << 11) | (1 << 12) /*DragUpdate*/";

        case "ScrollStart":
            return "(1 << 17) /*ScrollStart*/";
        case "ScrollUpdate":
            return "(1 << 18) /*ScrollUpdate*/";
        case "ScrollEnd":
            return "(1 << 19) /*ScrollEnd*/";
        case "Scroll":
            return "(1 << 17) | (1 << 18) | (1 << 19) /*Scroll*/";
    }
}

function getDragActionEventType(evtString) {
    switch (evtString) {
        case "DragActionEnd":
            return "1 << 10 /*DragEnd*/";
        case "DragActionMove":
            return "1 << 11 /*DragMove*/";
        case "DragActionHover":
            return "1 << 12 /*DragHover*/";
        case "DragActionEnter":
            return "1 << 13 /*DragEnter*/";
        case "DragActionExit":
            return "1 << 14 /*DragExit*/";
        case "DragActionDrop":
            return "1 << 15 /*DragDrop*/";
        case "DragActionCancel":
            return "1 << 16 /*DragCancel*/";
        case "DragActionUpdate":
            return "(1 << 11) | (1 << 12) /*DragUpdate*/";
    }
}

module.exports = {
    //todo assert InputEvent is the real deal and not just a local
    test: function (classDeclaration, methodDeclaration, decorator) {
        return decorator.getText().indexOf("@InputEvent.") !== -1;
    },

    mutate(context, classDeclaration, methodDeclaration, decorator) {
        context.removeNode(decorator);
        const injectedMethod = context.getMethodEditor(classDeclaration, "onCreate");
        if (injectedMethod.isCreating && !injectedMethod.didCall) {
            injectedMethod.addStatement("super.onCreate();");
        }
        injectedMethod.didCall = true;
        const methodName = context.getNodeName(methodDeclaration);
        const expression = decorator.expression.getChildAt(2).getText();
        const dragAction = decorator.expression.getChildAt(0).getText().split(".")[1];
        if (dragAction) {
            var eventType = getDragActionEventType(dragAction);
            injectedMethod.addStatement(`InputEvent.addDragActionListener(${expression}, ${eventType}, this, this.${methodName});\n`);

            const destroyMethod = context.getMethodEditor(classDeclaration, "destroy");
            if (destroyMethod.isCreating && !destroyMethod.didCall) {
                destroyMethod.addStatement("super.onDestroy();");
            }
            destroyMethod.didCall = true;
            destroyMethod.addStatement(`InputEvent.removeDragActionListener(${expression}, ${eventType}, this, this.${methodName});\n`);

        }
        else {
            eventType = getInputEventType(expression);
            injectedMethod.addStatement(`InputEvent.addListener(${eventType}, this, this.${methodName});\n`);
            const destroyMethod = context.getMethodEditor(classDeclaration, "onDestroy");
            if (destroyMethod.isCreating && !destroyMethod.didCall) {
                destroyMethod.addStatement("super.onDestroy();");
            }
            destroyMethod.didCall = true;
            destroyMethod.addStatement(`InputEvent.removeListener(${eventType}, this, this.${methodName});\n`);

        }
    }

};