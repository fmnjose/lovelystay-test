import {createUsersTable, createUser, createLikedLanguagesTable, 
    addLikedLanguage, getUsers} from "./server";
    
//Enumerator with all the commands available
enum commandsList {
    CREATE_USER_TABLE = "newusertable",
    CREATE_LANGUAGES_TABLE = "newlanguagestable",
    ADD_USER = "newuser",
    ADD_LIKED_LANGUAGE = "addlanguage",
    LIST_USERS = "listusers"
}

//arguments passed with the command
const args: string[] = (process.argv.slice(2));

/* Entry point of the program.
   Processes the commands received and calls
   server functions
 */
function dispatchCommand(command: string[]){
    switch (command[0]) {
        case commandsList.CREATE_USER_TABLE:
            return createUsersTable();
            
        case commandsList.CREATE_LANGUAGES_TABLE:
            return createLikedLanguagesTable();

        case commandsList.ADD_USER:
            if(validCommandArgNumber(command,2))
                return createUser(command[1])
                        .then(() => { return getUsers()});
        
        case commandsList.ADD_LIKED_LANGUAGE:
            if(validCommandArgNumber(command,3))
                return addLikedLanguage(command[1], command[2])
                        .then(() => { return getUsers()});

        case commandsList.LIST_USERS:
            if(command.length == 1) 
                return getUsers();
            else if(command.length == 2)        //Location passed. List filtering by location 
                return getUsers(command[1]);
            else                                //Location and language passed. List filtering by location and language
                return getUsers(command[1], command[2]);

        default:
            printHelp();
            break;
    }
}

/* Checks if enough arguments are being passed to the command 
   (the ones that need additional information)
*/
function validCommandArgNumber(command: string[], requiredNumber: number){
    let valid: boolean = command.length >= requiredNumber

    if(!valid) printHelp();
    
    return valid
}

/* Prints information abou the available commands.
   If the user inputs a wrong commands, this is printed
 */
function printHelp(){
    console.log(
        "Please use one of the following commands:\n\n",
        "# " + commandsList.CREATE_USER_TABLE + " -> Creates a new github_users table (if not existent already)\n\n",
        "# " + commandsList.CREATE_LANGUAGES_TABLE + " -> Creates a new liked_language table (if not existent already)\n\n",
        "# " + commandsList.ADD_USER + " <name> -> Create a new user with name <name> and add it to table github_users\n\n",
        "# " + commandsList.ADD_LIKED_LANGUAGE + " <user_name> <language> -> Add <language> to the list of <user_name>'s liked languages\n\n",
        "# " + commandsList.LIST_USERS + " [optional: location] [optional: language] -> List all users in DB. If location is passed, filters by location. If location and language are passed, parses by both filters. Never parses only by language\n"
    )
}

/**
 * Function to handle errors thrown by exceptions and catched by other functions
 * @param e Error
 */
const errorHandler = (e: Error) => {
    console.log("[ERROR] " + e.message);
}

dispatchCommand(args)
.catch((e: Error) => errorHandler(e))
.then(() => process.exit(0));