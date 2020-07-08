const { cloneDeep } = require('lodash');
const Cheese = require('./cheese');

function Company(initialState) {
  let _state = initialState;
  this.getState = () => cloneDeep(_state);

  let _events = [];
  this.getEvents = () => cloneDeep(_events);
  this.clearEvents = () => { _events = []; };

  this.createCompany = ({ companyName, cheeses }) => {
    // Validate input
    if (typeof companyName !== 'string' || companyName.length === 0) throw new Error('Invalid Argument: companyName');
    if (typeof cheeses === 'undefined') cheeses = [];

    // Mutate state
    _state = {
      ..._state,
      companyName,
      cheeses
    };

    // Push event
    _events.push({
      type: 'COMPANY_CREATED',
      companyName,
      cheeses
    });

  };

  this.rename = ({ companyName }) => {
    // Validate input
    if (!companyName) throw new Error('Invalid Company Name');

    // Capture current state for event
    const oldCompanyName = _state.companyName;

    // Mutate state
    _state = {
      ..._state,
      companyName
    };

    // Push event
    _events.push({
      type: 'COMPANY_RENAMED',
      companyName: { oldValue: oldCompanyName, newValue: companyName }
    });

    // Return AR, to allow chaining
    return this;
  };

  this.makeCheese = ( cheeseProps ) => {
    let cheese = new Cheese();
    cheese.add({ ...cheeseProps });

    const oldCheeses = _state.cheeses;

    let newCheeses = oldCheeses;
    newCheeses.push(cheese);

    // Mutate state
    _state = {
      ..._state,
      cheeses: newCheeses
    };

    // Push event
    _events.push({
      type: 'CHEESE_MADE',
      cheeses: { oldValue: oldCheeses, newValue: newCheeses }
    });

    // Return AR, to allow chaining
    return this;
  };

  this.addCheese = ( cheese ) => {

    const oldCheeses = _state.cheeses;

    let newCheeses = oldCheeses;
    newCheeses.push(cheese);

    // Mutate state
    _state = {
      ..._state,
      cheeses: newCheeses
    };

    // Push event
    _events.push({
      type: 'CHEESE_ADDED',
      cheeses: { oldValue: oldCheeses, newValue: newCheeses }
    });

    // Return AR, to allow chaining
    return this;
  };

}

module.exports = Company;
