const uuid = require('uuid/v4');
const { fromJS, Map, Record } = require('immutable');

const { CheeseAdded, CheeseRemoved } = require('cheesy-messages');

import Stock from './stock';

const ID = 'id';
const NAME = 'name';
const DESCRIPTION = 'description';
const VALID = 'valid';
const FROM = 'from';
const TO = 'to';
const LIFESPAN = 'lifespan';

const DateRange = new Record({ [FROM]: null, [TO]: null });

function Cheese({ id = uuid() } = {}) {

  // State -----------------------------------------------------------------------------------------

  let _state = Map({
    [ID]: id,
    [NAME]: '',
    [DESCRIPTION]: '',
    [LIFESPAN]: 0,
    [VALID]: new DateRange(),
  });

  this.getState = () => _state;
  this.toJSON = () => _state.toJS();

  // Events ----------------------------------------------------------------------------------------

  let _unpublishedEvents = [];

  this.getUnpublishedEvents = () => _unpublishedEvents.slice();
  this.clearUnpublishedEvents = () => {
    _unpublishedEvents = [];
    return this;
  };
  function raise(event, args) {
    _unpublishedEvents.push({
      event,
      id: _state.get(ID),
      ...args,
    })
  }

  // Properties ------------------------------------------------------------------------------------

  this.getId = () => _state.get(ID);
  this.getName = () => _state.get(NAME);
  this.getReference = () => ({
    [ID]: this.getId(),
    [NAME]: this.getName(),
  });
  this.getDescription = () => _state.get(DESCRIPTION);
  this.getValid = () => _state.get(VALID).toJSON();
  this.getLifeSpan = () => _state.get(LIFESPAN);

  // Methods ---------------------------------------------------------------------------------------

  /**
   * Add the cheese to the catalogue
   *
   * @param {string} name
   * @param {string} description
   * @param {Date} date
   *
   * @returns {this}
   */

  this.add = ({ name, description, lifespan, date = new Date() } = {}) => {
    // param validation
    if (typeof name !== 'string' || name.length === 0) throw new Error('Invalid Argument: name');
    if (typeof description !== 'string' || description.length === 0) throw new Error('Invalid Argument: name');
    if (typeof lifespan !== 'number' || lifespan <= 0) throw new Error('Invalid Argument: lifespan');
    // operation validation
    if (_state.getIn([VALID, FROM]) !== null)
      throw new Error('Cheese already added');

    // execution
    _state = _state.merge({
      [NAME]: name,
      [DESCRIPTION]: description,
      [LIFESPAN]: lifespan,
      [VALID]: Map({
        [FROM]: date,
        [TO]: null,
      }),
    });

    raise(CheeseAdded, { name, description, date });

    // return for fluent style
    return this;
  };

  /**
   * Remove the cheese from the catalogue
   *
   * @param {Date} date
   *
   * @returns {this}
   */

  this.remove = ({ date = new Date() }) => {
    const { from, to } = this.getValid();
    if (from === null) throw new Error('Cannot remove when not added');
    if (to !== null) throw new Error('Already removed');
    if (date < from) throw new Error('Invalid Argument: from');

    _state = _state.setIn([VALID, TO], date);

    raise(CheeseRemoved, { date });

    return this;
  };

}

module.exports = Cheese;
