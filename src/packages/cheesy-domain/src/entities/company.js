const { cloneDeep, filter } = require('lodash');
const Cheese = require('./cheese');

function Company(initialState) {
  let _state = initialState;
  this.getState = () => cloneDeep(_state);

  let _events = [];
  this.getEvents = () => cloneDeep(_events);
  this.clearEvents = () => { _events = []; };

  this.createCheese = ( { name, description, lifespan, smelly, active } ) => {

    // Validate input
    if (typeof name !== 'string' || name.length === 0) throw new Error('Invalid Argument: name');
    if (typeof description !== 'string' || description.length === 0) throw new Error('Invalid Argument: description');
    if (typeof lifespan !== 'number' || lifespan <= 0) throw new Error('Invalid Argument: lifespan');
    if (typeof smelly !== 'boolean') throw new Error('Invalid Argument: smelly');

    let cheese = new Cheese({ name, description, lifespan, smelly, active });

    const oldCheeses = _state.cheeses ? _state.cheeses : [];

    let newCheeses = oldCheeses;
    newCheeses.push(cheese);

    // Mutate state
    _state = {
      ..._state,
      cheeses: newCheeses
    };

    // Push event
    _events.push({
      type: 'CHEESE_CREATED',
      cheeses: { oldValue: oldCheeses, newValue: newCheeses }
    });

    // Return AR, to allow chaining
    return this;
  };

  this.removeCheese = ({ name }) => {
    if (typeof name !== 'string' || name.length === 0) throw new Error('Invalid Argument: name');

    const oldCheeses = _state.cheeses;

    if (oldCheeses && oldCheeses.length === 0){
      throw new Error('No cheeses to remove');
    }

    const newCheeses = filter(oldCheeses, function (cheese) {
      if(cheese.getName() === name){
          cheese.setInactive()
      }
      return cheese;
    });

    // Mutate state
    _state = {
      ..._state,
      cheeses: newCheeses
    };

    // Push event
    _events.push({
      type: 'CHEESE_REMOVED',
      cheeses: { oldValue: oldCheeses, newValue: newCheeses }
    });

    // Return AR, to allow chaining
    return this;

  };

}

module.exports = Company;
