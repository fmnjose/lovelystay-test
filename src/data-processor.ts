const R         = require('ramda');

function processDataToFormat(data: any[]){
    let processedUsers = {};
    let outputFormat = R.map((user) => {
                            if(!R.has(user.login, processedUsers)){
                                processedUsers[user.login] = true;
                                return R.reduce(R.concat,'',['Login: ',user.login,
                                ' || Name: ',user.name,
                                ' || Company: ',(user.company || 'Undisclosed'),
                                ' || Liked Languages: ', languageByUser(user.login,data)]);
                            }
                            else
                                return "";
                        });                            
          
    let outputArray = R.filter((line) => line != "",outputFormat(data));
  
    R.map((out) => console.log("##",out))(outputArray);
}

function languageByUser(userLogin: string, usersList: any[]){
    let languages = "";
    let getLanguageOnMatch = (u) => {
            if(u.login == userLogin)
                languages += u.language + " ";
        };
    
    R.map((user) => {getLanguageOnMatch(user)},usersList);

    return languages;
}

export {processDataToFormat}