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
