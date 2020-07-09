import { defineFeature, loadFeature } from 'jest-cucumber';

const feature = loadFeature('./src/features/Cheese.feature');
const Company = require('../entities/company');

defineFeature(feature, test => {
    let company;

    test('add a new cheese', ({given, when, then, and}) => {
        given("the We got the Gouda stuff Company", () => {
            company = new Company({ companyName: "We got the Gouda stuff" });
        });

        when("I add a new Cheese Cheddar to We got the Gouda stuff", () => {
            company.createCheese({ name: 'Cheddar', description: 'A hard cheese', lifespan: 30, smelly: false, active: true });
        });

        then("the result is included in We got the Gouda stuff cheeses", () => {
            const cheeses = company.getState().cheeses;
            expect(cheeses).toHaveLength(1);
        });

        and("the result is called Cheddar", () => {
            const cheeses = company.getState().cheeses;
            expect(cheeses[0].getName()).toBe('Cheddar');
        });

        and("the description is A hard cheese", () => {
            const cheeses = company.getState().cheeses;
            expect(cheeses[0].getDescription()).toBe('A hard cheese');
        });

        and("the result has an expiration of 30 days", () => {
            const cheeses = company.getState().cheeses;
            expect(cheeses[0].getLifeSpan()).toBe(30);
        });

        and("the result is not smelly", () => {
            const cheeses = company.getState().cheeses;
            expect(cheeses[0].getSmelly()).toBe(false);
        });

        and("the result active", () => {
            const cheeses = company.getState().cheeses;
            expect(cheeses[0].getActive()).toBe(true);
        });
    });

    test('remove a cheese', ({given, when, then, and}) => {
        given("the We got the Gouda stuff Company", () => {
            company = new Company({ companyName: "We got the Gouda stuff" });
        });

        and("the We got the Gouda stuff Company sells Cheddar", () => {
            company.createCheese({ name: 'Cheddar', description: 'A hard cheese', lifespan: 30, smelly: false });

            const cheeses = company.getState().cheeses;
            expect(cheeses).toHaveLength(1);
        });

        when("I remove Cheddar from We got the Gouda stuff", () => {
            company.removeCheese({ name: 'Cheddar' });
        });

        then("the cheese is set as inactive", () => {
            const cheeses = company.getState().cheeses;
            expect(cheeses[0].getActive()).toBe(false);
        });
    });

    test('trying to remove an inactive cheese', ({given, when, then, and}) => {
        let errorMessage;

        given("the We got the Gouda stuff Company", () => {
            company = new Company({ companyName: "We got the Gouda stuff" });
        });

        and("the We got the Gouda stuff Company sells Cheddar", () => {
            company.createCheese({ name: 'Cheddar', description: 'A hard cheese', lifespan: 30, smelly: false, active: false });

            const cheeses = company.getState().cheeses;
            expect(cheeses).toHaveLength(1);
        });

        when("I remove Cheddar from We got the Gouda stuff", () => {
            try{
                company.removeCheese({ name: 'Cheddar' });
            }catch(err){
                errorMessage = err.message;
            }
        });

        then("an error is thrown to show the cheese is already removed", () => {
            expect(errorMessage).toEqual("Cheese already inactive");
        });
    });


});
