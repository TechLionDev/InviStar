/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3548013948")

  // update collection data
  unmarshal({
    "deleteRule": "@request.auth.id != createdBy",
    "listRule": "@request.auth.id = createdBy",
    "updateRule": "@request.auth.id != createdBy",
    "viewRule": "@request.auth.id = createdBy"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3548013948")

  // update collection data
  unmarshal({
    "deleteRule": "@request.auth.id != \"\"",
    "listRule": "@request.auth.id != \"\"",
    "updateRule": "@request.auth.id != \"\"",
    "viewRule": "@request.auth.id != \"\""
  }, collection)

  return app.save(collection)
})
