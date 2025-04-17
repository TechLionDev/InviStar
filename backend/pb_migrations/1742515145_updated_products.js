/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4092854851")

  // update field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "[A-Z0-9]{12}",
    "hidden": false,
    "id": "text261109956",
    "max": 12,
    "min": 0,
    "name": "sku",
    "pattern": "^[A-Z0-9_-]+$",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4092854851")

  // update field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "[A-Z0-9]{12}",
    "hidden": false,
    "id": "text261109956",
    "max": 12,
    "min": 12,
    "name": "sku",
    "pattern": "^[A-Z0-9_-]+$",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
