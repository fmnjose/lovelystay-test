import {db} from "./db-module";
const request = require('request-promise');

interface GithubUsers{ 
  id : number
};

const issueTableCreate = () => {
  db.none(`CREATE TABLE github_users (id BIGSERIAL PRIMARY KEY, login TEXT UNIQUE, name TEXT, company TEXT)`)
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
    'INSERT INTO github_users (login) VALUES ($[login]) RETURNING id', data)
  ).then(({id}) => console.log(id))
  .catch((e: Error) => {
    console.log("[ERROR] " + e.message);
  })
  .then(() => process.exit(0));
}

export {issueTableCreate, issueUserCreation}
