/*
 seed.js - a Northcoders sprint exercise in seeding database tables.

 Stewart Wilson, March 2025.

 nb. to run tests...
 npm test __tests__/seed.test.js 

 TODO: all tests pass but not every simgle time? it seemed sketchy for a while but seems ok now.
*/

const db = require("../connection")
const format = require('pg-format');


const seed = ({ topicData, userData, articleData, commentData }) => {

  console.log('Seed function running...');

  return db.query("DROP TABLE IF EXISTS comments;")
    .then(() => { return db.query("DROP TABLE IF EXISTS articles;"); })
    .then(() => { return db.query("DROP TABLE IF EXISTS users;"); })
    .then(() => { return db.query("DROP TABLE IF EXISTS topics;"); })

    .then(() => { return createTable_Topics(); })
    .then(() => { return createTable_Users(); })
    .then(() => { return createTable_Articles(); })
    .then(() => { return createTable_Comments(); })

    .then(() => { return seedTable_Topics(topicData); })
    .then(() => { return seedTable_Users(userData); })
    .then(() => { return seedTable_Articles(articleData); })
    .then(() => { return seedTable_Comments(commentData); })
};

// creates a 'topics' table...
function createTable_Topics() {

  console.log('Creating table - topics...');
  return db.query(`CREATE TABLE topics(
    slug VARCHAR(255) PRIMARY KEY, 
    description VARCHAR(255), 
    img_url VARCHAR(1000));`);
}

// creates a 'users' table...
function createTable_Users() {

  console.log('Creating table - users...');
  return db.query(`CREATE TABLE users(
    username VARCHAR(255) PRIMARY KEY, 
    name VARCHAR(255) NOT NULL, 
    avatar_url VARCHAR(1000));`);
}

// creates an 'articles' table...
function createTable_Articles() {

  console.log('Creating table - articles...');
  return db.query(`CREATE TABLE articles(
    article_id SERIAL PRIMARY KEY,     
    title VARCHAR(255) NOT NULL, 
    topic VARCHAR(255) REFERENCES topics(slug),
    author VARCHAR(255) REFERENCES users(username),
    body TEXT,
    created_at TIMESTAMP,
    votes INT DEFAULT 0,
    article_img_url VARCHAR(1000));`);
}

// creates a 'comments' table...
function createTable_Comments() {

  console.log('Creating table - comments...');
  return db.query(`CREATE TABLE comments(
    comment_id SERIAL PRIMARY KEY, 
    article_id INT REFERENCES articles(article_id),    
    article_title VARCHAR(255), 
    body TEXT,
    votes INT DEFAULT 0,
    author VARCHAR(255) REFERENCES users(username),
    created_at TIMESTAMP);`);
}


// nb. seeding functions...
// based on https://l2c.northcoders.com/courses/sd-notes/back-end#sectionId=seeding,step=intro
// 1. convert the array of objects (ie. topicData, see topics.js) into an array of arrays.
// 2. create the sql query string.
// 3. run the query. 


// seeds the 'topics' table with the specified data (from 'topics.js').
function seedTable_Topics(topicData) {

  const dataAsArrOfArr = topicData.map(topic =>
    [
      topic.description,
      topic.slug,
      topic.img_url
    ]);

  const sql = format(`INSERT INTO topics (description, slug, img_url) VALUES %L RETURNING *;`, dataAsArrOfArr);
  db.query(sql).then((result) => { return result; });
}

// seeds the 'users' table with the specified data (from 'users.js').
function seedTable_Users(userData) {

  const dataAsArrOfArr = userData.map(user =>
    [
      user.username,
      user.name,
      user.avatar_url
    ]);

  const sql = format(`INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING *;`, dataAsArrOfArr);
  db.query(sql).then((result) => { return result; });
}


// seeds the 'articles' table with the specified data (from 'articles.js'). 
function seedTable_Articles(articleData) {

  const dataAsArrOfArr = articleData.map(article =>
    [
      article.title,
      article.topic,
      article.author,
      article.body,
      new Date(article.created_at),
      article.votes,
      article.article_img_url
    ]);

  const sql = format(`INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;`, dataAsArrOfArr);
  db.query(sql).then((result) => { return result; });
}

// seeds the 'comments' table with the specified data (from 'comments.js'). 
function seedTable_Comments(commentData) {

  const dataAsArrOfArr = commentData.map(comment =>
    [
      comment.article_title,
      comment.body,
      comment.votes,
      comment.author,
      new Date(comment.created_at)
    ]);

  const sql = format(`INSERT INTO comments (article_title, body, votes, author, created_at) VALUES %L RETURNING *;`, dataAsArrOfArr);
  db.query(sql).then((result) => { return result; });
}


module.exports = seed;
