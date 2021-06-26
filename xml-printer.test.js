const { parse } = require("@xml-tools/parser");
const { buildAst } = require("@xml-tools/ast");

const { renderDocument } = require("./document");
const { makeDocument } = require("./xml-printer");

describe(__filename, () => {
  const render = (xml, options) => {
    const { cst, tokenVector } = parse(xml);

    const doc = makeDocument(buildAst(cst, tokenVector), {
      originalText: xml,
    });

    return renderDocument(doc, options);
  };

  it("formats attributes", () => {
    const xml = '<node id="123" attr1="value1"></node>';

    expect(render(xml, { width: 50 })).toMatchSnapshot();
    expect(render(xml, { width: 10 })).toMatchSnapshot();
  });

  it("formats long content", () => {
    const xml = [
      "<node>Lorem ipsum dolor sit amet, consectetur adipiscing",
      "elit, sed do eiusmod tempor incididunt ut labore et dolore",
      "magna aliqua.</node>",
    ].join(" ");

    expect(render(xml, { width: 50 })).toMatchSnapshot();
    expect(render(xml, { width: 10 })).toMatchSnapshot();
  });
});
