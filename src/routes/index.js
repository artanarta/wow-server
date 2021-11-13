const express = require('express')

const router = express.Router()

//middleware
const { uploadFile } = require('../middlewares/uploadFile');
const { auth } = require('../middlewares/auth');

// Controller
const { getUsers, deleteUser, updateUser, getTransactionUser } = require('../controllers/user')
const { register, login, checkAuth } = require('../controllers/auth');
const { getAllBook, addBook, getIdBook, updateBook, deleteBook } = require('../controllers/book');
const { getAllTransaction, addTransaction, getIdtransaction, updateTransaction} = require('../controllers/transaction');
const { getIdBookList, addBookList, deleteBookList} = require('../controllers/bookList');


// Route
// Login & Register
router.post('/register', register);
router.post('/login', login);
router.get("/check-auth", auth, checkAuth);

//user
router.get('/users', getUsers)
router.get('/user/:id', getTransactionUser)
router.patch('/user/:id', auth, uploadFile('image'),  updateUser);
router.delete('/user/:id', deleteUser)

//book
router.get('/books', getAllBook)
router.get('/book/:id', getIdBook)
router.post('/book', auth, uploadFile('image', 'bookFile'),  addBook);
router.patch('/book/:id', auth, uploadFile('image', 'bookFile'),  updateBook);
router.delete('/book/:id', deleteBook)

//transaction
router.get('/transactions', getAllTransaction)
router.get('/transaction/:id', getIdtransaction)
router.post('/transaction', auth, uploadFile('transferProof'),  addTransaction);
router.patch('/transaction/:id', auth, updateTransaction);

//bookList
router.get('/bookList/:userId', getIdBookList)
router.post('/bookList', auth,  addBookList);
router.delete('/bookList/:id', deleteBookList)

module.exports = router