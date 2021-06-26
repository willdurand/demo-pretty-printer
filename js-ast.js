const espree = require("espree");
const estraverse = require("estraverse");

const findComment = (node, comments) => {
  return comments.find((comment) => comment.end === node.start - 1);
};

const makeAST = (code) => {
  const program = espree.parse(code, {
    comment: true,
    ecmaVersion: 6,
  });

  const { comments } = program;

  return estraverse.replace(program, {
    enter(node) {
      const comment = findComment(node, comments);

      if (typeof comment !== "undefined") {
        node.comment = comment;

        return node;
      }
    },
  });
};

module.exports = { makeAST };
