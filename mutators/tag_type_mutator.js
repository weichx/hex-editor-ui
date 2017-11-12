
module.exports = {
    //todo assert that we only have 1 ui element
    //todo assert that we actually extend a ui element
    test: function (classDeclaration, methodDeclaration, decorator) {
        return decorator.getText().indexOf("@tagType(") !== -1;
    },

    mutate(context, classDeclaration, methodDeclaration, decorator) {
        context.removeNode(decorator);
        const tagTypeString = decorator.expression.getChildAt(2).getText();
        context.inject(classDeclaration, `protected static tagType = ${tagTypeString};`);
    }

};