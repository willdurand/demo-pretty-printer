const {
  LINE,
  fill,
  flatChoice,
  group,
  intersperse,
  nest,
  renderDocument,
} = require("./document");

describe(__filename, () => {
  describe("fill", () => {
    it("renders as many documents as possible on a single line", () => {
      expect(
        renderDocument(
          fill(
            intersperse(
              LINE,
              "Here is a paragraph of text that we will format to a desired width.".split(
                /\s+/
              )
            )
          ),
          { width: 20 }
        )
      ).toMatchSnapshot();

      expect(
        renderDocument(
          fill(
            intersperse(
              LINE,
              "Here is a paragraph of text that we will format to a desired width.".split(
                /\s+/
              )
            )
          ),
          { width: 10 }
        )
      ).toMatchSnapshot();
    });
  });

  describe("concat", () => {
    it("uses the array notation to concatenate documents", () => {
      expect(renderDocument([""])).toEqual("");
      expect(renderDocument(["foo"])).toEqual("foo");
      expect(renderDocument(["foo", "bar"])).toEqual("foobar");
    });
  });

  describe("nest", () => {
    it("increases the nesting after next new line", () => {
      expect(
        renderDocument(nest(1, group("foo", LINE, "bar")), {
          width: 6,
        })
      ).toMatchSnapshot();
    });
  });

  describe("flatChoice", () => {
    it("selects the broken document when it fits", () => {
      expect(
        renderDocument(group(flatChoice("broken", "flat")), {
          width: 5,
        })
      ).toEqual("flat");
    });

    it("selects the flat document when the broken document does not fit", () => {
      expect(
        renderDocument(group(flatChoice("broken", "flat")), {
          width: 3,
        })
      ).toEqual("broken");
    });
  });

  describe("misc.", () => {
    it("is compatible with the Prettier example", () => {
      const doc = group([
        "[",
        nest(1, [
          LINE,
          intersperse([",", LINE], ["1", "2", "3", "4", "5", "6", "7", "8"]),
        ]),
        LINE,
        "]",
      ]);

      expect(renderDocument(doc, { width: 10 })).toMatchSnapshot();
      expect(renderDocument(doc)).toMatchSnapshot();
    });
  });
});
