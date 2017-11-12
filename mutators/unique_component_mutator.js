
module.exports = {
    //todo check base classes for this decorator as well
    //todo assert that we only have 1 ui element
    //todo assert that we actually extend a ui element
    test: function (classDeclaration, methodDeclaration, decorator) {
        return decorator.getText().indexOf("@unique") === 0;
    },

    mutate(context, classDeclaration, methodDeclaration, decorator) {
        context.removeNode(decorator);
        context.inject(classDeclaration, "protected static __isUnique = true;");
    }

};