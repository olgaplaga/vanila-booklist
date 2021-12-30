//https://www.youtube.com/watch?v=JaMCxVWtW58



//Book class: represents a book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

//UI class: handle UI task
class UI {
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach((book) => UI.addBookToList(book));
  }
  static addBookToList(book) {
    const list = document.getElementById("book-list");
    const row = document.createElement("tr");
    row.innerHTML = `
     <td>${book.title}</td>
     <td>${book.author}</td>
     <td>${book.isbn}</td>
     <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
     `;
    list.appendChild(row);
  }
  static deleteBook(element) {
    if (element.classList.contains("delete")) {
      element.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);
    //Vanish in 3 sec
    setTimeout(() => document.querySelector(".alert").remove(), 2000);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }
}

//Store Class: handle storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
        //json.parse zmienia ze string na object
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
      const books = Store.getBooks();
      books.push(book)
      localStorage.setItem('books', JSON.stringify(books))
  }

  static removeBook(isbn) {
      const books = Store.getBooks();

      books.forEach((book, index) => {
          if (book.isbn === isbn){ 
              books.splice(index, 1) 
          }
      })
      localStorage.setItem('books', JSON.stringify(books))
  }
}

//Event: Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks);

//Event: Add Book
document.querySelector("#book-form").addEventListener("submit", (event) => {
  //prevent actual submit
  event.preventDefault();

  //Get form values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  //Validate
  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Please fill in all fields", "danger");
  } else {
    ///Instatiate book
    const book = new Book(title, author, isbn);

    //Add book to UI
    UI.addBookToList(book);

    //Add book to store
    Store.addBook(book);

    //show Succes message
    UI.showAlert("Book Added!", "success");

    //Clear Fields
    UI.clearFields();
  }
});

//Event: Remove a Book
document.querySelector("#book-list").addEventListener("click", (event) => {
  UI.deleteBook(event.target);
  UI.showAlert("Book Removed!", "success");
  //remove book from ui
  Store.removeBook(event.target.parentElement.previousElementSibling.textContent)
});
