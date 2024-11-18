db.createCollection('customers')
db.createCollection('sellers')
db.createCollection('admins')
db.createCollection('books')
db.createCollection('orders')
db.createCollection('carts')
db.createCollection('wishlists')

console.log("For Admin user: (username: bookstore-admin)")

db.createUser({
  user: "bookstore-admin",
  pwd: passwordPrompt(), // 'bookstore-admin',
  roles: [{role: "dbOwner", db: "bookstore"}],
})

console.log("\nFor Regular users: (username: bookstore-user)")

db.createUser({
  user: "bookstore-user",
  pwd: passwordPrompt(), // 'bookstore-user',
  roles: [{role: "readWrite", db: "bookstore"}],
})

db.users.createIndex({ name: 1, email: 1 }, { name: "Users_Name_Email_Index" })
db.books.createIndex({ "$**": "text" }, { name: "Books_Text_Index" })
