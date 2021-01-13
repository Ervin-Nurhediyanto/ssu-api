# SSU

[![js-standard-style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](http://standardjs.com)

API for SSU

## STRUCTURE

You can see our structure below to understading and developing this app

### ROOT DIRECTORY

```
•
├── .vscode             # vscode configuration setup
└── src                 # source folder
│   └── config
│   └── database        # database connection setup
│   └── middleware      # custom middleware
│   └── module          # routing, controller, service
│   └── util            # any util helper
|
└── .env                # environment file (uncommited)
└── .env.example        # example .env file
└── server.js           # starting server
```

We are using separation of concern to handle all application logic in each module, instead using global directory for controller, router, etc.

### DATABASE

```
•
└── database
    └── connection.js
    └── migrations
    |   └── <collection_name>.json
    |   └── <collection_name>.json
    |
    └── migrate.js
```

We are using mongodb to handle our database `connection.js` manage our database connection to mongodb database. You can manage database configuration using `.env` or it will used default configuration from `config/database.js`

Before you starting this apps, you need to manage to create collection and adding schema and indexes using MongoDB Compass, you can see all collection schema in `schema directory`

After successfully setup your database, you can run `yarn seed` to seed required data for initial database

### MODULE

```
•
└── module
    └── <module_name>
        └── controllers
        |   └── index.js
        |   └── <method>.js
        |
        └── services
        |   └── index.js
        |   └── <method>.service.js
        |
        └── validations
        |   └── <router_path>.validation.js
        |
        └── router.js
```

All application logic and routing should be inside this module directory. You can imagine this module functionality is to handle each collection in our database.

- `router.js` is an entry point to this module
- **controllers** to handle route request logic
- **services** to handle database logic
- **validations** to handle incoming query params
