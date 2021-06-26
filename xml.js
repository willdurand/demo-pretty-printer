const { makeAST } = require("./xml-ast");
const { makeDocument } = require("./xml-printer");
const { renderDocument } = require("./document");

const xml = `
<breakfast_menu id="aaaaaaaaaaaaaaaa" id2="bbbbbbbb">
<food>
<name>Belgian Waffles</name>
<price>$5.95</price>
<description>Two of our famous Belgian Waffles with plenty of real maple syrup</description>
<calories>650</calories>
</food>
<food>
<name>Strawberry Belgian Waffles</name>
<price>$7.95</price>
<description>Light Belgian waffles covered with strawberries and whipped cream</description>
<calories>900</calories>
</food>
<food>
<name>Berry-Berry Belgian Waffles</name>
<price>$8.95</price>
<description>Light Belgian waffles covered with an assortment of fresh berries and whipped cream</description>
<calories>900</calories>
</food>
<food>
<name>French Toast</name>
<price>$4.50</price>
<description>Thick slices made from our homemade sourdough bread</description>
<calories>600</calories>
</food>
<food>
<name>Homestyle Breakfast</name>
<price>$6.95</price>
<description>Two eggs, bacon or sausage, toast, and our ever-popular hash browns</description>
<calories>950</calories>
</food>
</breakfast_menu>
`;

// Get the width from user, if provided.
const [userWidth] = process.argv.slice(2);
const width = userWidth || 80;
// Generate IR (which we call a document like most other projects).
const doc = makeDocument(makeAST(xml), { originalText: xml });
// Render the IR and print the pretty output on `stdout`.
process.stdout.write(`${"-".repeat(width - 1)}| <- ${width} chars\n`);
process.stdout.write(renderDocument(doc, { width }));
