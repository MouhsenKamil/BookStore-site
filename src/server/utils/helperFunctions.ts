export const calculateTotalAmount = (books: any[]) => {
  return books.reduce((total: number, book: { price: number; quantity: number; }) => total + book.price * book.quantity, 0);
};

export const formatResponse = (data: any, message = 'Success') => {
  return { message, data };
};
