import {db} from "./db-module";
import {processDataToFormat} from "./data-processor";
const request             = require('request-promise');
const R                   = require('ramda');
const {PreparedStatement: PS}   = require('pg-promise');

const USERS_TABLE_NAME: string = "github_users";
const LIKED_LANGUAGES_NAME: string = "liked_languages";

//Interface for the user objects
interface GithubUsers{ 
  id : number,
  login: string,
  name: string,
  location: string,
  company: string,
  followers: number
};

/**Creates the table with name USERS_TABLE_NAME to store users*/
const createUsersTable = () => {
  db.none(`CREATE TABLE ${USERS_TABLE_NAME} (
          id BIGSERIAL PRIMARY KEY, 
          login TEXT UNIQUE, 
          name TEXT, 
          location TEXT,
          company TEXT, 
          followers INT)`)
    .catch((e: Error) => {
      errorHandler(e);
    })
    .then(() => process.exit(0));
}

/**Creates the table with name LIKED_LANGUAGES_NAME to store
 * the relationship between users and languages they like
 */
const createLikedLanguagesTable = () => {
  db.none(`CREATE TABLE ${LIKED_LANGUAGES_NAME} (
          id SERIAL PRIMARY KEY, 
          user_id INT REFERENCES ${USERS_TABLE_NAME}(id), 
          language TEXT NOT NULL, 
          UNIQUE (user_id, language))`)
    .catch((e: Error) => {
      errorHandler(e);
    })
    .then(() => process.exit(0))
}

/**
 * Adds a new entry in LIKED_LANGUAGES_NAME to represent a <language>
 * that the <user> likes
 * @param user Login of the user
 * @param language language name
 */
const addLikedLanguage = (user: string, language: string) => {
  let addLanguage = new PS({
      name: 'addLanguage',
      text: `INSERT INTO ${LIKED_LANGUAGES_NAME} (user_id,language) 
            VALUES ((SELECT id FROM ${USERS_TABLE_NAME} WHERE login = $1), $2) 
            RETURNING id`,
      values: [user, language]
    });
  
  db.one(addLanguage)
    .then(({id}) => console.log("ID: %i | User: %s | Language: %s", id, user, language))
    .catch((e: Error) => {
      errorHandler(e);
    })
    .then(() => process.exit(0));
}

/**
 * Creates a new user. It fetches all information from the github API:
 * https://api.github.com/users/<userLogin>
 * @param userLogin User login
 */
const createUser = (userLogin: string) => {
  let createUser = new PS({
    name: 'createUser',
    text: `INSERT INTO ${USERS_TABLE_NAME} (login,name,location,company,followers) 
           VALUES ($1,$2,$3,$4,$5) 
           RETURNING id`});
  request({
    uri: `https://api.github.com/users/${userLogin}`,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true
  }).then((data: GithubUsers) => {
    createUser.values = [data.login,data.name,data.location,data.company,data.followers];
    
    return db.one(createUser);

  }).then(({id}) => console.log(id))
    .catch((e: Error) => {
      console.log("[ERROR] " + e.message);
    })
    .then(() => process.exit(0));
}
    
/**
 * List users. If no arguments are passed, list all users registerd.
 * If location is defined, list all users filtered by location
 * If location and language are both defined, list all users filtered by location and language
 * It is not possible to only filter by language
 * @param location [OPTIONAL] User location
 * @param language [OPTIONAL] Language name
 */
const getUsers = (location?: string, language?: string) => {
  if(location && language)
    getUsersByLocationAndLanguage(location,language);
  else if(location)
    getUsersByLocation(location)
  else
    getAllUsers();
}
 
/**
 * List all users. Should be called ONLY by getUsers
 */
const getAllUsers = () => {
  db.any(`SELECT * FROM ${USERS_TABLE_NAME} LEFT JOIN ${LIKED_LANGUAGES_NAME}
          ON user_id = ${USERS_TABLE_NAME}.id`)
    .then((data: any[]) => {
      console.log("\nList of users:\n");
      processDataToFormat(data)
    })
    .catch((e: Error) => {
      errorHandler(e);
    })
    .then(() => process.exit(0));
}

/**
 * List all users filtering by location. Should be called ONLY by getUsers
 */
const getUsersByLocation = (location: string) => {
  let userByLocation = new PS({
    name: 'userByLocation',
    text: `SELECT * FROM ${USERS_TABLE_NAME} LEFT JOIN ${LIKED_LANGUAGES_NAME}
           ON user_id = ${USERS_TABLE_NAME}.id 
           WHERE location = $1`,
    values: [location]
  });

  db.any(userByLocation)
  .then((data: any[]) => {
    console.log("\nList of users in", location, ":\n");
    processDataToFormat(data)
  })
  .catch((e: Error) => {
    errorHandler(e);
  })
  .then(() => process.exit(0));
}

/**
 * List all users filtering by location and language. Should be called ONLY by getUsers
 */
const getUsersByLocationAndLanguage = (location: string, language: string) => {
  let userByLocationLanguage = new PS({
    name: 'userByLocationLanguage',
    text: `SELECT * FROM ${USERS_TABLE_NAME} INNER JOIN ${LIKED_LANGUAGES_NAME} 
           ON user_id = ${USERS_TABLE_NAME}.id
           WHERE user_id in (SELECT user_id FROM ${USERS_TABLE_NAME} INNER JOIN ${LIKED_LANGUAGES_NAME}
           ON user_id = ${USERS_TABLE_NAME}.id 
           WHERE location = $1 AND language = $2)`,
    values: [location,language]
  });

  db.any(userByLocationLanguage)
  .then((data: any[]) => {
    console.log("\nList of users in", location, " who like", language, "\n");
    processDataToFormat(data)
  })
  .catch((e: Error) => {
    errorHandler(e);
  })
  .then(() => process.exit(0));
}

/**
 * Function to handle errors thrown by exceptions and catched by other functions
 * @param e Error
 */
const errorHandler = (e: Error) => {
  console.log("[ERROR] " + e.message);
}

export {createUsersTable, createLikedLanguagesTable, createUser, getUsers, addLikedLanguage}
