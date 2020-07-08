import { defineFeature, loadFeature } from 'jest-cucumber';

const feature = loadFeature('./src/features/CreateCompany.feature');
const Company = require('../entities/company');

defineFeature(feature, test => {
    let company;

    test('Start my cheesy company', ({given, when, then}) => {
        given('I am Mr Cheeseman I want to start a cheese company', () => {
            company = new Company();
            company.createCompany({companyName: "Cheesy holding name"});
        });

        then('The initial name of my company should be Cheesy holding name', () => {
            expect(company.getState().companyName).toBe("Cheesy holding name")
        });

        // TODO - Add in step to fire event

        when('I rename my company', () => {
            company.rename({companyName: "Cheeseman's"});
        });

        then('The name of my company should be Cheeseman\'s', () => {
            expect(company.getState().companyName).toBe("Cheeseman's");
        });
    });

});
