const uuid = require('uuid/v4');
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
    it('should add', () => {
      const id = uuid();
      const name = 'Brie';
      const description = 'DescriptionBrie is a soft cow\'s-milk cheese named after Brie, the French region from which it originated. It is pale in color with a slight grayish tinge under a rind of white mould. The rind is typically eaten, with its flavor depending largely upon the ingredients used and its manufacturing environment.';
      const date = new Date();
      const subject = new Cheese({ id });

      subject.add({ name, description, date });

      expect(subject.toJSON()).toEqual({
        id,
        name,
        description,
        valid: {
          from: date,
          to: null,
        },
      });
    });
  });

  describe('Remove', () => {
    it('should remove', () => {
      const from = new Date('2010-01-01');
      const to = new Date('2010-02-02')
      const subject = new Cheese()
        .add({ name: 'name', description: 'desc', date: from });

      subject.remove({ date: to });

      expect(subject.getValid()).toEqual({
        from,
        to,
      })
    });
  });

});
