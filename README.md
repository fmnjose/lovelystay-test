# Typescript Interview Test
4. Run `npm run test` to get the program running (modify the user and password if needed)
5. Examine the typescript code under `server.ts`

## How to run

1. Install postgres & nodejs
2. Create the test database using the `./createdb.sh` script
3. Install the `npm_modules` for this project running `npm install`
4. use `npm run command <command>`. If you input a wrong command, the program will output a help menu.
The commands are the following:

### Commands
    
- newusertable -> Creates a new github_users table (if not existent already)
- newlanguagestable -> Creates a new liked_language table (if not existent already)
- newuser <name> -> Create a new user with name <name> and add it to table github_users
- addlanguage <user_name> <language> -> Add <language> to the list of <user_name>'s liked languages
- listusers  [optional: location] [optional: language] -> List all users in DB. If location is passed, filters by location. If location and language are passed, parses by both filters. Never parses only by language

-----
