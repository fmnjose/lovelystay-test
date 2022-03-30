const request             = require('request-promise');
const R                   = require('ramda');
const db                  = require("./db-module");
const processDataToFormat = require("./data-processor");

interface GithubUsers{ 
  id : number,
  login: string,
  name: string,
  location: string,
  company: string,
  followers: number
};

const issueTableCreate = () => {
  db.none(`CREATE TABLE github_users (id BIGSERIAL PRIMARY KEY, login TEXT UNIQUE, name TEXT, location TEXT,company TEXT, followers INT)`)
  .catch((e: Error) => {
    console.log("[ERROR] " + e.message);
  })
  .then(() => process.exit(0))
}

const issueUserCreation = (userName: string) => {
  request({
    uri: `https://api.github.com/users/${userName}`,
    headers: {
          'User-Agent': 'Request-Promise'
      },
    json: true
  }).then((data: GithubUsers) => db.one(
    'INSERT INTO github_users (login,name,location,company,followers) VALUES ($[login],$[name],$[location],$[company],$[followers]) RETURNING id', data)
  ).then(({id}) => console.log(id))
  .catch((e: Error) => {
    console.log("[ERROR] " + e.message);
  })
  .then(() => process.exit(0));
}

const getAllUsersByLocation = (location: string) => {
  db.any(`SELECT * FROM github_users WHERE location = $1`, location)
  .then((data: any[]) => {
    console.log("\nList of users in", location, ":")
    processDataToFormat(data);
  })
  .catch((e: Error) => {
    console.log("[ERROR] " + e.message);
  })
  .then(() => process.exit(0));
}

export {issueTableCreate, issueUserCreation, getAllUsersByLocation}
