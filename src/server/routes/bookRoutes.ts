import express from 'express'
import {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook
} from '../controllers/bookController.ts';

const router = express.Router();

router.post('/', addBook);
router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

export default router;
