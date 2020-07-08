const { cloneDeep } = require('lodash');

function Cheese(initialState) {
    let _state = initialState;
    this.getState = () => cloneDeep(_state);

    let _events = [];
    this.getEvents = () => cloneDeep(_events);
    this.clearEvents = () => { _events = []; };

    this.add = ({ name, description, lifespan, smelly }) => {
        // Validate input
        if (typeof name !== 'string' || name.length === 0) throw new Error('Invalid Argument: name');
        if (typeof description !== 'string' || description.length === 0) throw new Error('Invalid Argument: description');
        if (typeof lifespan !== 'number' || lifespan <= 0) throw new Error('Invalid Argument: lifespan');
        if (typeof smelly !== 'boolean') throw new Error('Invalid Argument: smelly');

        // Mutate state
        _state = {
            ..._state,
            name,
            description,
            lifespan,
            smelly
        };

        // Push event
        _events.push({
            type: 'CHEESE_CREATED',
            name,
            description,
            lifespan,
            smelly
        });
    };
}

module.exports = Cheese;
