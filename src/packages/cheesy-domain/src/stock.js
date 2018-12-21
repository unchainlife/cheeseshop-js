const uuid = require('uuid/v4');
const { fromJS, Record, Map, List } = require('immutable');
const { CheeseProduced } = require('cheesy-messages');

const ID = 'id';
const NAME = 'name';
const LINES = 'lines';
const CHEESE = 'cheese';
const UOM = 'uom';
const MEASURE = 'measure';
const QUANTITY = 'quantity';
const EXPIRES_ON = 'expiresOn';
const NEXT_LINE_ID = 'nextLineId';

const CheeseReference = new Record({ [ID]: null, [NAME]: null });

const StockLine = new Record({
  [ID]: 0,
  [CHEESE]: new CheeseReference(),
  [UOM]: null,
  [MEASURE]: null,
  [QUANTITY]: null,
  [EXPIRES_ON]: null,
});

function Stock({ id = uuid() } = {}) {

  // State -----------------------------------------------------------------------------------------

  let _state = Map({
    [ID]: id,
    [NEXT_LINE_ID]: 1,
    [LINES]: List([]),
  });

  this.getState = () => _state;

  this.toJSON = () => _state.toJS();

  // Properties  -----------------------------------------------------------------------------------

  this.getId = () => _state.get(ID);

  // Events  ---------------------------------------------------------------------------------------

  let _unpublishedEvents = [];

  this.getUnpublishedEvents = () => _unpublishedEvents.slice();

  this.clearUnpublishedEvents = () => {
    _unpublishedEvents = [];
    return this;
  };

  // Properties ------------------------------------------------------------------------------------

  this.getId = () => _state.get(ID);

  // Methods ---------------------------------------------------------------------------------------

  this.produce = ({ cheese, uom, measure, quantity, date = new Date() }) => {
    if (typeof cheese !== 'object') throw new Error('Invalid Argument: cheese');
    if (typeof uom !== 'string' || uom.length === 0) throw new Error('Invalid Argument: uom');
    if (typeof measure !== 'number' || measure <= 0) throw new Error('Invalid Argument: measure');
    if (typeof quantity !== 'number' || quantity <= 0) throw new Error('Invalid Argument: quantity');

    const expiresOn = new Date(date.valueOf());
    expiresOn.setUTCDate(expiresOn.getUTCDate() + cheese.getLifeSpan());

    // State update
    const line = new StockLine({
      [ID]: _state.get(NEXT_LINE_ID),
      [CHEESE]: new CheeseReference(cheese.getReference()),
      [UOM]: uom,
      [MEASURE]: measure,
      [QUANTITY]: quantity,
      [EXPIRES_ON]: expiresOn,
    });
    _state = _state.update(LINES, lines => lines
      .push(line))
      .update(NEXT_LINE_ID, x => x + 1);

    // Domain Events
    _unpublishedEvents.push({
      event: CheeseProduced,
      id,
      lineId: line.get(ID),
      cheese: cheese.getReference(),
      uom,
      measure,
      quantity,
      expiresOn,
      date,
    })
    return this;
  }

  this.destroy = ({ quantity = -1 }) => {
    return this;
  };
}

module.exports = Stock;
