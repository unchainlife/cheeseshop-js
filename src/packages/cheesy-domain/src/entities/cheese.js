const { cloneDeep } = require('lodash');

function Cheese(initialState) {
    let _state = initialState;
    this.getState = () => cloneDeep(_state);

    let _events = [];
    this.getEvents = () => cloneDeep(_events);
    this.clearEvents = () => { _events = []; };

    // Properties ------------------------------------------------------------------------------------

    this.getName = () => _state.name;
    this.getDescription = () => _state.description;
    this.getLifeSpan = () => _state.lifespan;
    this.getSmelly = () => _state.smelly;
    this.getActive = () => _state.active;

    this.setInactive = () => {

        if (_state.active === false) throw new Error('Cheese already inactive');

        // Mutate state
        _state = {
            ..._state,
            active: false
        };

        // Push event
        _events.push({
            type: 'CHEESE_REMOVED',
            active: { oldValue: true, newValue: false }
        });

        return this;
    }

}

module.exports = Cheese;
