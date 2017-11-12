
module.exports = {
    test: function (classDeclaration, methodDeclaration, decorator) {
        return decorator.getText().indexOf("@requireComponent(") !== -1;
    },

    mutate(context, classDeclaration, methodDeclaration, decorator) {
        context.removeNode(decorator);
        //todo need a way to find generated methods
        // const componentType = decorator.expression.getChildAt(2).getText();
        // const editor = context.getMethodEditor(classDeclaration, "__requireComponents");
        // editor.addStatement("//require " + componentType);
    }

};