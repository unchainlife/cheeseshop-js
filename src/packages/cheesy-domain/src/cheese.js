const uuid = require('uuid/v4');
const { fromJS, Map } = require('immutable');

const ID = 'id';
const NAME = 'name';
const DESCRIPTION = 'description';
const VALID = 'valid';
const FROM = 'from';
const TO = 'to';

function Cheese({ id = uuid() } = {}) {

  // State -----------------------------------------------------------------------------------------

  let _state = fromJS({
    [ID]: id,
    [NAME]: '',
    [DESCRIPTION]: '',
    [VALID]: {
      [FROM]: null,
      [TO]: null,
    },
  });

  this.getState = () => _state;
  this.toJSON = () => _state.toJS();

  // Properties ------------------------------------------------------------------------------------

  this.getId = () => _state.get(ID);
  this.getName = () => _state.get(NAME);
  this.getDescription = () => _state.get(DESCRIPTION);
  this.getValid = () => _state.get(VALID).toJSON();

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
  this.add = ({ name, description, date = new Date() } = {}) => {
    // param validation
    if (typeof name !== 'string' || name.length === 0) throw new Error('Invalid Argument: name');
    if (typeof description !== 'string' || description.length === 0) throw new Error('Invalid Argument: name');
    // operation validation
    if (_state.getIn([VALID, FROM]) !== null)
      throw new Error('Cheese already added');

    // execution
    _state = _state.merge({
      [NAME]: name,
      [DESCRIPTION]: description,
      [VALID]: Map({
        [FROM]: date,
        [TO]: null,
      }),
    });

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

    return this;
  };
}

module.exports = Cheese;
