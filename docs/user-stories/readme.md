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

## Rules

1. State and Behaviour should be bound together.  To separate them creates an anemic Domain Model.  It makes it unclear what behaviour is available and current.
1. State should be encapsulated, to avoid unexpected changes by external parties.  All state mutations pass through a single interface.
1. State should be immutable, to avoid unexpected side-effects and reduce defects.
1. Don't create Aggregate Roots.  An AR should be created by another AR.  For example, Stock and Transfers should be created by a Location.  When the top-most ARs is uncovered, that should either already exist within the system, having been seeded when the application was created, or be an abstracted Root component.

## Examples

### Aggreate Roots

1. Have a constructor which takes initial `state` as an argument.
1. `getState` method, which returns a *copy* of the `state`.
1. `getEvents` method, which returns `events` raised.
1. `clearEvents` method, which removes `events` raised.

```
  function Person(initialState) {
    let _state = initialState || { };
    this.getState = () => deepCopy(_state);

    let _events = [];
    this.getEvents = () => deepCopy(_events);
    this.clearEvents = () => { _events = []; };

    /**
     * rename Person
     * @param {string} givenName
     * @param {string} familyName
     */

    this.rename = ({ givenName, familyName }) => {
      // Validate input
      if (!givenName || !familyName) throw new Error('Invalid Name');

      // Capture current state for event
      const oldGivenName = _state.givenName;
      const oldFamilyName = _state.familyName;

      // Mutate state
      _state = {
        ..._state,
        name
      };

      // Push event
      _events.push({
        type: 'PERSON_RENAMED',
        givenName: { oldValue: oldGivenName, newValue: givenName },
        familyName: { oldValue: oldFamilyName, newValue: familyName }
      });

      // Return AR, to allow chaining
      return this;
    };
  }
```

### Repositories

Operations take a few different common forms, so therefore we can implement a
repository pattern.

1. Mutate an existing record
1. Create a record
1. Query records
  1. Get a single record
  1. Get multiple records
  1. Querying within a Partition
  1. Cross Partition Scanning

#### Repository
```
  const repo = new Repository({
    host: 'dbserver',
    port: 12345,
    databaseName: 'Live',
    username: 'foo',
    password: 'SomeSecretPassword'
  })
  .addType({
    name: 'Product',
    type: Product,
    collectionName: 'Products',
    consistencyKey: '$etag'
  })
  .addType({
    name: 'Company',
    type: Company,
    collectionName: 'Companies',
    consistencyKey: '$etag'
  })
  .finalise();
```

#### Mutate (within a transaction)

```
  const repo = new Repository(...);
  await repo.execute(
    { Product: { productId: 123 } },
    p => p.rename({ name: 'New Name' })
  );
```

#### Get a single Record
```
  const repo = new Repository(...);
  const products = await repo.get({ Product: { productId: 123 } });
```

#### Get Multiple Records
```
  const repo = new Repository(...);
  const products = await repo.get({
    Product: [
      { productId: 123 },
      { productId: 456 },
      { productId: 789 }
    ],
    Location: [
      { locationId: 'xyz' }
    ]
  });
```

#### Query (within a paritition)
```
  const repo = new Repository(...);
  const products = await repo.query(
    { paritionKey: 'foo' },
    { name: { $eq: 'John Smith' }
  });
```

#### Cross Partition Scan (across parititions)
```
  const repo = new Repository(...);
  const products = repo.scan(
    { price: { $gt: 10.99 }
  });
```

#### Spawn Child Records
```
  const repo = new Repository(...);
  await repo.spawn(
    'Product',
    { Company: { companyId: 'xyz' } },
    c => c.createProduct({ id: 'uuid', name: 'New Product' })
  )
```

### Encryption

By using the Decorator Pattern, it will be possible to extend the Repositories
to support Encryption without the end developer needing to write any code.

This will cause a `$crypto_vesion` and `$crypto_salt` value to be written onto
the record, to allow us to use key and version rotation of the records.  By
creating a new version we can change the properties that are encrypted, the
encryption method or the secrets used on a record by record basis, allowing
each record to have it's keys rotated independently.  Key rotation would happen
naturally whenever an object using an old key is read, as the new key would be
used to re-encrypt.

Encryption would become transparent.

```
  // Create a crypto service that can support multiple keys
  const crypto = new EncryptionService({
      versionField: '$crypto_version',
      saltField: '$crypto_salt'
    })
    .addVersion({ version: 1, status: 'Deleted', ... }) // traps use of deleted keys
    .addVersion({ version: 2, status: 'Closed', ... })  // only for reads
    .addVersion({ version: 3, status: 'Open', ... })    // for reads/writes
    .finalise();

  const encrypted = crypto.encrypt({ $crypto_salt: 'XYZ', name: 'Personal', description: 'Information' }]);
  // { "$crypto_version": 3, "$crypto_salt": "XYZ", name": "K£@$£$£@", "description": "))£$£NBKB857745!!" }]

  const repo = new EncryptionDecorator({
    crypto,
    inner: new Repository({
      type: Product,
      collectionName: 'Product',
      consistencyKey: '$etag'
    })
  });
  await repo.execute({ productId: 123 }, p => p.rename({ name: 'Test '}));
```
