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

const findLastNode = (node) => {
  let last;
  let index = 1;

  do {
    last = node.body[node.body.length - index++];
  } while (last && last.type === "EmptyStatement");

  return last;
};

const isNextLineEmptyAfterIndex = (index, options) => {
  const { originalText } = options;

  let pos = index + 1;
  if ([";"].includes(originalText.charAt(index))) {
    pos++;
  }

  return originalText.charAt(pos) === "\n";
};

const makeDocument = (node, options) => {
  if (!node) {
    return "";
  }

  if (typeof node === "string") {
    return node;
  }

  const _makeDocument = (node) => makeDocument(node, options);

  switch (node.type) {
    case "ArrayExpression":
      return group([
        "[",
        nest(1, [
          SOFTLINE,
          intersperse([",", LINE], node.elements.map(_makeDocument)),
        ]),
        SOFTLINE,
        "]",
      ]);

    case "AssignmentPattern":
      return group([
        _makeDocument(node.left),
        " = ",
        _makeDocument(node.right),
      ]);

    case "BinaryExpression":
      return group([
        "(",
        _makeDocument(node.left),
        " ",
        node.operator,
        " ",
        _makeDocument(node.right),
        ")",
      ]);

    case "ExpressionStatement":
      return [_makeDocument(node.expression), ";"];

    case "ArrowFunctionExpression":
    case "FunctionDeclaration": {
      const parts = [];

      const params = intersperse([",", LINE], node.params.map(_makeDocument));
      const hasParams = params.length > 0;

      if (node.type === "ArrowFunctionExpression") {
        parts.push("(");

        if (hasParams) {
          parts.push(nest(1, [SOFTLINE, params]), SOFTLINE);
        }

        parts.push(")", " => ", "{");
      } else {
        parts.push("function ", group([_makeDocument(node.id), "("]));

        if (hasParams) {
          parts.push(nest(1, [SOFTLINE, params]), SOFTLINE);
        }

        parts.push(")", " ", "{");
      }

      if (node.body.body.length > 0) {
        parts.push(nest(1, [HARDLINE, _makeDocument(node.body)]), HARDLINE);
      }

      return group([...parts, "}"]);
    }

    case "Identifier":
      return [node.name];

    case "IfStatement":
      if (!node.alternate) {
        return [
          group(["if ", _makeDocument(node.test), " ", "{"]),
          nest(1, [HARDLINE, _makeDocument(node.consequent)]),
          HARDLINE,
          "}",
        ];
      }

      return [
        group(["if ", _makeDocument(node.test), " ", "{"]),
        nest(1, [HARDLINE, _makeDocument(node.consequent)]),
        HARDLINE,
        group(["}", " ", "else", " ", "{"]),
        nest(1, [HARDLINE, _makeDocument(node.alternate)]),
        HARDLINE,
        "}",
      ];

    case "Line":
      return [
        "// ",
        fill(reflow(node.value.trim(), flatChoice([HARDLINE, "// "], " "))),
        HARDLINE,
      ];

    case "Literal":
      return [node.raw.toLowerCase()];

    case "ObjectExpression":
      // TODO: fixme
      return ["{}"];

    case "BlockStatement":
    case "Program":
      const contents = [];
      const lastNode = findLastNode(node);

      node.body.forEach((aNode) => {
        if (aNode.type === "EmptyStatement") {
          return;
        }

        contents.push(_makeDocument(aNode));

        if (isNextLineEmptyAfterIndex(aNode.end, options)) {
          contents.push(HARDLINE);
        }

        if (aNode !== lastNode) {
          contents.push(HARDLINE);
        }
      });

      return contents;

    case "ReturnStatement": {
      const parts = ["return"];

      if (node.argument) {
        parts.push(" ", _makeDocument(node.argument));
      }

      return group([...parts, ";"]);
    }

    case "VariableDeclaration": {
      const declarations = node.declarations.map((declaration) => {
        return _makeDocument(declaration);
      });

      let values = [declarations[0]];
      if (declarations.length > 1) {
        const [first, ...others] = declarations;
        values = [first, others.map((dec) => [", ", dec])];
      }

      let comment = NIL;
      if (typeof node.comment !== "undefined") {
        comment = _makeDocument(node.comment);
      }

      return [comment, node.kind, " ", ...values, ";"];
    }

    case "VariableDeclarator":
      if (node.init) {
        switch (node.init.type) {
          case "ArrayExpression":
          case "ArrowFunctionExpression":
            return [
              _makeDocument(node.id),
              " = ",
              group([_makeDocument(node.init)]),
            ];

          default:
            return [
              _makeDocument(node.id),
              " =",
              nest(1, group([LINE, _makeDocument(node.init)])),
            ];
        }
      }

      return _makeDocument(node.id);

    default:
      throw new Error(`unsupported node "${node.type}"`);
  }
};

module.exports = { makeDocument };
