/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_259691473")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "bool1639016958",
    "name": "archived",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "relation3545646658",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "createdBy",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_259691473")

  // remove field
  collection.fields.removeById("bool1639016958")

  // remove field
  collection.fields.removeById("relation3545646658")

  return app.save(collection)
})
