import { defineFeature, loadFeature } from 'jest-cucumber';

const feature = loadFeature('./src/features/StockCheese.feature');
const Company = require('../entities/company');
const Cheese = require('../entities/cheese');

defineFeature(feature, test => {
    let company;
    let cheese;

    test('Start my cheesy company', ({ given, when, then }) => {
        given('I am Mr Cheeseman I want to start a cheese company', () => {
            company = new Company();
            company.createCompany({ companyName: "Cheesy holding name" });
        });

        then('The initial name of my company should be Cheesy holding name', () => {
            expect(company.getState().companyName).toBe("Cheesy holding name")
        });

        // TODO - Add in step to test fire event

        when('I rename my company', () => {
            company.rename({ companyName: "Cheeseman's" });
        });

        then('The name of my company should be Cheeseman\'s', () => {
            expect(company.getState().companyName).toBe("Cheeseman's");
        });
    });

    test('Make my first cheese', ({ given, when, then }) => {
        given('I want to sell some cheddar', () => {
            cheese = new Cheese();
            cheese.add({ name: 'Cheddar', description: 'A hard cheese', lifespan: 10, smelly: false });
        });

        // TODO - Add in step to test fire event

        then('I should have some cheddar', () => {
            expect(cheese.getState()).toEqual({ name: 'Cheddar', description: 'A hard cheese', lifespan: 10, smelly: false });
        });
    });

    test('Add cheese to my company', ({ given, when, then }) => {
        given('I want to add some cheese to my company', () => {
            company.addCheese(cheese);
        });

        // TODO - Add in step to test fire event

        then('My company should have some cheddar', () => {
            const cheeses = company.getState().cheeses;

            expect(cheeses).toEqual([cheese]);
            expect(cheeses[0].getState().name).toBe("Cheddar");
        })
    });

});
