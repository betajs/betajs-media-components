const QUnit = require("qunit");

QUnit.module('Player', () => {});

QUnit.done((report) => {
  const { failed, passed, runtime, total } = report;
  process.env.QUNIT_TOTAL = total;
  process.env.QUNIT_FAILED = failed;
  process.env.QUNIT_PASSED = passed;
  process.env.QUNIT_RUNTIME = runtime;
  console.log(`After all test passed: `,report);
  process.exit(failed);
});

module.exports = QUnit;
