module.exports = {
    //todo assert InputEvent is the real deal and not just a local
    test: function (classDeclaration, methodDeclaration, decorator) {
        return decorator.getText().indexOf("@AppEvent") !== -1;
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
        injectedMethod.addStatement(`AppEvent.addListener(${expression}, this, this.${methodName});\n`);

        const destroyMethod = context.getMethodEditor(classDeclaration, "onDestroy");
        if (destroyMethod.isCreating && !destroyMethod.didCall) {
            destroyMethod.addStatement("super.onDestroy();");
        }
        destroyMethod.didCall = true;
        destroyMethod.addStatement(`AppEvent.removeListener(${expression}, this, this.${methodName});\n`);
    }

};