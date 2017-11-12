var Visitor = require("../node_modules/hex-compiler/src/visitor").Visitor;

var inlinedFunctions = {
    "isBitSet": function (typeArgs, ...args) {
        return `( (${args[0]} & (${args[1]}) ) === (${args[1]}))`;
    },
    "isBitUnset": function(typeArgs, ...args) {
        return `( ((${args[0]}) & (${args[1]})) === 0)`;
    },
    "getHigh16Bits": function (typeArgs, ...args) {
        return `(((${args[0]}) >> 16) & ( 1 << 16) - 1)`;
    },
    "getLow16Bits": function (typeArgs, ...args) {
        return `((${args[0]}) & 0xffff)`;
    },
    "setHigh16Bits": function (typeArgs, ...args) {
       return `((~0xffff0000 & (${args[0]})) | (((${args[1]} )<< 16))`;
    },
    "setLow16Bits": function (typeArgs, ...args) {
        return `((~0x0000ffff & (${args[0]})) | (${args[1]})))`;
    },
    "setBitConditionally": function (typeArgs, ...args) {
        return `( ((${args[0]}) & ~(${args[1]})) | (-(${args[2]})) & (${args[1]})) )`;
    },
    "cast": function (typeArgs, ...args) {
        return `( (${args[0]} as any) as ${typeArgs[0]}))`;
    }
};

class InlineVisitor extends Visitor {

    shouldVisitFile() {
        return true;
    }

    filter() {
        return true;
    }

    visit(node, context) {
        if(node.kind === context.ts.SyntaxKind.CallExpression) {
            var text = node.getText();
            var index = text.indexOf("__inline_");
            if(index !== -1) {
                var split = text.split("__inline_");
                var expression = split[1];
                var argStart = expression.indexOf("(") + 1;
                var argEnd = expression.lastIndexOf(")");
                var fnName = expression.substr(0, argStart - 1);
                var args = expression.substring(argStart, argEnd);
                args = args.split(",");
                args = args.map(a => a.trim());
                var typeArgs = [];
                if(node.typeArguments) {
                    typeArgs = node.typeArguments.map(t => t.getText());
                    fnName = fnName.substr(0, fnName.lastIndexOf("<"));
                }
                var fn = inlinedFunctions[fnName];
                if(!fn) {
                    // console.log("Cannot find inline function definition:", fnName);
                    return;
                }
                context.replace(node.getStart(), node.getEnd(), fn(typeArgs, ...args));
            }
        }
        else {
            context.ts.forEachChild(node, (childNode) => {
                this.visit(childNode, context);
            });
        }
    }

}

module.exports = new InlineVisitor();