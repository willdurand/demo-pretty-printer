const { parse } = require("@xml-tools/parser");
const { buildAst } = require("@xml-tools/ast");

const makeAST = (code) => {
  const { cst, tokenVector } = parse(code);

  return buildAst(cst, tokenVector);
};

module.exports = { makeAST };
