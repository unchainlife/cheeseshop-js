Feature: Stock Cheese

Scenario: Start my cheesy company
  Given I am Mr Cheeseman I want to start a cheese company
  Then The initial name of my company should be Cheesy holding name
  When  I rename my company
  Then The name of my company should be Cheeseman's

Scenario: Make my first cheese
  Given I want to sell some cheddar
  Then I should have some cheddar

Scenario: Add cheese to my company
  Given I want to add some cheese to my company
  Then My company should have some cheddar
