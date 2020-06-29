# Domain Modelling with Aggregate Roots

1. State and Behaviour should be bound together.  To separate them creates an anemic Domain Model.  It makes it unclear what behaviour is available and current.
1. State should be encapsulated, to avoid unexpected changes by external parties.  All state mutations pass through a single interface.
1. State should be immutable, to avoid unexpected side-effects and reduce defects.
1. Don't create Aggregate Roots.  An AR should be created by another AR.  For example, Stock and Transfers should be created by a Location.  When the top-most ARs is uncovered, that should either already exist within the system, having been seeded when the application was created, or be an abstracted Root component.

## Aggreate Roots

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

## Repositories

Operations take a few different common forms, so therefore we can implement a
repository pattern.

1. Mutate an existing record
1. Create a record
1. Query records
  1. Get a single record
  1. Get multiple records
  1. Querying within a Partition
  1. Cross Partition Scanning

### Repository
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

### Mutate (within a transaction)

This method will load an entity from the database, perform an operation upon it
and then save the entity back to the database, all within a transaction.  If the
transaction fails then an exception will be raised.

```
  const repo = new Repository(...);
  await repo.execute(
    { Product: { productId: 123 } },
    p => p.rename({ name: 'New Name' })
  );
```

### Get a single Record

Loads a single record from the database, using the primary key.

```
  const repo = new Repository(...);
  const products = await repo.get({ Product: { productId: 123 } });
```

### Get Multiple Records

Loads multiple records from the database in a single hit, using their primary key.

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

### Query (within a paritition)

Queries multiple records within the same paritition.

```
  const repo = new Repository(...);
  const products = await repo.query(
    { paritionKey: 'foo' },
    { name: { $eq: 'John Smith' }
  });
```

### Cross Partition Scan (across parititions)

Queries multiple records across many parititions.

```
  const repo = new Repository(...);
  const products = repo.scan(
    { price: { $gt: 10.99 }
  });
```

### Spawn Child Records

As with mutation, this will load an entity from the database, perform and action
and then save the subject and child record back to the database in a single
transaction.

```
  const repo = new Repository(...);
  await repo.spawn(
    'Product',
    { Company: { companyId: 'xyz' } },
    c => c.createProduct({ id: 'uuid', name: 'New Product' })
  )
```

## Encryption

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
