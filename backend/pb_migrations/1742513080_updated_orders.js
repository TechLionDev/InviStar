/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3527180448")

  // update field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "[0-9]{10}",
    "hidden": false,
    "id": "text2526027604",
    "max": 10,
    "min": 10,
    "name": "number",
    "pattern": "^[0-9]+$",
    "presentable": true,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3527180448")

  // update field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "[a-z0-9]{10}",
    "hidden": false,
    "id": "text2526027604",
    "max": 10,
    "min": 10,
    "name": "number",
    "pattern": "^[a-z0-9]+$",
    "presentable": true,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
