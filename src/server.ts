import {db} from "./db-module";
import {processDataToFormat} from "./data-processor";
const request             = require('request-promise');
const R                   = require('ramda');

const USERS_TABLE_NAME: string = "github_users";
const LIKED_LANGUAGES_NAME: string = "liked_languages";

interface GithubUsers{ 
  id : number,
  login: string,
  name: string,
  location: string,
  company: string,
  followers: number
};

const createUsersTable = () => {
  db.none(`CREATE TABLE ${USERS_TABLE_NAME} (id BIGSERIAL PRIMARY KEY, login TEXT UNIQUE, name TEXT, location TEXT,company TEXT, followers INT)`)
  .catch((e: Error) => {
    errorHandler(e);
  })
  .then(() => process.exit(0))
}

const createLikedLanguagesTable = () => {
  db.none(`CREATE TABLE ${LIKED_LANGUAGES_NAME} (id SERIAL PRIMARY KEY, user_id INT NOT NULL, language TEXT NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES ${USERS_TABLE_NAME}(id))`)
  .catch((e: Error) => {
    errorHandler(e);
  })
  .then(() => process.exit(0))
}

const errorHandler = (e: Error) => {
  console.log("[ERROR] " + e.message);
}

const addLikedLanguage = (user: string, language: string) => {
  db.one(
    `INSERT INTO ${LIKED_LANGUAGES_NAME} (user_id,language) VALUES 
    ((SELECT id FROM ${USERS_TABLE_NAME} WHERE login = '${user}'), '${language}') RETURNING id`
  )
  .then(({id}) => console.log("ID: %i | User: %s | Language: %s", id, user, language))
  .catch((e: Error) => {
    console.log("[ERROR] " + e.message);
  })
  .then(() => process.exit(0));
}

const createUser = (userName: string) => {
  request({
    uri: `https://api.github.com/users/${userName}`,
    headers: {
          'User-Agent': 'Request-Promise'
      },
    json: true
  }).then((data: GithubUsers) => db.one(
    `INSERT INTO ${USERS_TABLE_NAME} (login,name,location,company,followers) VALUES ($[login],$[name],$[location],$[company],$[followers]) RETURNING id`, data)
  ).then(({id}) => console.log(id))
  .catch((e: Error) => {
    console.log("[ERROR] " + e.message);
  })
  .then(() => process.exit(0));
}

/*const getAllUsers = (location?: string, language?: string) => {
  try {
    if(location && language)
      getUsersByLocationAndLanguage(location,language);
    else if(location)
      getUsersByLocation(location)
    else if(language)
      console.log("test")
  } catch (error) {
    
  }
}*/

/*const getUsersByLocationAndLanguage = (location: string, language: string) => {

}

const getUsersByLanguage = (language: string) => {
  db.any(`SELECT * FROM ${USERS_TABLE_NAME} WHERE location = $1`, location)
  .then((data: any[]) => {
    console.log("\nList of users in", location, ":\n");
    processDataToFormat(data)
  })
  .catch((e: Error) => {
    console.log("[ERROR] " + e.message);
  })
  .then(() => process.exit(0));
}*/

const getUsersByLocation = (location: string) => {
  db.any(`SELECT * FROM ${USERS_TABLE_NAME} WHERE location = $1`, location)
  .then((data: any[]) => {
    console.log("\nList of users in", location, ":\n");
    processDataToFormat(data)
  })
  .catch((e: Error) => {
    console.log("[ERROR] " + e.message);
  })
  .then(() => process.exit(0));
}

export {createUsersTable, createLikedLanguagesTable, createUser, getUsersByLocation, addLikedLanguage}
