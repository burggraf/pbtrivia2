/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const hostOnlyRule = "@request.auth.id = host";

    const games = new Collection({
      "id": "pbc_4009211000",
      "name": "games",
      "type": "base",
      "system": false,
      "listRule": hostOnlyRule,
      "viewRule": hostOnlyRule,
      "createRule": hostOnlyRule,
      "updateRule": hostOnlyRule,
      "deleteRule": hostOnlyRule,
      "indexes": [
        "CREATE UNIQUE INDEX IF NOT EXISTS idx_games_code ON games (code)"
      ],
      "fields": [
        {
          "id": "rel_games_host",
          "name": "host",
          "type": "relation",
          "system": false,
          "required": true,
          "presentable": false,
          "unique": false,
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": 1,
          "maxSelect": 1,
          "displayFields": [],
          "options": {
            "collectionId": "_pb_users_auth_",
            "cascadeDelete": false,
            "minSelect": 1,
            "maxSelect": 1,
            "displayFields": []
          }
        },
        {
          "id": "text_games_name",
          "name": "name",
          "type": "text",
          "system": false,
          "required": true,
          "presentable": false,
          "unique": false,
          "max": 255
        },
        {
          "id": "text_games_code",
          "name": "code",
          "type": "text",
          "system": false,
          "required": true,
          "presentable": false,
          "unique": false,
          "min": 4,
          "max": 12,
          "pattern": "^[A-Z0-9]+$"
        },
        {
          "id": "text_games_status",
          "name": "status",
          "type": "text",
          "system": false,
          "required": true,
          "presentable": false,
          "unique": false,
          "max": 32
        },
        {
          "id": "num_games_round",
          "name": "currentRound",
          "type": "number",
          "system": false,
          "required": false,
          "presentable": false,
          "unique": false,
          "min": 0,
          "max": null,
          "noDecimal": true
        },
        {
          "id": "date_games_started",
          "name": "startedAt",
          "type": "date",
          "system": false,
          "required": false,
          "presentable": false,
          "unique": false
        },
        {
          "id": "date_games_completed",
          "name": "completedAt",
          "type": "date",
          "system": false,
          "required": false,
          "presentable": false,
          "unique": false
        }
      ]
    });

    app.save(games);

    const rounds = new Collection({
      "id": "pbc_4009211001",
      "name": "rounds",
      "type": "base",
      "system": false,
      "listRule": hostOnlyRule,
      "viewRule": hostOnlyRule,
      "createRule": hostOnlyRule,
      "updateRule": hostOnlyRule,
      "deleteRule": hostOnlyRule,
      "indexes": [
        "CREATE INDEX IF NOT EXISTS idx_rounds_game ON rounds (game)",
        "CREATE INDEX IF NOT EXISTS idx_rounds_order ON rounds (game, orderIndex)"
      ],
      "fields": [
        {
          "id": "rel_rounds_host",
          "name": "host",
          "type": "relation",
          "system": false,
          "required": true,
          "presentable": false,
          "unique": false,
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": 1,
          "maxSelect": 1,
          "displayFields": [],
          "options": {
            "collectionId": "_pb_users_auth_",
            "cascadeDelete": false,
            "minSelect": 1,
            "maxSelect": 1,
            "displayFields": []
          }
        },
        {
          "id": "rel_rounds_game",
          "name": "game",
          "type": "relation",
          "system": false,
          "required": true,
          "presentable": false,
          "unique": false,
          "collectionId": "pbc_4009211000",
          "cascadeDelete": true,
          "minSelect": 1,
          "maxSelect": 1,
          "displayFields": [],
          "options": {
            "collectionId": "pbc_4009211000",
            "cascadeDelete": true,
            "minSelect": 1,
            "maxSelect": 1,
            "displayFields": []
          }
        },
        {
          "id": "text_rounds_name",
          "name": "name",
          "type": "text",
          "system": false,
          "required": true,
          "presentable": false,
          "unique": false,
          "max": 255
        },
        {
          "id": "num_rounds_order",
          "name": "orderIndex",
          "type": "number",
          "system": false,
          "required": true,
          "presentable": false,
          "unique": false,
          "min": 0,
          "max": null,
          "noDecimal": true
        },
        {
          "id": "text_rounds_status",
          "name": "status",
          "type": "text",
          "system": false,
          "required": true,
          "presentable": false,
          "unique": false,
          "max": 32
        },
        {
          "id": "date_rounds_started",
          "name": "startedAt",
          "type": "date",
          "system": false,
          "required": false,
          "presentable": false,
          "unique": false
        },
        {
          "id": "date_rounds_completed",
          "name": "completedAt",
          "type": "date",
          "system": false,
          "required": false,
          "presentable": false,
          "unique": false
        }
      ]
    });

    app.save(rounds);

    const roundQuestions = new Collection({
      "id": "pbc_4009211002",
      "name": "round_questions",
      "type": "base",
      "system": false,
      "listRule": hostOnlyRule,
      "viewRule": hostOnlyRule,
      "createRule": hostOnlyRule,
      "updateRule": hostOnlyRule,
      "deleteRule": hostOnlyRule,
      "indexes": [
        "CREATE UNIQUE INDEX IF NOT EXISTS idx_round_questions_order ON round_questions (round, orderIndex)"
      ],
      "fields": [
        {
          "id": "rel_rq_host",
          "name": "host",
          "type": "relation",
          "system": false,
          "required": true,
          "presentable": false,
          "unique": false,
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": 1,
          "maxSelect": 1,
          "displayFields": [],
          "options": {
            "collectionId": "_pb_users_auth_",
            "cascadeDelete": false,
            "minSelect": 1,
            "maxSelect": 1,
            "displayFields": []
          }
        },
        {
          "id": "rel_rq_round",
          "name": "round",
          "type": "relation",
          "system": false,
          "required": true,
          "presentable": false,
          "unique": false,
          "collectionId": "pbc_4009211001",
          "cascadeDelete": true,
          "minSelect": 1,
          "maxSelect": 1,
          "displayFields": [],
          "options": {
            "collectionId": "pbc_4009211001",
            "cascadeDelete": true,
            "minSelect": 1,
            "maxSelect": 1,
            "displayFields": []
          }
        },
        {
          "id": "rel_rq_question",
          "name": "question",
          "type": "relation",
          "system": false,
          "required": true,
          "presentable": false,
          "unique": false,
          "collectionId": "pbc_4009210445",
          "cascadeDelete": false,
          "minSelect": 1,
          "maxSelect": 1,
          "displayFields": [],
          "options": {
            "collectionId": "pbc_4009210445",
            "cascadeDelete": false,
            "minSelect": 1,
            "maxSelect": 1,
            "displayFields": []
          }
        },
        {
          "id": "num_rq_order",
          "name": "orderIndex",
          "type": "number",
          "system": false,
          "required": true,
          "presentable": false,
          "unique": false,
          "min": 0,
          "max": null,
          "noDecimal": true
        },
        {
          "id": "num_rq_points",
          "name": "points",
          "type": "number",
          "system": false,
          "required": false,
          "presentable": false,
          "unique": false,
          "min": 0,
          "max": null,
          "noDecimal": false
        }
      ]
    });

    app.save(roundQuestions);

    const teams = new Collection({
      "id": "pbc_4009211003",
      "name": "teams",
      "type": "base",
      "system": false,
      "listRule": hostOnlyRule,
      "viewRule": hostOnlyRule,
      "createRule": hostOnlyRule,
      "updateRule": hostOnlyRule,
      "deleteRule": hostOnlyRule,
      "indexes": [
        "CREATE INDEX IF NOT EXISTS idx_teams_game ON teams (game)",
        "CREATE UNIQUE INDEX IF NOT EXISTS idx_teams_game_name ON teams (game, name)"
      ],
      "fields": [
        {
          "id": "rel_teams_host",
          "name": "host",
          "type": "relation",
          "system": false,
          "required": true,
          "presentable": false,
          "unique": false,
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": 1,
          "maxSelect": 1,
          "displayFields": [],
          "options": {
            "collectionId": "_pb_users_auth_",
            "cascadeDelete": false,
            "minSelect": 1,
            "maxSelect": 1,
            "displayFields": []
          }
        },
        {
          "id": "rel_teams_game",
          "name": "game",
          "type": "relation",
          "system": false,
          "required": true,
          "presentable": false,
          "unique": false,
          "collectionId": "pbc_4009211000",
          "cascadeDelete": true,
          "minSelect": 1,
          "maxSelect": 1,
          "displayFields": [],
          "options": {
            "collectionId": "pbc_4009211000",
            "cascadeDelete": true,
            "minSelect": 1,
            "maxSelect": 1,
            "displayFields": []
          }
        },
        {
          "id": "text_teams_name",
          "name": "name",
          "type": "text",
          "system": false,
          "required": true,
          "presentable": false,
          "unique": false,
          "max": 255
        },
        {
          "id": "num_teams_score",
          "name": "score",
          "type": "number",
          "system": false,
          "required": false,
          "presentable": false,
          "unique": false,
          "min": 0,
          "max": null,
          "noDecimal": false
        }
      ]
    });

    app.save(teams);

    const teamMembers = new Collection({
      "id": "pbc_4009211004",
      "name": "team_members",
      "type": "base",
      "system": false,
      "listRule": hostOnlyRule,
      "viewRule": hostOnlyRule,
      "createRule": hostOnlyRule,
      "updateRule": hostOnlyRule,
      "deleteRule": hostOnlyRule,
      "indexes": [
        "CREATE UNIQUE INDEX IF NOT EXISTS idx_team_members_unique ON team_members (team, user)"
      ],
      "fields": [
        {
          "id": "rel_tm_host",
          "name": "host",
          "type": "relation",
          "system": false,
          "required": true,
          "presentable": false,
          "unique": false,
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": 1,
          "maxSelect": 1,
          "displayFields": [],
          "options": {
            "collectionId": "_pb_users_auth_",
            "cascadeDelete": false,
            "minSelect": 1,
            "maxSelect": 1,
            "displayFields": []
          }
        },
        {
          "id": "rel_tm_team",
          "name": "team",
          "type": "relation",
          "system": false,
          "required": true,
          "presentable": false,
          "unique": false,
          "collectionId": "pbc_4009211003",
          "cascadeDelete": true,
          "minSelect": 1,
          "maxSelect": 1,
          "displayFields": [],
          "options": {
            "collectionId": "pbc_4009211003",
            "cascadeDelete": true,
            "minSelect": 1,
            "maxSelect": 1,
            "displayFields": []
          }
        },
        {
          "id": "rel_tm_user",
          "name": "user",
          "type": "relation",
          "system": false,
          "required": true,
          "presentable": false,
          "unique": false,
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": 1,
          "maxSelect": 1,
          "displayFields": [],
          "options": {
            "collectionId": "_pb_users_auth_",
            "cascadeDelete": false,
            "minSelect": 1,
            "maxSelect": 1,
            "displayFields": []
          }
        },
        {
          "id": "bool_tm_captain",
          "name": "isCaptain",
          "type": "bool",
          "system": false,
          "required": false,
          "presentable": false,
          "unique": false
        }
      ]
    });

    app.save(teamMembers);

    const teamAnswers = new Collection({
      "id": "pbc_4009211005",
      "name": "team_answers",
      "type": "base",
      "system": false,
      "listRule": hostOnlyRule,
      "viewRule": hostOnlyRule,
      "createRule": hostOnlyRule,
      "updateRule": hostOnlyRule,
      "deleteRule": hostOnlyRule,
      "indexes": [
        "CREATE UNIQUE INDEX IF NOT EXISTS idx_team_answers_unique ON team_answers (team, roundQuestion)",
        "CREATE INDEX IF NOT EXISTS idx_team_answers_round ON team_answers (round)",
        "CREATE INDEX IF NOT EXISTS idx_team_answers_question ON team_answers (question)"
      ],
      "fields": [
        {
          "id": "rel_ta_host",
          "name": "host",
          "type": "relation",
          "system": false,
          "required": true,
          "presentable": false,
          "unique": false,
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": 1,
          "maxSelect": 1,
          "displayFields": [],
          "options": {
            "collectionId": "_pb_users_auth_",
            "cascadeDelete": false,
            "minSelect": 1,
            "maxSelect": 1,
            "displayFields": []
          }
        },
        {
          "id": "rel_ta_team",
          "name": "team",
          "type": "relation",
          "system": false,
          "required": true,
          "presentable": false,
          "unique": false,
          "collectionId": "pbc_4009211003",
          "cascadeDelete": true,
          "minSelect": 1,
          "maxSelect": 1,
          "displayFields": [],
          "options": {
            "collectionId": "pbc_4009211003",
            "cascadeDelete": true,
            "minSelect": 1,
            "maxSelect": 1,
            "displayFields": []
          }
        },
        {
          "id": "rel_ta_round",
          "name": "round",
          "type": "relation",
          "system": false,
          "required": true,
          "presentable": false,
          "unique": false,
          "collectionId": "pbc_4009211001",
          "cascadeDelete": false,
          "minSelect": 1,
          "maxSelect": 1,
          "displayFields": [],
          "options": {
            "collectionId": "pbc_4009211001",
            "cascadeDelete": false,
            "minSelect": 1,
            "maxSelect": 1,
            "displayFields": []
          }
        },
        {
          "id": "rel_ta_round_question",
          "name": "roundQuestion",
          "type": "relation",
          "system": false,
          "required": true,
          "presentable": false,
          "unique": false,
          "collectionId": "pbc_4009211002",
          "cascadeDelete": false,
          "minSelect": 1,
          "maxSelect": 1,
          "displayFields": [],
          "options": {
            "collectionId": "pbc_4009211002",
            "cascadeDelete": false,
            "minSelect": 1,
            "maxSelect": 1,
            "displayFields": []
          }
        },
        {
          "id": "rel_ta_question",
          "name": "question",
          "type": "relation",
          "system": false,
          "required": true,
          "presentable": false,
          "unique": false,
          "collectionId": "pbc_4009210445",
          "cascadeDelete": false,
          "minSelect": 1,
          "maxSelect": 1,
          "displayFields": [],
          "options": {
            "collectionId": "pbc_4009210445",
            "cascadeDelete": false,
            "minSelect": 1,
            "maxSelect": 1,
            "displayFields": []
          }
        },
        {
          "id": "text_ta_answer",
          "name": "answer",
          "type": "text",
          "system": false,
          "required": true,
          "presentable": false,
          "unique": false
        },
        {
          "id": "bool_ta_correct",
          "name": "isCorrect",
          "type": "bool",
          "system": false,
          "required": false,
          "presentable": false,
          "unique": false
        }
      ]
    });

    return app.save(teamAnswers);
  },
  (app) => {
    const teamAnswers = app.findCollectionByNameOrId("pbc_4009211005");
    app.delete(teamAnswers);

    const teamMembers = app.findCollectionByNameOrId("pbc_4009211004");
    app.delete(teamMembers);

    const teams = app.findCollectionByNameOrId("pbc_4009211003");
    app.delete(teams);

    const roundQuestions = app.findCollectionByNameOrId("pbc_4009211002");
    app.delete(roundQuestions);

    const rounds = app.findCollectionByNameOrId("pbc_4009211001");
    app.delete(rounds);

    const games = app.findCollectionByNameOrId("pbc_4009211000");
    return app.delete(games);
  }
);
