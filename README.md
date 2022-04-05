# Typescript Interview Test

## How to run

1. Install postgres & nodejs
2. Create the test database using the `./createdb.sh` script
3. Install the `npm_modules` for this project running `npm install`
4. use `npm run command <command>`. If you input a wrong command, the program will output a help menu.
The commands are the following:

### Commands
    
- newusertable -> Creates a new github_users table (if not existent already)
- newlanguagestable -> Creates a new liked_language table (if not existent already)
- newuser [name] -> Create a new user with name [name] and add it to table github_users
- addlanguage [user_name] [language] -> Add [language] to the list of [user_name]'s liked languages
- listusers  [optional: location] [optional: language] -> List all users in DB. If location is passed, filters by location. If location and language are passed, parses by both filters. Never parses only by language

-----
## Modules

1. db-module.ts ->  Module with the db object configuration and initialization;
2. command-dispatcher.ts -> Entry point of program, and responsible for reading and processing commands;
3. server.ts -> Logic to execute db calls;
4. data-processor -> Processes the data fecthed from the database into information displayed on screen.

-----
## Considerations

1. The method used to accept and process commands needs to be improved in order to accept a more flexible usage of parameters. Something in the likes of C programs accepting --flags. This would allow a more extensible user list filtering mechanism, for example.

2. Had issues when trying to use the Bluebird library when trying to create and use custom promises. Initially the idea was to have a command to create both users and liked languages tables, but ran into problems when trying to create Promises chains with different functions (createUsersTable and createLikedLanguagesTable), and ended giving up.

-----
## Last Question (Challenge 7)

**If the tables become too big / the accesses too slow, what would you do to improve its speed?**

Depending on the available resources and type of load, these are my suggestions to improve the speed:

1. Identify the columns frequently used when filtering data (like location or language) and create Indexes to help retrieving information from the Database.

2. Setup secondary database servers with read-replicas from the original database. This would distribute the load among different servers, which would improve the time to get a response from a server. It would also improve the database availability.

3. Identify if there are popular querys which are frequently executed (like for example the list of users currently in Lisbon), and store the result in some cache system (i.e. memcached). This way, and considering that the database is subject to read-heavy workloads, requests for data would obtain a result from the cache, and didn't need to direct traffic to the database. Having a cache system, the client only needs to contact the database (generating load) if there is a cache miss.