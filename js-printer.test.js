const { renderDocument } = require("./document");
const { makeAST } = require("./js-ast");
const { makeDocument } = require("./js-printer");

describe(__filename, () => {
  const render = (text, options) => {
    const doc = makeDocument(makeAST(text), { originalText: text });

    return renderDocument(doc, options);
  };

  it.each(["var", "let"])("formats a variable declaration with %s", (kind) => {
    const text = `${kind} someLongVar;`;

    expect(render(text, { width: 50 })).toMatchSnapshot();
    expect(render(text, { width: 10 })).toMatchSnapshot();
  });

  it("formats a variable assignement", () => {
    const text = "const value = 123456789;";

    expect(render(text, { width: 50 })).toMatchSnapshot();
    expect(render(text, { width: 10 })).toMatchSnapshot();
  });

  it("formats a variable assignement with a long array", () => {
    const text = "const value = [1,2,3,4,5,6,7,8,9];";

    expect(render(text, { width: 50 })).toMatchSnapshot();
    expect(render(text, { width: 10 })).toMatchSnapshot();
  });

  it("formats function declarations", () => {
    const text = "function func() {return;}";

    expect(render(text, { width: 50 })).toMatchSnapshot();
    expect(render(text, { width: 10 })).toMatchSnapshot();
  });

  it("formats function declarations with arguments", () => {
    const text = "function func(a, b, ccc) {return;}";

    expect(render(text, { width: 50 })).toMatchSnapshot();
    expect(render(text, { width: 10 })).toMatchSnapshot();
  });

  it("formats arrow functions", () => {
    const text = "const foo = () => {};";

    expect(render(text, { width: 50 })).toMatchSnapshot();
    expect(render(text, { width: 10 })).toMatchSnapshot();
  });

  it("formats arrow functions with arguments", () => {
    const text = "const foo = (a, bb, ccc) => {};";

    expect(render(text, { width: 50 })).toMatchSnapshot();
    expect(render(text, { width: 10 })).toMatchSnapshot();
  });
});
