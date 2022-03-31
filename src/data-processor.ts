import { StringMappingType } from "typescript";

const R         = require('ramda');

function processDataToFormat(data: any[]){
    let outputFormat = R.map((user) => R.reduce(R.concat,'',['Login: ',user.login,
                     ' || Name: ',user.name,
                     ' || Company: ',(user.company || 'Undisclosed')]));
          
    let outputArray = outputFormat(data);
  
    R.map((out) => console.log("##",out))(outputArray)
}

/*function addLanguageList(output: StringMappingType, language: string[]){
    R.reduce()
}*/

export {processDataToFormat}