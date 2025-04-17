/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4092854851")

  // remove field
  collection.fields.removeById("text25009842")

  // remove field
  collection.fields.removeById("text4156564586")

  // remove field
  collection.fields.removeById("text4115522831")

  // remove field
  collection.fields.removeById("text130897217")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number25009842",
    "max": null,
    "min": null,
    "name": "length",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "number2350531887",
    "max": null,
    "min": null,
    "name": "width",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "number4115522831",
    "max": null,
    "min": null,
    "name": "height",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "number130897217",
    "max": null,
    "min": null,
    "name": "weight",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4092854851")

  // add field
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text25009842",
    "max": 0,
    "min": 0,
    "name": "length",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text4156564586",
    "max": 0,
    "min": 0,
    "name": "width",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text4115522831",
    "max": 0,
    "min": 0,
    "name": "height",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text130897217",
    "max": 0,
    "min": 0,
    "name": "weight",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // remove field
  collection.fields.removeById("number25009842")

  // remove field
  collection.fields.removeById("number2350531887")

  // remove field
  collection.fields.removeById("number4115522831")

  // remove field
  collection.fields.removeById("number130897217")

  return app.save(collection)
})
