const {
  HARDLINE,
  LINE,
  NIL,
  SOFTLINE,
  fill,
  flatChoice,
  group,
  intersperse,
  nest,
  reflow,
} = require("./document");

const makeDocument = (node, options) => {
  if (!node) {
    return "";
  }

  if (typeof node === "string") {
    return node;
  }

  const _makeDocument = (node) => makeDocument(node, options);

  switch (node.type) {
    case "XMLAttribute":
      return [node.key, "=", '"', node.value, '"'];

    case "XMLDocument":
      return _makeDocument(node.rootElement);

    case "XMLElement":
      const parts = [];
      const attrs = node.attributes.map(_makeDocument);

      parts.push("<");
      parts.push(node.name);

      if (attrs.length > 0) {
        parts.push(nest(1, [LINE, intersperse(LINE, attrs)]), SOFTLINE);
      }

      parts.push(">");

      // We assume this node only contains textual content when there is no
      // sub-element.
      if (node.subElements.length === 0) {
        parts.push(
          nest(1, [SOFTLINE, node.textContents.map(_makeDocument)]),
          SOFTLINE
        );
      } else {
        parts.push(
          nest(1, [
            HARDLINE,
            intersperse(HARDLINE, node.subElements.map(_makeDocument)),
          ]),
          HARDLINE
        );
      }

      return group([...parts, `</${node.name}>`]);

    case "XMLTextContent":
      return fill(reflow(node.text));

    default:
      throw new Error(`unsupported node "${node.type}"`);
  }
};

module.exports = { makeDocument };
