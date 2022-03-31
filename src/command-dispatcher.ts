const {createUsersTable, createUser, createLikedLanguagesTable, addLikedLanguage, getUsersByLocation} = require('./server');

enum commandsList {
    CREATE_USER_TABLE = "newusertable",
    CREATE_LANGUAGES_TABLE = "newlanguagestable",
    ADD_USER = "newuser",
    ADD_LIKED_LANGUAGE = "addlanguage",
    GET_USER = "getUser",
    LIST_USERS_BY_LOCATION = "listbylocation"
}

const args: string[] = (process.argv.slice(2));

function dispatchCommand(command: string[]){
    switch (command[0]) {
        case commandsList.CREATE_USER_TABLE:
            createUsersTable();
            break;

        case commandsList.CREATE_LANGUAGES_TABLE:
            createLikedLanguagesTable();
            break;

        case commandsList.ADD_USER:
            if(validCommandArgNumber(command,2))
                createUser(command[1]);
            break;

        case commandsList.ADD_LIKED_LANGUAGE:
            if(validCommandArgNumber(command,3))
                addLikedLanguage(command[1], command[2])
            break;
        
        case commandsList.LIST_USERS_BY_LOCATION:
            if(validCommandArgNumber(command,2))
                getUsersByLocation(command[1])
        default:
            printHelp();
            break;
    }
}

function validCommandArgNumber(command: string[], requiredNumber: number){
    let valid: boolean = command.length >= requiredNumber

    if(!valid) printHelp();
    
    return valid
}

function printHelp(){
    console.log(
        "Please use one of the following commands:\n\n",
        "# " + commandsList.CREATE_USER_TABLE + " -> Creates a new github_users table (if not existent already)\n\n",
        "# " + commandsList.CREATE_LANGUAGES_TABLE + " -> Creates a new liked_language table (if not existent already)\n\n",
        "# " + commandsList.ADD_USER + " <name> -> Create a new user with name <name> and add it to table github_users\n\n",
        "# " + commandsList.ADD_LIKED_LANGUAGE + " <user_name> <language> -> Add <language> to the list of <user_name>'s liked languages\n\n",
        "# " + commandsList.LIST_USERS_BY_LOCATION + " <location> -> List all users in DB filtering by the location given\n"
    )
}

dispatchCommand(args)