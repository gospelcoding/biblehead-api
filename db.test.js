const db = require("./db");
const { incrementCode } = db;

test("Increment Code", () => {
  expect(incrementCode("BBBB")).toBe("CBBB");
  expect(incrementCode("YBBB")).toBe("BCBB");
  expect(incrementCode("XYBB")).toBe("YYBB");
  expect(incrementCode("YYBB")).toBe("BBCB");
  expect(incrementCode("YYYY")).toBe("BBBBB");
});
