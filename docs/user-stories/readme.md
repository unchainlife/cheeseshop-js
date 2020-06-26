# User Stories

The following is a set of User Stories to define the Domain for the Cheese Shop

The Basic Premise is that we have a business which operates a number of Cheese
Shops.  The company makes it's own and buys cheese, which it distributes between
it's Stores,  they are sold to the public.  They already have a Retail EPOS
System and public website, which they do not want to change, but they would like
better control over the stock.

Their EPOS system is a good value system, and the firm behind it have said they
can do some limited integrations, if needed.

The company website was written in PHP by the boss's son.  It's very simple, but
serviceable. He's more interested in the creative website and adding this to his
resume, but is keen to put live stock information up.

## Roles

1. Company - A top level role used to set the overall goal, and group all employees
1. Admin - A person responsible for configuring the system.
1. Worker - A person responsible for managing the product catalogue, recording
stock levels and dispatching goods.
1. Customer - An external person who wants to buy cheese.
1. Courier - A person responsible for moving cheese between stock locations.

## Deliverables

1. REST API
1. Mobile Only React App
1. Document DB Storage

## Entities

1. Cheese - A product
1. Stock - Real world instances of Cheese
1. Location - A place where Cheese is stored
1. Transfer - An order to move Cheese to another Location

## Stories

* As a Company I want to make/buy/stock Cheese, so that I can sell it
  * As an Admin I want to configure the System correctly, so that we can sell cheese
    * As an Admin I want to Create a new Location, so that we can store cheese
      * As an Admin I want to add a Stock Room, so that we can store cheese
      * As an Admin I want to add a Vehicle, so that we can store cheese in transit
    * As an Admin I want to Close a Location, so that it is no longer used
    * As an Admin I want to Block a Location, so that new Transfers cannot be received
    * As an Admin I want to Adjust a Location, so that it can be corrected/amended
  * As a Worker I want to manage the System, so that we can sell cheese
    * As a Worker I want to manage Cheese
      * As a Worker I want to Add a new Cheese
      * As a Worker I want to Remove an existing Cheese
      * As a Worker I want to Amend an existing Cheese
    * As a Worker I want to manage Stock
      * As a Worker I want to Add new Stock, so that we can sell it
        * As a Worker I want to Make a batch of Cheese, so that we can sell it
        * As a Worker I want to Buy Cheese, so that we can sell it
      * As a Worker I want to Remove existing Stock, so that we can keep accurate stock levels
        * As a Worker I want to record Sales
        * As a Worker I want to record Waste/Damage/Loss
        * As a Worker I want to record Theft, to look for patterns
        * As a Worker I want to record Expiration, to avoid future waste
      * As a Worker I want to Transfer Stock, so that we can get it in the right store
      * As a Worker I want to split Stock, so that we can sell it in smaller measures
  * As a Courier I want to transfer Cheese between Locations, so that we can sell cheese
    * As a Courier I want to see what Transfers are needed, so that I can deliver them
    * As a Courier I want to Pickup Stock, so that I can deliver it
    * As a Courier I want to Deliver Stock, so that I can mark it as arrived
* As a Customer I want to know if a Store has Cheese in stock, so that I can avoid an unnecessary trip.
