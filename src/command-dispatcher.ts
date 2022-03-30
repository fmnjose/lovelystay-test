const {issueTableCreate, issueUserCreation,getAllUsersByLocation, getUser } = require('./server');

enum commandsList {
    CREATE_TABLE = "newtable",
    ADD_USER = "newuser",
    LIST_USERS_BY_LOCATION = "listbylocation"
}

const args: string[] = (process.argv.slice(2));

function dispatchCommand(command: string[]){
    switch (command[0]) {
        case commandsList.CREATE_TABLE:
            issueTableCreate();
            break;

        case commandsList.ADD_USER:
            if(validCommandArgNumber(command,2))
                issueUserCreation(command[1]);
            break;

        case commandsList.LIST_USERS_BY_LOCATION:
            if(validCommandArgNumber(command,2))
                getAllUsersByLocation(command[1])
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
        "# " + commandsList.CREATE_TABLE + " -> Create a new github_users table\n\n",
        "# " + commandsList.ADD_USER + " <name> -> Create a new user with name <name> and add it to table github_users\n\n",
        "# " + commandsList.LIST_USERS_BY_LOCATION + " <location> -> List all users in DB filtering by the location given\n"
    )
}

dispatchCommand(args)