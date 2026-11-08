const arraySelector = [
  'MethodDefinition[key.name!=on][key.name!=once][key.name!=off] > TSEmptyBodyFunctionExpression > Identifier :not(TSTypeOperator[operator=readonly]) > TSArrayType',
  'TSDeclareFunction > Identifier :not(TSTypeOperator[operator=readonly]) > TSArrayType',
  'TSInterfaceDeclaration TSPropertySignature :not(TSTypeOperator[operator=readonly]) > TSArrayType',
].join(', ');

const collectionSelector = [
  'MethodDefinition > TSEmptyBodyFunctionExpression > Identifier TSTypeReference > Identifier[name=Collection]',
  'TSDeclareFunction > Identifier TSTypeReference > Identifier[name=Collection]',
  'TSInterfaceDeclaration TSPropertySignature TSTypeReference > Identifier[name=Collection]',
].join(', ');

export default {
  meta: { name: 'discordjs' },
  rules: {
    'require-strict': {
      create(context) {
        return {
          Program(node) {
            const firstStatement = node.body[0];
            if (firstStatement && firstStatement.directive !== 'use strict') {
              context.report({ node: firstStatement, message: "CommonJS source files must begin with 'use strict'" });
            }
          },
        };
      },
    },
    'named-exports': {
      create(context) {
        return {
          'AssignmentExpression[left.type=MemberExpression][left.computed=false][left.object.name=module][left.property.name=exports]'(
            node,
          ) {
            context.report({ node: node.left, message: 'Use named exports instead of module.exports' });
          },
        };
      },
    },
    'destructure-local-require': {
      create(context) {
        return {
          'VariableDeclarator[init.callee.name=require][init.arguments.length=1][init.arguments.0.value=/^\\./]:not([id.type=ObjectPattern])'(
            node,
          ) {
            context.report({ node: node.id, message: 'Use object destructuring when requiring local modules' });
          },
        };
      },
    },
    'readonly-arrays': {
      create(context) {
        return {
          [arraySelector](node) {
            context.report({ node, message: 'Array parameters and interface properties must be readonly' });
          },
        };
      },
    },
    'readonly-collections': {
      create(context) {
        return {
          [collectionSelector](node) {
            context.report({ node, message: 'Parameters and interface properties must use ReadonlyCollection' });
          },
        };
      },
    },
  },
};
