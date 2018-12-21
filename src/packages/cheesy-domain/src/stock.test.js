const uuid = require('uuid/v4');
const { CheeseProduced } = require('cheesy-messages');
const Cheese = require('./cheese');
const Stock = require('./stock');

describe('Stock', () => {

  describe('Construct', () => {
    it('should construct', () => {
      const id = uuid();
      const subject = new Stock({ id });
      expect(subject).toBeDefined();
      expect(subject.toJSON()).toEqual({
        id,
        nextLineId: 1,
        lines: [],
      });
    });
  });

  describe('Produce', () => {
    const testCases = [
      { uom: 'g', measure: 250, quantity: 5, date: new Date('2001-01-01'), expiresOn: new Date('2001-01-29') },
      { uom: 'kg', measure: 0.5, quantity: 3, date: new Date('2020-03-04'), expiresOn: new Date('2020-04-01') },
    ];
    testCases.forEach(({ uom, quantity, measure, date, expiresOn }) => {
      it(`should produce ${quantity} x ${measure}${uom}`, () => {
        const cheese = new Cheese()
          .add({ name: 'Cheese', description: 'Cheesey', lifespan: 28 });

        const id = uuid();
        const subject = new Stock({ id });
        subject.produce({ cheese, uom, quantity, measure, date });

        expect(subject).toBeDefined();
        expect(subject.toJSON()).toEqual({
          id,
          nextLineId: 2,
          lines: [
            {
              id: 1,
              cheese: cheese.getReference(),
              uom,
              measure,
              quantity,
              expiresOn,
            }
          ]
        });
        expect(subject.getUnpublishedEvents()).toEqual([
          {
            event: CheeseProduced,
            id,
            lineId: 1,
            cheese: cheese.getReference(),
            uom,
            measure,
            quantity,
            date,
            expiresOn,
          }
        ]);
      });
    });
  });

  describe('Destroy', () => {

  });

});
