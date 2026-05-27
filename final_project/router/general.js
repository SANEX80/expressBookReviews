const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();
const API_BASE_URL = "http://localhost:5000";

// Task 6 - Register new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Task 1 - Get all books
public_users.get('/', async (req, res) => {
  try {
    const allBooks = await Promise.resolve(books);
    return res.status(200).json(allBooks);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Task 2 - Get book by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  return Promise.resolve(books[isbn])
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      return res.status(200).json(book);
    })
    .catch(() => res.status(500).json({ message: "Error retrieving book" }));
});

// Task 3 - Get books by author
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = decodeURIComponent(req.params.author).toLowerCase();

    const filteredBooks = Object.fromEntries(
      Object.entries(books).filter(([isbn, book]) =>
        book.author.toLowerCase() === author
      )
    );

    return res.status(200).json(filteredBooks);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by author" });
  }
});

// Task 4 - Get books by title
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = decodeURIComponent(req.params.title).toLowerCase();

    const filteredBooks = Object.fromEntries(
      Object.entries(books).filter(([isbn, book]) =>
        book.title.toLowerCase() === title
      )
    );

    return res.status(200).json(filteredBooks);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by title" });
  }
});

// Task 5 - Get book review
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(books[isbn].reviews || {});
});


// Task 10 - Get all books using async callback / async-await with Axios
async function getAllBooksUsingAxiosAsyncAwait() {
  try {
    const response = await axios.get(`${API_BASE_URL}/`);
    return response.data;
  } catch (error) {
    return error.message;
  }
}

// Task 11 - Get book details based on ISBN using Promise callbacks with Axios
function getBookByISBNUsingAxiosPromise(isbn) {
  return new Promise((resolve, reject) => {
    axios.get(`${API_BASE_URL}/isbn/${isbn}`)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error.message));
  });
}

// Task 12 - Get book details based on Author using async-await with Axios
async function getBooksByAuthorUsingAxiosAsyncAwait(author) {
  try {
    const response = await axios.get(`${API_BASE_URL}/author/${encodeURIComponent(author)}`);
    return response.data;
  } catch (error) {
    return error.message;
  }
}

// Task 13 - Get book details based on Title using Promise callbacks with Axios
function getBooksByTitleUsingAxiosPromise(title) {
  return new Promise((resolve, reject) => {
    axios.get(`${API_BASE_URL}/title/${encodeURIComponent(title)}`)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error.message));
  });
}

module.exports.general = public_users;
module.exports.getAllBooksUsingAxiosAsyncAwait = getAllBooksUsingAxiosAsyncAwait;
module.exports.getBookByISBNUsingAxiosPromise = getBookByISBNUsingAxiosPromise;
module.exports.getBooksByAuthorUsingAxiosAsyncAwait = getBooksByAuthorUsingAxiosAsyncAwait;
module.exports.getBooksByTitleUsingAxiosPromise = getBooksByTitleUsingAxiosPromise;
