/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // add field
  collection.fields.addAt(9, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1256148306",
    "max": 0,
    "min": 0,
    "name": "addressStreet",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2337074815",
    "max": 0,
    "min": 0,
    "name": "addressCity",
    "pattern": "^[a-z]+$",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1111186703",
    "max": 2,
    "min": 2,
    "name": "addressState",
    "pattern": "^[a-z]+$",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(12, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3920017891",
    "max": 5,
    "min": 5,
    "name": "addressZip",
    "pattern": "^[0-9]+$",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // remove field
  collection.fields.removeById("text1256148306")

  // remove field
  collection.fields.removeById("text2337074815")

  // remove field
  collection.fields.removeById("text1111186703")

  // remove field
  collection.fields.removeById("text3920017891")

  return app.save(collection)
})
