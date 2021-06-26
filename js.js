const { makeAST } = require("./js-ast");
const { makeDocument } = require("./js-printer");
const { renderDocument } = require("./document");

const js = `
// some comment
function fooo(aaa, bbbb, ccc = {}) { if (1 < 3) { return 1; } else { return 2; } }

// some comment on multiple lines, maybe. Lorem ipsum, they said. Ha. Ha.
const FOO = [1,2,3,4,5,6,7,8,9,10,11,12,13];
const BAR = 123;

const SOME = 456;

function f()
{
  let v = 1;


  if (1 < 3) { return 1; }

  return 2;
};

const foo = () => {};
const foo2 = (a, b, ccc, dddd) => {};
`;

// Get the width from user, if provided.
const [userWidth] = process.argv.slice(2);
const width = userWidth || 80;
// Generate IR (which we call a document like most other projects).
const doc = makeDocument(makeAST(js), { originalText: js });
// Render the IR and print the pretty output on `stdout`.
process.stdout.write(`${"-".repeat(width - 1)}| <- ${width} chars\n`);
process.stdout.write(renderDocument(doc, { width }));
