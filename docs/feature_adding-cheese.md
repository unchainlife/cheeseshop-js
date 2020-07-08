# As a Worker I want to manage Cheese, so that we can sell it

The basic story that someone needs to manage the catalogue of cheeses being sold.

## As a Worker I want to Add a new Cheese, so that we can stock and sell it

Each cheese has the following properties:

| Property    | Type                        | Validation        | Description                                                                   |
|-------------|-----------------------------|-------------------|-------------------------------------------------------------------------------|
| Code        | string                      | [a-z]{3,}         | Key: Unique Code for Cheese                                                   |
| Version     | int                         | default: 1        | Key: Version number for Cheese.                                               |
| Name        | string                      | Required          | A descriptive name for the Cheese (e.g. Cheddar)                              |
| Description | string                      | Required          | A long description, using markdown                                            |
| Category    | enum(Hard,Soft,Spreadable)  | Required          | Classification information                                                    |
| Temperature | range(number)               | Optional, Min<Max | A Min/Max temperature, needed for storage suitability.                        |
| Attributes  | flags(smelly, spicy, vegan) | Optional          | A set of special rule attributes regarding it's storage, handling, etc.       |
| Lifespan    | integer                     | Required, 1+      | The number of days the cheese will keep from manufacture                      |
| Active      | bool                        | Default: true     | Indicates the status of the cheese.                                           |
| Published   | bool                        | Default: false    | Indicates whether the cheese is published and can be stocked, but not amended |

1. `Code` x `Version` must be unique
1. Raises `CHEESE_CREATED` event

## As a Worker I want to Remove an existing Cheese, so that we no longer stock it

When we're done with a Cheese we want to remove it.

1. Throw error if `Active = false`
1. Set `Active` to `false`
1. Raises `CHEESE_REMOVED` event

## As a Worker I want to Reopen an existing Cheese, so that we can stock it again

If we want to start selling an inactive cheese again we can re-open it.

1. Throw error if `Active = true`
1. Set `Active` to `true`
1. Raises `CHEESE_REOPENED` event

## As a Worker I want to Amend an existing Cheese, so that we can adjust it prior to sale

Before we start selling it we can revise the details.

1. Only `Published = false` cheese can be amended
1. `Code` can never be amended
1. `Version` can never be amended
1. Raises `CHEESE_AMENDED` event

## As a Worker I want to Publish an existing Cheese, so that we can sell it

Once we're happy with the details we can publish it, and start to stock it.

1. Throw error if `Published = true`
1. Set `Published` to `true`
1. Raises `CHEESE_PUBLISHED` event

## As a Worker I want to Revise an existing Cheese, so that we can amend existing cheese

Once we've published a cheese we cannot amend it.  We need to create a new revision and amend that.

1. Throw error if `Published = false`
1. Create a duplicate cheese
1. Set the `Status` to `unpublished`
1. `Code` must be the same
1. Increment the `Version` number
1. Must not be able to create two cheeses with the same `Version`
