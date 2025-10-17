/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "id": "text1234567890",
        "name": "category",
        "type": "text",
        "required": true,
        "max": 255
      },
      {
        "id": "text1234567891",
        "name": "subcategory",
        "type": "text",
        "required": false,
        "max": 255
      },
      {
        "id": "text1234567892",
        "name": "difficulty",
        "type": "text",
        "required": false,
        "max": 50
      },
      {
        "id": "text1234567893",
        "name": "question",
        "type": "text",
        "required": true
      },
      {
        "id": "text1234567894",
        "name": "a",
        "type": "text",
        "required": true
      },
      {
        "id": "text1234567895",
        "name": "b",
        "type": "text",
        "required": true
      },
      {
        "id": "text1234567896",
        "name": "c",
        "type": "text",
        "required": true
      },
      {
        "id": "text1234567897",
        "name": "d",
        "type": "text",
        "required": true
      },
      {
        "id": "text1234567898",
        "name": "level",
        "type": "text",
        "required": false
      },
      {
        "id": "json1234567899",
        "name": "metadata",
        "type": "json",
        "required": false
      }
    ],
    "id": "pbc_4009210445",
    "indexes": [],
    "listRule": "@request.auth.id != \"\"",
    "name": "questions",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": "@request.auth.id != \"\""
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4009210445");

  return app.delete(collection);
})
