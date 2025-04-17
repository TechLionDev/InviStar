/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3548013948")

  // add field
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1256148306",
    "max": 0,
    "min": 0,
    "name": "addressStreet",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2337074815",
    "max": 0,
    "min": 0,
    "name": "addressCity",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1111186703",
    "max": 0,
    "min": 0,
    "name": "addressState",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3920017891",
    "max": 0,
    "min": 0,
    "name": "addressZip",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3548013948")

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
