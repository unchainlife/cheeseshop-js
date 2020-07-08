Feature: Create Company

Scenario: Start my cheesy company
  Given I am Mr Cheeseman I want to start a cheese company
  Then The initial name of my company should be Cheesy holding name
  When  I rename my company
  Then The name of my company should be Cheeseman's
