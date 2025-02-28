
const db = require("../connection")

const format = require('pg-format');

const topicData = require("../data/test-data/topics");
const userData = require("../data/test-data/users");
const articleData = require("../data/test-data/articles");
const commentData = require("../data/test-data/comments");



//const seed = ({ topicData, userData, articleData, commentData }) => {      << the original line!
const seed = () => {

  console.log('Seed function running...');

  return db.query("DROP TABLE IF EXISTS comments;")
    .then(() => { return db.query("DROP TABLE IF EXISTS articles;"); })
    .then(() => { return db.query("DROP TABLE IF EXISTS users;"); })
    .then(() => { return db.query("DROP TABLE IF EXISTS topics;"); })

    .then(() => { return createTable_Topics(); })
    .then(() => { return createTable_Users(); })
    .then(() => { return createTable_Articles(); })
    .then(() => { return createTable_Comments(); })

    .then(() => { return seedTable_Topics(); })
    .then(() => { return seedTable_Users(); });
   // .then(() => { return seedTable_Articles(); });

};

// creates a 'topics' table...
function createTable_Topics() {

  console.log('CREATING topics...');
  return db.query(`CREATE TABLE topics(
    slug VARCHAR(255) PRIMARY KEY, 
    description VARCHAR(255), 
    img_url VARCHAR(1000));`);
}

// creates a 'users' table...
function createTable_Users() {

  console.log('CREATING users...');
  return db.query(`CREATE TABLE users(
    username VARCHAR(255) PRIMARY KEY, 
    name VARCHAR(255) NOT NULL, 
    avatar_url VARCHAR(1000));`);
}

// creates an 'articles' table...
function createTable_Articles() {

  console.log('CREATING articles...');
  return db.query(`CREATE TABLE articles(
    article_id SERIAL PRIMARY KEY,     
    title VARCHAR(255) NOT NULL, 
    topic VARCHAR(255) REFERENCES topics(slug),
    author VARCHAR(255) REFERENCES users(username),
    body TEXT,
    created_at TIMESTAMP,
    votes INT,
    article_img_url VARCHAR(1000));`);
}

// creates a 'comments' table...
function createTable_Comments() {

  console.log('CREATING comments...');
  return db.query(`CREATE TABLE comments(
    comment_id SERIAL PRIMARY KEY, 
    article_id INT REFERENCES articles(article_id),     
    body TEXT,
    votes INT DEFAULT 0,
    author VARCHAR(255) REFERENCES users(username),
    created_at TIMESTAMP);`);
}


// nb. seeding functions...
// based on https://l2c.northcoders.com/courses/sd-notes/back-end#sectionId=seeding,step=intro
// 1. convert the array of objects (topicData, see topics.js) into an array of arrays.
// 2. create the sql query string.
// 3. run the query. 


// seeds the 'topics' table with data from 'topics.js'.
function seedTable_Topics() {

  const dataAsArrOfArr = topicData.map(topic => [topic.description, topic.slug, topic.img_url]);
  const sql = format(`INSERT INTO topics (description, slug, img_url) VALUES %L RETURNING *;`, dataAsArrOfArr);
  db.query(sql).then((result) => { return result; });
}

// seeds the 'users' table with data from 'users.js'.
function seedTable_Users() {

  const dataAsArrOfArr = userData.map(user => [user.username, user.name, user.avatar_url]);
  const sql = format(`INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING *;`, dataAsArrOfArr);
  db.query(sql).then((result) => { return result; });
}

// seeds the 'articles' table with data from 'articles.js'. 
function seedTable_Articles() {

  const dataAsArrOfArr =
    articleData.map(article => [article.title, article.topic, article.author, article.body, article.created_at, article.votes, article.article_img_url]);
  const sql = format(`INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;`, dataAsArrOfArr);
  db.query(sql).then((result) => { return result; });
}







module.exports = seed;
