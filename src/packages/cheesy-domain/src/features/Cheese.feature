Feature: Cheese

Scenario: add a new cheese
  Given the We got the Gouda stuff Company
  When I add a new Cheese Cheddar to We got the Gouda stuff
  Then the result is included in We got the Gouda stuff cheeses
  And the result is called Cheddar
  And the description is A hard cheese
  And the result has an expiration of 30 days
  And the result is not smelly
  And the result active

Scenario: remove a cheese
  Given the We got the Gouda stuff Company
  And the We got the Gouda stuff Company sells Cheddar
  When I remove Cheddar from We got the Gouda stuff
  Then the cheese is set as inactive

Scenario: trying to remove an inactive cheese
  Given the We got the Gouda stuff Company
  And the We got the Gouda stuff Company sells Cheddar
  When I remove Cheddar from We got the Gouda stuff
  Then an error is thrown to show the cheese is already removed
