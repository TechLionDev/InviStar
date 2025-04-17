/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3548013948")

  // update collection data
  unmarshal({
    "deleteRule": "@request.auth.id = createdBy.id",
    "updateRule": "@request.auth.id = createdBy.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3548013948")

  // update collection data
  unmarshal({
    "deleteRule": "@request.auth.id != createdBy.id",
    "updateRule": "@request.auth.id != createdBy.id"
  }, collection)

  return app.save(collection)
})
