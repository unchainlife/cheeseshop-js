const uuid = require('uuid/v4');
const { CheeseAdded, CheeseRemoved } = require('cheesy-messages');

const Cheese = require('./cheese');

describe('Cheese', () => {

  describe('Constructor', () => {

    it('should construct cheese', () => {
      const id = uuid();
      const subject = new Cheese({ id });
      expect(subject).toBeDefined();
      expect(subject.toJSON()).toEqual({
        id,
        name: '',
        description: '',
        valid: {
          from: null,
          to: null,
        },
      });
    });

  });

  describe('Add', () => {
    const testCases = [
      {
        name: 'Brie',
        description: 'Brie is a soft cow\'s-milk cheese named after Brie, the French region from which it originated. It is pale in color with a slight grayish tinge under a rind of white mould. The rind is typically eaten, with its flavor depending largely upon the ingredients used and its manufacturing environment.',
      }, {
        name: 'Camembert',
        description: 'Camembert is a moist, soft, creamy, surface-ripened cow\'s milk cheese. It was first made in the late 18th century at Camembert, Normandy, in northern France. It is similar to Brie, which is native to a different region of France.',
      }, {
        name: 'Cheddar',
        description: 'Cheddar cheese is a relatively hard, off-white, sometimes sharp-tasting, natural cheese. Originating in the English village of Cheddar in Somerset, cheeses of this style are produced beyond the region and in several countries around the world.',
      }
    ];
    testCases.forEach(({ name, description }) => {
      it(`should add ${name}`, () => {
        const id = uuid();
        const date = new Date();
        const subject = new Cheese({ id });
        const priorState = subject.toJSON();

        subject.add({ name, description, date });

        expect(subject.toJSON()).toEqual({
          ...priorState,
          name,
          description,
          valid: {
            from: date,
            to: null,
          },
        });

        expect(subject.getUnpublishedEvents()).toEqual([{
          event: CheeseAdded,
          id,
          name,
          description,
          date,
        }]);
      });
    });
  });

  describe('Remove', () => {
    it('should remove', () => {
      // arrange
      const id = uuid();
      const from = new Date('2010-01-01');
      const date = new Date('2010-02-02')
      const subject = new Cheese({ id })
        .add({ name: 'name', description: 'desc', date: from })
        .clearUnpublishedEvents();
      const priorState = subject.toJSON();

      // act
      subject.remove({ date });

      // assert
      expect(subject.toJSON()).toEqual({
        ...priorState,
        valid: { from, to: date },
      });
      expect(subject.getUnpublishedEvents()).toEqual([{
        event: CheeseRemoved,
        id, date,
      }]);
    });
  });

});
