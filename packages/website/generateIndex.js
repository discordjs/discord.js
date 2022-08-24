"use strict";
exports.__esModule = true;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var api_extractor_model_1 = require("@microsoft/api-extractor-model");
var tsdoc_1 = require("@microsoft/tsdoc");
var parse_server_1 = require("~/util/parse.server");
/**
 * Attempts to resolve the summary text for the given item.
 * @param item - The API item to resolve the summary text for.
 */
function tryResolveSummaryText(item) {
    if (!item.tsdocComment) {
        return null;
    }
    var summarySection = item.tsdocComment.summarySection;
    var retVal = '';
    // Recursively visit the nodes in the summary section.
    var visitTSDocNode = function (node) {
        switch (node.kind) {
            case tsdoc_1.DocNodeKind.CodeSpan:
                retVal += node.code;
            case tsdoc_1.DocNodeKind.PlainText:
                retVal += node.text;
                break;
            case tsdoc_1.DocNodeKind.Section:
            case tsdoc_1.DocNodeKind.Paragraph:
                return node.nodes.forEach(visitTSDocNode);
            default: // We'll ignore all other nodes.
                break;
        }
    };
    for (var _i = 0, _a = summarySection.nodes; _i < _a.length; _i++) {
        var node = _a[_i];
        visitTSDocNode(node);
    }
    if (retVal === '') {
        return null;
    }
    return retVal;
}
function visitNodes(model) {
    var members = [];
    for (var _i = 0, _a = model.members; _i < _a.length; _i++) {
        var member = _a[_i];
        if (!(member instanceof api_extractor_model_1.ApiDeclaredItem)) {
            continue;
        }
        if (api_extractor_model_1.ApiItemContainerMixin.isBaseClassOf(member)) {
            members.push.apply(members, visitNodes(member));
        }
        members.push({
            name: member.displayName,
            kind: member.kind,
            summary: tryResolveSummaryText(member),
            path: (0, parse_server_1.generatePath)(member.getHierarchy(), 'test')
        });
    }
    return members;
}
var packageNames = ['builders', 'voice', 'rest', 'ws', 'proxy', 'collection'];
var model = new api_extractor_model_1.ApiModel();
var dir = 'searchIndex';
if (!node_fs_1["default"].existsSync(dir)) {
    node_fs_1["default"].mkdirSync(dir);
}
var members = packageNames.reduce(function (acc, pkg) {
    model.loadPackage(node_path_1["default"].join('..', pkg, 'docs', 'docs.api.json'));
    return acc.concat(visitNodes(model.tryGetPackageByName(pkg).entryPoints[0]));
}, []);
node_fs_1["default"].writeFile(node_path_1["default"].join('searchIndex', 'doc-index.json'), JSON.stringify(members, undefined, 2), function (err) {
    if (err) {
        throw err;
    }
});
