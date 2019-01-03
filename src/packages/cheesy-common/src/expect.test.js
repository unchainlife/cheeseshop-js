const Expect = require('./expect');

describe('Expect', () => {

  const testCases = [
    'foo',
    'xxxxx',
  ];
  test.each(testCases)('should work "%s".', value => {
    Expect({ value }).not.empty.string();
  });

});
