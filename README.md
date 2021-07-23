# demo-pretty-printer

This is a demo for [a blog post about pretty printers][blog-post] I wrote on [my blog][my-blog].

:warning: the Wadler's algorithm is fully implemented but the language-specific layers are
only partially implemented, i.e. not all JS or XML syntaxes are supported. This is a _demo_
project, not something you should be using in production.

## Quick start

Install the project's dependencies:

```
$ yarn
```

## Demos!

### JavaScript

The default print width is `80` chars.

```js
$ node js
-------------------------------------------------------------------------------| <- 80 chars
function fooo(aaa, bbbb, ccc = {}) {
  if (1 < 3) {
    return 1;
  } else {
    return 2;
  }
}

// some comment on multiple lines, maybe. Lorem ipsum, they said. Ha. Ha.
const FOO = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const BAR = 123;

const SOME = 456;

function f() {
  let v = 1;

  if (1 < 3) {
    return 1;
  }

  return 2;
}

const foo = () => {};
const foo2 = (a, b, ccc, dddd) => {};
```

```js
$ node js 50
-------------------------------------------------| <- 50 chars
function fooo(aaa, bbbb, ccc = {}) {
  if (1 < 3) {
    return 1;
  } else {
    return 2;
  }
}

// some comment on multiple lines, maybe. Lorem ipsum,
// they said. Ha. Ha.
const FOO = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13
];
const BAR = 123;

const SOME = 456;

function f() {
  let v = 1;

  if (1 < 3) {
    return 1;
  }

  return 2;
}

const foo = () => {};
const foo2 = (a, b, ccc, dddd) => {};
```

```js
$ node js 30
-----------------------------| <- 30 chars
function fooo(
  aaa,
  bbbb,
  ccc = {}
) {
  if (1 < 3) {
    return 1;
  } else {
    return 2;
  }
}

// some comment on multiple lines,
// maybe. Lorem ipsum, they said.
// Ha. Ha.
const FOO = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13
];
const BAR = 123;

const SOME = 456;

function f() {
  let v = 1;

  if (1 < 3) {
    return 1;
  }

  return 2;
}

const foo = () => {};
const foo2 = (
  a,
  b,
  ccc,
  dddd
) => {};
```

## XML

The default print width is `80` chars.

```xml
$ node xml
-------------------------------------------------------------------------------| <- 80 chars
<breakfast_menu id="aaaaaaaaaaaaaaaa" id2="bbbbbbbb">
  <food>
    <name>Belgian Waffles</name>
    <price>$5.95</price>
    <description>
      Two of our famous Belgian Waffles with plenty of real maple syrup
    </description>
    <calories>650</calories>
  </food>
  <food>
    <name>Strawberry Belgian Waffles</name>
    <price>$7.95</price>
    <description>
      Light Belgian waffles covered with strawberries and whipped cream
    </description>
    <calories>900</calories>
  </food>
  <food>
    <name>Berry-Berry Belgian Waffles</name>
    <price>$8.95</price>
    <description>
      Light Belgian waffles covered with an assortment of fresh berries and whipped
      cream
    </description>
    <calories>900</calories>
  </food>
  <food>
    <name>French Toast</name>
    <price>$4.50</price>
    <description>
      Thick slices made from our homemade sourdough bread
    </description>
    <calories>600</calories>
  </food>
  <food>
    <name>Homestyle Breakfast</name>
    <price>$6.95</price>
    <description>
      Two eggs, bacon or sausage, toast, and our ever-popular hash browns
    </description>
    <calories>950</calories>
  </food>
</breakfast_menu>
```

```xml
$ node xml 50
-------------------------------------------------| <- 50 chars
<breakfast_menu
  id="aaaaaaaaaaaaaaaa"
  id2="bbbbbbbb"
>
  <food>
    <name>Belgian Waffles</name>
    <price>$5.95</price>
    <description>
      Two of our famous Belgian Waffles with plenty
      of real maple syrup
    </description>
    <calories>650</calories>
  </food>
  <food>
    <name>Strawberry Belgian Waffles</name>
    <price>$7.95</price>
    <description>
      Light Belgian waffles covered with strawberries
      and whipped cream
    </description>
    <calories>900</calories>
  </food>
  <food>
    <name>Berry-Berry Belgian Waffles</name>
    <price>$8.95</price>
    <description>
      Light Belgian waffles covered with an assortment
      of fresh berries and whipped cream
    </description>
    <calories>900</calories>
  </food>
  <food>
    <name>French Toast</name>
    <price>$4.50</price>
    <description>
      Thick slices made from our homemade sourdough
      bread
    </description>
    <calories>600</calories>
  </food>
  <food>
    <name>Homestyle Breakfast</name>
    <price>$6.95</price>
    <description>
      Two eggs, bacon or sausage, toast, and our ever-popular
      hash browns
    </description>
    <calories>950</calories>
  </food>
</breakfast_menu>
```

```xml
$ node xml 120
-----------------------------------------------------------------------------------------------------------------------| <- 120 chars
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
```

## License

This project is released under the MIT License. See the bundled LICENSE file for details.

[my-blog]: https://williamdurand.fr/
[blog-post]: https://williamdurand.fr/2021/07/23/on-pretty-printers/
