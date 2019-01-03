'use strict';

const isType = type => value => typeof value == type;
const isEmpty = () => value => value === '';

module.exports = function(args) {
  let terminal = true;
  let inverted = false;
  const tests = [];

  function target() {
    throw new Error('Never gets called!');
  }

  const handler = {
    apply: function (target, thisArg, argumentsList) {
      console.log(`apply(${terminal})`);
      if (!terminal) {
        terminal = true;
        return new Proxy(target, handler);
      }
      Object.entries(args).forEach(([key, value]) => {
        tests.forEach(({ test, prop, success }) => {
          if (test(value) !== success) {
            throw new Error(`Invalid Value: '${key}' expected ${success ? 'is' : 'is not'} ${prop}.`);
          }
        });
      });
    },
    get: function (target, prop, receiver) {
      console.log('get', prop);
      switch(prop) {
        case 'is':
          break;
        case 'not':
          inverted = !inverted;
          break;
        case 'includes':
        case 'empty':
          tests.push({ test: isEmpty(), prop, success: !inverted });
          inverted = false;
          break;
        case 'defined':
          tests.push({ test: isType('undefined'), prop, success: inverted });
          inverted = false;
          break;
        case 'undefined':
        case 'string':
        case 'number':
        case 'date':
        case 'boolean':
          tests.push({ test: isType(prop), prop, success: !inverted });
          inverted = false;
          break;
        case 'lt':
        case 'gt':
        case 'lte':
        case 'gte':
        case 'eq':
        case 'neq':
          terminal = false;
          break;
        default:
          throw new Error(`Unknown property ${prop}`);
      }
      return new Proxy(target, handler);
    },
  };

  return new Proxy(target, handler);
}
