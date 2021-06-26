const group = (...contents) => {
  return {
    type: "group",
    contents,
  };
};

const nest = (indent, contents) => {
  return {
    type: "nest",
    indent,
    contents,
  };
};

const flatChoice = (whenBroken, whenFlat) => {
  return {
    type: "flat-choice",
    whenBroken,
    whenFlat,
  };
};

const fill = (contents) => {
  return {
    type: "fill",
    contents,
  };
};

const intersperse = (separator, contents) => {
  if (contents.length === 0) {
    return [];
  }

  const [first, ...others] = contents;

  const retval = [first];
  for (const part of others) {
    retval.push(separator);
    retval.push(part);
  }

  return retval;
};

const NIL = "";
// Specify a line break that is always included in the output, no matter if the
// expression fits on one line or not.
const HARDLINE = { type: "hard-line" };
// Specify a line break. If an expression fits on one line, the line break will
// be replaced with a space. Line breaks always indent the next line with the
// current level of indentation.
const LINE = flatChoice(HARDLINE, " ");
// Specify a line break. The difference from LINE is that if the expression
// fits on one line, it will be replaced with nothing.
const SOFTLINE = flatChoice(HARDLINE, NIL);

// Inserts a separator instead of a whitespace in the given text. Default
// separator is `LINE`.
const reflow = (text, separator = LINE) => {
  return intersperse(separator, text.split(/\s+/));
};

// Renderer
const MODE_BREAK = "MODE_BREAK";
const MODE_FLAT = "MODE_FLAT";

const defaultFits = ({ maxWidth, triplestack }) => {
  let charsLeft = maxWidth;

  while (charsLeft >= 0) {
    if (triplestack.length === 0) {
      return true;
    }

    const [indent, mode, doc] = triplestack.pop();

    if (typeof doc === "string") {
      charsLeft -= doc.length;
    } else if (Array.isArray(doc)) {
      // concat
      [...doc].reverse().forEach((child) => {
        triplestack.push([indent, mode, child]);
      });
    } else {
      switch (doc.type) {
        case "flat-choice":
          triplestack.push([
            indent,
            mode,
            mode === MODE_FLAT ? doc.whenFlat : doc.whenBroken,
          ]);
          break;

        case "fill":
          [...doc.contents].reverse().forEach((child) => {
            triplestack.push([indent, mode, child]);
          });
          break;

        case "group":
          triplestack.push([indent, MODE_FLAT, doc.contents]);
          break;

        case "hard-line":
          return true;

        case "nest":
          triplestack.push([indent + doc.indent, mode, doc.contents]);
          break;
      }
    }
  }

  return false;
};

const DEFAULT_WIDTH = 80;
const DEFAULT_NEWLINE = "\n";
const DEFAULT_INDENT_PREFIX = "  "; // 2 spaces
const DEFAULT_FITS = defaultFits;

const renderDocument = (
  doc,
  {
    fits = DEFAULT_FITS,
    indentPrefix = DEFAULT_INDENT_PREFIX,
    newline = DEFAULT_NEWLINE,
    width = DEFAULT_WIDTH,
  } = {}
) => {
  const out = [];
  let outcol = 0;

  const triplestack = [[0, MODE_BREAK, doc]];

  while (triplestack.length > 0) {
    const [indent, mode, doc] = triplestack.pop();

    if (typeof doc === "string") {
      out.push(doc);
      outcol += doc.length;
    } else if (Array.isArray(doc)) {
      // concat
      [...doc].reverse().forEach((child) => {
        triplestack.push([indent, mode, child]);
      });
    } else {
      switch (doc.type) {
        case "flat-choice":
          triplestack.push([
            indent,
            mode,
            mode === MODE_FLAT ? doc.whenFlat : doc.whenBroken,
          ]);
          break;

        case "fill": {
          if (doc.contents.length === 0) {
            break;
          }

          const [content, whitespace] = doc.contents;

          const contentFlat = [indent, MODE_FLAT, content];
          const contentBreak = [indent, MODE_BREAK, content];

          const contentFits = fits({
            maxWidth: width - outcol,
            triplestack: [contentFlat],
          });

          if (doc.contents.length === 1) {
            if (contentFits) {
              triplestack.push(contentFlat);
            } else {
              triplestack.push(contentBreak);
            }

            break;
          }

          const whitespaceFlat = [indent, MODE_FLAT, whitespace];
          const whitespaceBreak = [indent, MODE_BREAK, whitespace];

          if (doc.contents.length === 2) {
            if (contentFits) {
              triplestack.push(whitespaceFlat);
              triplestack.push(contentFlat);
            } else {
              triplestack.push(whitespaceBreak);
              triplestack.push(contentBreak);
            }

            break;
          }

          doc.contents.splice(0, 2);
          const remaining = [indent, mode, fill(doc.contents)];
          const secondContent = remaining[0];

          const firstAndSecondContentFlat = [
            indent,
            MODE_FLAT,
            [content, whitespace, secondContent],
          ];

          const firstAndSecondContentFits = fits({
            maxWidth: width - outcol,
            triplestack: [firstAndSecondContentFlat],
          });

          if (firstAndSecondContentFits) {
            triplestack.push(remaining);
            triplestack.push(whitespaceFlat);
            triplestack.push(contentFlat);
          } else if (contentFits) {
            triplestack.push(remaining);
            triplestack.push(whitespaceBreak);
            triplestack.push(contentFlat);
          } else {
            triplestack.push(remaining);
            triplestack.push(whitespaceBreak);
            triplestack.push(contentBreak);
          }

          break;
        }

        case "group": {
          const newTriplestack = [...triplestack];
          newTriplestack.push([indent, MODE_FLAT, doc.contents]);

          if (fits({ maxWidth: width - outcol, triplestack: newTriplestack })) {
            triplestack.push([indent, MODE_FLAT, doc.contents]);
          } else {
            triplestack.push([indent, MODE_BREAK, doc.contents]);
          }
          break;
        }

        case "hard-line":
          const ind = indentPrefix.repeat(indent);
          out.push(newline + ind);
          outcol = ind.length;
          break;

        case "nest":
          triplestack.push([indent + doc.indent, mode, doc.contents]);
          break;
      }
    }
  }

  return out.join("");
};

module.exports = {
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
  renderDocument,
};
