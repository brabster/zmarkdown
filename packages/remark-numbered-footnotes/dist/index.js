'use strict';

var visit = require('unist-util-visit');

function plugin() {
  return transformer;
}

function transformer(tree) {
  var footnotes = {};
  visit(tree, 'footnote', convert);

  visit(tree, 'footnoteDefinition', createIds(footnotes));

  visit(tree, 'footnoteReference', replaceIds(footnotes));
}

function convert(node, index, parent) {
  var id = autoId(node.position.start);
  var footnoteDefinition = {
    type: 'footnoteDefinition',
    identifier: id,
    children: node.children
  };
  var footnoteReference = {
    type: 'footnoteReference',
    identifier: id
  };
  parent.children.splice(index, 1, footnoteReference, footnoteDefinition);
}

function createIds(footnotes) {
  return function (node, index, parent) {
    var identifier = node.identifier;

    if (!footnotes.hasOwnProperty(identifier)) {
      footnotes[identifier] = Object.keys(footnotes).length + 1;
    }
    node.identifier = footnotes[identifier];
  };
}

function replaceIds(footnotes) {
  return function (node, index, parent) {
    var identifier = node.identifier;

    if (!footnotes.hasOwnProperty(identifier)) {
      footnotes[identifier] = Object.keys(footnotes).length + 1;
    }
    node.identifier = footnotes[identifier];
  };
}

function autoId(node) {
  var line = node.line,
      column = node.column,
      offset = node.offset;

  return 'l' + line + 'c' + column + 'o' + offset;
}

module.exports = plugin;