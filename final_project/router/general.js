const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

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

// Task 1 and Task 10 - Get all books
// Task 10 uses async callback function with Axios.
public_users.get('/', async (req, res) => {
  try {
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Task 2 and Task 11 - Get book details based on ISBN
// Task 11 uses Promise callbacks.
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  return new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ message: "Book not found" });
    }
  })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json(error));
});

// Task 3 and Task 12 - Get books by author
// Task 12 uses async/await.
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

// Task 4 and Task 13 - Get books by title
// Task 13 uses async/await.
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

// Task 5 - Get book reviews
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews || {});
  }

  return res.status(404).json({ message: "Book not found" });
});


// Task 10 - Using async callback function, retrieve all books with Axios
async function getAllBooks(callback) {
  try {
    const response = await axios.get("http://localhost:5000/");
    callback(null, response.data);
  } catch (error) {
    callback(error, null);
  }
}

// Task 11 - Get book details based on ISBN using Promise callbacks with Axios
function getBookDetailsByISBN(isbn) {
  return new Promise((resolve, reject) => {
    axios.get(`http://localhost:5000/isbn/${isbn}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// Task 12 - Get book details based on author using async/await with Axios
async function getBookDetailsByAuthor(author) {
  try {
    const response = await axios.get(
      `http://localhost:5000/author/${encodeURIComponent(author)}`
    );
    return response.data;
  } catch (error) {
    return error.message;
  }
}

// Task 13 - Get book details based on title using async/await with Axios
async function getBookDetailsByTitle(title) {
  try {
    const response = await axios.get(
      `http://localhost:5000/title/${encodeURIComponent(title)}`
    );
    return response.data;
  } catch (error) {
    return error.message;
  }
}

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBookDetailsByISBN = getBookDetailsByISBN;
module.exports.getBookDetailsByAuthor = getBookDetailsByAuthor;
module.exports.getBookDetailsByTitle = getBookDetailsByTitle;
