const expres = require('express');
const routes = expres.Router();
const multer = require("multer");
// const Book = require("../Model/book.model");
const BookController = require("../Controller/book.controller");
routes.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// ROUTING URL'S /  API'S URL HERE
routes.get("/getBook_list",BookController.GetBooksAll); 
routes.get("/getBook_ByID/:bookId",BookController.GetBookByID);
routes.delete("/deleteBook_byID/:bookId",BookController.DeleteDataByID);
routes.post("/create_book",BookController.BookInsert);
routes.patch("/update_book",BookController.UpdateBook);
routes.get("/search_book/:search",BookController.SearchBooks);
routes.delete("/truncateAll_book",BookController.DeleteAllBook);
routes.get("/offset_list",BookController.FindAndcount);
// WITH RAW QUERIES
routes.get("/GetRaw_data",BookController.GetRwaAllData);

module.exports=routes; 

