const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

let axios;
try {
  axios = require('axios');
} catch (error) {
  axios = null;
}

const findBooksByField = (field, value) => {
  const searchValue = String(value).toLowerCase();
  const result = {};

  Object.keys(books).forEach((isbn) => {
    if (String(books[isbn][field]).toLowerCase() === searchValue) {
      result[isbn] = books[isbn];
    }
  });

  return result;
};

public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: 'User already exists!' });
  }

  users.push({ username, password });
  return res.status(200).json({ message: 'User successfully registered. Now you can login' });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }

  return res.status(404).json({ message: 'Book not found.' });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const result = findBooksByField('author', req.params.author);

  if (Object.keys(result).length > 0) {
    return res.status(200).json(result);
  }

  return res.status(404).json({ message: 'No books found for this author.' });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const result = findBooksByField('title', req.params.title);

  if (Object.keys(result).length > 0) {
    return res.status(200).json(result);
  }

  return res.status(404).json({ message: 'No books found with this title.' });
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  const reviews = books[isbn].reviews || {};
  if (Object.keys(reviews).length === 0) {
    return res.status(200).json({ message: 'No reviews found for this book.' });
  }

  return res.status(200).json(reviews);
});

// Task 10: Get all books using Promise callbacks or async/await with Axios.
const getAllBooksUsingAsync = async () => {
  if (axios) {
    const response = await axios.get('http://localhost:5000/');
    return response.data;
  }
  return Promise.resolve(books);
};

// Task 11: Get book details by ISBN using Promise callbacks or async/await with Axios.
const getBookByISBNUsingAsync = async (isbn) => {
  if (axios) {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return response.data;
  }
  return Promise.resolve(books[isbn]);
};

// Task 12: Get book details by Author using Promise callbacks or async/await with Axios.
const getBookByAuthorUsingAsync = async (author) => {
  if (axios) {
    const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
    return response.data;
  }
  return Promise.resolve(findBooksByField('author', author));
};

// Task 13: Get book details by Title using Promise callbacks or async/await with Axios.
const getBookByTitleUsingAsync = async (title) => {
  if (axios) {
    const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
    return response.data;
  }
  return Promise.resolve(findBooksByField('title', title));
};

module.exports.general = public_users;
module.exports.getAllBooksUsingAsync = getAllBooksUsingAsync;
module.exports.getBookByISBNUsingAsync = getBookByISBNUsingAsync;
module.exports.getBookByAuthorUsingAsync = getBookByAuthorUsingAsync;
module.exports.getBookByTitleUsingAsync = getBookByTitleUsingAsync;

// Explicit Task 10-13 implementations using Axios, Promises, and async/await

async function task10_getAllBooksUsingAsyncAwait() {
  try {
    const response = await axios.get('http://localhost:5000/');
    return response.data;
  } catch (error) {
    return error.message;
  }
}

function task11_getBookByISBNUsingPromise(isbn) {
  return new Promise((resolve, reject) => {
    axios.get(`http://localhost:5000/isbn/${isbn}`)
      .then(response => resolve(response.data))
      .catch(error => reject(error));
  });
}

async function task12_getBooksByAuthorUsingAsyncAwait(author) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
}

async function task13_getBooksByTitleUsingAsyncAwait(title) {
  try {
    const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
}

module.exports.task10_getAllBooksUsingAsyncAwait = task10_getAllBooksUsingAsyncAwait;
module.exports.task11_getBookByISBNUsingPromise = task11_getBookByISBNUsingPromise;
module.exports.task12_getBooksByAuthorUsingAsyncAwait = task12_getBooksByAuthorUsingAsyncAwait;
module.exports.task13_getBooksByTitleUsingAsyncAwait = task13_getBooksByTitleUsingAsyncAwait;
