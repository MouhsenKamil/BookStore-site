import Book from '../models/Book.ts';

export const addBook = async (req: { body: { title: any; author: any; description: any; category: any; price: any; stock: any; coverImage: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): void; new(): any; }; }; }) => {
  const { title, author, description, category, price, stock, coverImage } = req.body;

  try {
    const newBook = new Book({ title, author, description, category, price, stock, coverImage });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: 'Error adding book' });
  }
};

export const getBooks = async (req: { query: { search: any; }; }, res) => {
  try {
      const { search } = req.query;
      const query = search
          ? { title: { $regex: search, $options: 'i' } }
          : {};
      const books = await Book.find(query);
      res.json(books);
  } catch (error) {
      res.status(500).json({ message: 'Server Error' });
  }
};

export const getAllBooks = async (req, res) => {
  try {
      const books = await Book.find({});
      res.json(books);
  } catch (error) {
      res.status(500).json({ message: 'Server Error' });
  }
}

export const getBookById = async (req: { params: { id: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): void; new(): any; }; }; }) => {
  const { id } = req.params;

  try {
    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book' });
  }
};

export const updateBook = async (req: { params: { id: any; }; body: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): void; new(): any; }; }; }) => {
  const { id } = req.params;

  try {
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: 'Error updating book' });
  }
};

export const deleteBook = async (req: { params: { id: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): void; new(): any; }; send: { (): void; new(): any; }; }; }) => {
  const { id } = req.params;

  try {
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) return res.status(404).json({ message: 'Book not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book' });
  }
};
