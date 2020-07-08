import { defineFeature, loadFeature } from 'jest-cucumber';

const feature = loadFeature('./src/features/CreateCheese.feature');
const Cheese = require('../entities/cheese');

defineFeature(feature, test => {
    let cheese;

    test('Make my first cheese', ({ given, when, then }) => {
        given('I want to sell some cheddar', () => {
            cheese = new Cheese();
        });

        then('I should be able to create some cheddar', () => {
            cheese.add({ name: 'Cheddar', description: 'A hard cheese', lifespan: 10, smelly: false });

            expect(cheese.getState()).toEqual({ name: 'Cheddar', description: 'A hard cheese', lifespan: 10, smelly: false });
        });
    });

});
