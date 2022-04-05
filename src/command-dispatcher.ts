const {
    createUsersTable, 
    createUser, 
    createLikedLanguagesTable, 
    addLikedLanguage, 
    getUsers
} = require("./server");

/* Static object with all the commands available
*  and respective instructions
*/
class Command{
    static readonly CREATE_USER_TABLE = new Command("newusertable", 
            ` -> Creates a new github_users table (if not existent already)`);

    static readonly CREATE_LANGUAGES_TABLE = new Command("newlanguagestable", 
            ` -> Creates a new liked_language table (if not existent already)`);

    static readonly ADD_USER = new Command("newuser", 
            ` <name> -> Create a new user with name <name> and add it to table github_users`);

    static readonly ADD_LIKED_LANGUAGE = new Command("addlanguage", 
            ` <user_name> <language> -> Add <language> to the list of <user_name>'s liked languages`);

    static readonly LIST_USERS = new Command("listusers", 
            ` [optional: location] [optional: language] -> List all users in DB.
                If location is passed, filters by location. If location and language are passed,
                parses by both filters. Never parses only by language`);

    static readonly COMMAND_LIST = [this.CREATE_USER_TABLE,
                                   this.CREATE_LANGUAGES_TABLE,
                                   this.ADD_USER,
                                   this.ADD_LIKED_LANGUAGE,
                                   this.LIST_USERS];

    private constructor(private readonly commandstring: string, public readonly description: any){
    }

    toString(){
        return `# ${this.commandstring} ${this.description}\n\n`;
    }

    command_string(){
        return this.commandstring;
    }
}

//arguments passed with the command
const args: string[] = (process.argv.slice(2));

/* Entry point of the program.
   Processes the commands received and calls
   server functions
 */
function dispatchCommand(command: string[]): Promise<any>{
    switch (command[0]) {
        case Command.CREATE_USER_TABLE.command_string():
            return createUsersTable();
            
        case Command.CREATE_LANGUAGES_TABLE.command_string():
            return createLikedLanguagesTable();

        case Command.ADD_USER.command_string():
            if(validCommandArgNumber(command,2))
                return createUser(command[1])
                        .then(() => { return getUsers()});
            break;
            
        case Command.ADD_LIKED_LANGUAGE.command_string():
            if(validCommandArgNumber(command,3))
                return addLikedLanguage(command[1], command[2])
                        .then(() => { return getUsers()});
            break;

        case Command.LIST_USERS.command_string():
            if(command.length == 1) 
                return getUsers();
            else if(command.length == 2)        //Location passed. List filtering by location 
                return getUsers(command[1]);
            else                                //Location and language passed. List filtering by location and language
                return getUsers(command[1], command[2]);

        default:
            return new Promise((resolve) => {
                printHelp();
                resolve;
            });
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
    Command.COMMAND_LIST.forEach((command) => console.log(command.toString()));

    /*console.log(
        "Please use one of the following commands:\n\n",
        "# " + commandsList.CREATE_USER_TABLE + " -> Creates a new github_users table (if not existent already)\n\n",
        "# " + commandsList.CREATE_LANGUAGES_TABLE + " -> Creates a new liked_language table (if not existent already)\n\n",
        "# " + commandsList.ADD_USER + " <name> -> Create a new user with name <name> and add it to table github_users\n\n",
        "# " + commandsList.ADD_LIKED_LANGUAGE + " <user_name> <language> -> Add <language> to the list of <user_name>'s liked languages\n\n",
        "# " + commandsList.LIST_USERS + " [optional: location] [optional: language] -> List all users in DB. If location is passed, filters by location. If location and language are passed, parses by both filters. Never parses only by language\n"
    )*/
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