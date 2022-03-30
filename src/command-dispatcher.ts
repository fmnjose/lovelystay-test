import './server';
import { issueTableCreate, issueUserCreation } from './server';

enum commandsList {
    CREATE_TABLE = "newtable",
    ADD_FIELD = "newfield",
    ADD_USER = "newuser",
    LIST_USERS = "listusers"
}

const args: string[] = (process.argv.slice(2));

function dispatchCommand(command: string[]){
    switch (command[0]) {
        case commandsList.CREATE_TABLE:
            issueTableCreate();
            break;

        case commandsList.ADD_FIELD:
            break;

        case commandsList.ADD_USER:
            if(validCommandArgNumber(command,2))
                issueUserCreation(command[1]);
            break;

        case commandsList.LIST_USERS:
            break;
            
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
        "# " + commandsList.ADD_FIELD + " <field_name> -> Create a new field with name <field_name> on the github_users table\n\n",
        "# " + commandsList.ADD_USER + " <name> -> Create a new user with name <name> and add it to table github_users\n\n",
        "# " + commandsList.LIST_USERS + " -> List all users in github_users table\n"
    )
}

dispatchCommand(args)