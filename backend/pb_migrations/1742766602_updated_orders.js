/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3527180448")

  // remove field
  collection.fields.removeById("select2292334449")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3527180448")

  // add field
  collection.fields.addAt(12, new Field({
    "hidden": false,
    "id": "select2292334449",
    "maxSelect": 1,
    "name": "terms",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "COD",
      "Check",
      "Consignment",
      "Credit Card",
      "Sample",
      "Net15",
      "Net30",
      "Net60"
    ]
  }))

  return app.save(collection)
})
