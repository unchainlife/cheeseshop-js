# Commands

## Anatomy of a Command

A command is constructed from the following parts: `entity`, `instruction` & `handler`.

An __Entity__ is an _Aggregate Root_ that encapsulates _State_ with the _Behaviour_ of the Domain Model.  It operates only on primitive types, other entities and make consume service references.  It understands nothing about the context it operates in (e.g. Database connections, REST apis, etc.).  The __Domain Model__ is expressed as __Entities__.  By expressing our Domain Model as Entities we can ensure it is well tested.

An __Instruction__ is an object that contains only _State_ and no _Behaviour_.  It contains only primitives types, as it is meant to be serialised (e.g. as parameters in a REST API call or as a Queue message).

A __Handler__ is a function that contains no _State_, only _Behaviour_.  It understands how to convert an __Instruction__ into operations on an __Entity__.  For example, it can load a _Product_ from a database and knows which method to call.  

## Executing

### Signature

```
  commandProcessor.execute(type, args, context);
```

| Parameter     | Type     | Description                                                                 |
|---------------|----------|-----------------------------------------------------------------------------|
| type          | uri      | Unique name for the command.                                                |
| args          | object   | Arguments specific to the command being executed.                           |
| context       | object   | Context parameters used by the command process to validate, execute & audit |

| Context       | Type     | Description                                                                 |
|---------------|----------|-----------------------------------------------------------------------------|
| correlationId | string   | A unique id used to trace changes through audit logs.  Events raised and sub-commands executed will be stamped with the same correlationId as the source command.                                       |
| nonce         | string   | A parameter that makes command idempotent within a given period (30 mins)   |
| userId        | string   | userId required for auditing                                                |
| userRoles     | string[] | Array of roles that the user has been granted                               |

### Sample Usage
```
  commandProcessor.execute(
    // The command to execute
    'http://example.org/cheese-shop/v1/CreateCheese/v1',
    // The arguments specific to the command
    {
      name: 'Parmesan',
      temperature: {
        minimum: 4,
        maxmum: 8
      },
      classification: [],
      category: 'hard',
      description: 'Parmigiano-Reggiano or Parmesan is an Italian hard, granular cheese that is produced from cow's and has aged 12–36 months.\n\nIt is named after the producing areas, the provinces of Parma, Reggio Emilia, the part of Bologna west of the Reno, and Modena (all in Emilia-Romagna); and the part of Mantua (Lombardy) south of the Po. Parmigiano is the Italian adjective for Parma and Reggiano that for Reggio Emilia.\n\nBoth "Parmigiano-Reggiano" and "Parmesan" are protected designations of origin (PDO) for cheeses produced in these provinces under Italian and European law.[1] Outside the EU, the name "Parmesan" can legally be used for similar cheeses, with only the full Italian name unambiguously referring to PDO Parmigiano-Reggiano.\n\nIt has been called the "King of Cheeses" and a "practically perfect food".'
    },
    // command processor context
    {
      correlationId: '74f4a698-3913-4313-b763-3e993292475f',
      nonce: '74f4a698-3913-4313-b763-3e993292475f',
      userId: 'chris.kemp@example.org',
      userRoles: [ 'admin' ]
    }
  );

```
