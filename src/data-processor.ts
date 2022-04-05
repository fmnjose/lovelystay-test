const R         = require('ramda');

/**
 * Parses users objects and outputs a formatted string.
 * Called by other functions when wanting to output the result of a query
 * @param data User objects to parse
 */
const processDataToFormat = (data: any[]) =>{
    let processedUsers = {};
    let outputFormat = R.map((user) => userOutputFormat(user, processedUsers, data));                            
          
    let outputArray = R.filter((line) => line != "",outputFormat(data));
  
    R.map((out) => console.log("##",out)) (outputArray);
}

/**
 * Parses the data to compile all languages a user likes
 * @param userLogin User login
 * @param usersList List of the users objects
 * @returns String with formatted list of liked languages
 */
const languageByUser = (userLogin: string, usersList: any[]) => {
    let languages = "";
    let getLanguageOnMatch = (u) => {
            if(u.login == userLogin && u.language != null)
                languages += u.language + " ";
        };
    
    usersList.forEach((user) => getLanguageOnMatch(user));

    return languages;
}


/**
 * Parses a user information into a single line that can be printed
 * @param user User login
 * @param processedUsers List of already processed users
 * @param data Object with the data, so the languages liked by the user can be parsed
 * @returns 
 */
const userOutputFormat = (user: any, processedUsers: any, data: any) => {
    if(!R.has(user.login, processedUsers)){
        processedUsers[user.login] = true;
        return R.reduce(R.concat,'',['Login: ',user.login,
        ' || Name: ',user.name,
        ' || Location: ', (user.location || 'Undisclosed'),
        ' || Company: ',(user.company || 'Undisclosed'),
        ' || Liked Languages: ', languageByUser(user.login,data)]);
    }
    else
        return "";
}

export {processDataToFormat}