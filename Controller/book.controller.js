const Book = require("../Model/book.model");
const date = require('date-and-time');
const now = new Date();
const { Sequelize, QueryTypes } = require('sequelize');
const Op = Sequelize.Op;
const sequelize = require("../db/connection");
// ====================API FOR CREATE DATA ======================
//  ACCESS URL =>  /api/create_book/
// METHOD TYPE => POST
exports.BookInsert = async (req, res, next) => {
    if (req?.body?.title == '' && req?.body?.author == '') { return res.status(400).json({ status: 400, message: 'please provide complete data.' }); }
    const Newbook = {
        title: req?.body?.title,
        author: req?.body?.author,
        release_date: req?.body?.release_date,
        subject: req?.body?.subject
    }
   await Book.create(Newbook).then(result => {
        // console.log(result);
        // console.log(result._options.isNewRecord);
        if (result._options.isNewRecord == true) {
            res.status(201).json({ status: 201, insertedId: result.id, message: 'New book created successfully.' });

        } else {
            res.status(400).json({ status: 400, message: 'Could not created please try again.' });
        }
    }).catch((error) => {
        if (err) { return res.status(500).json({ status: 500, error: err, message: 'Failed to retrive a data' }); }
    });

}


// ========================FETCH ALL DATA API ===============================

//  ACCESS URL =>  /api/getBook_list/
// METHOD TYPE => GET

exports.GetBooksAll = async (req, res, next) => {
    await  Book.findAll().then(result => {
        if (result?.length > 0) {
            var Rows = result?.map(data => {
                return {
                    'id': data?.id,
                    'title': data?.title,
                    'author': data?.author,
                    'release_date': data?.release_date,
                    'subject': data?.subject,
                    'createdAt': (data?.createdAt) ? date.format(data?.createdAt, 'YYYY/MM/DD HH:mm:ss') : 'NA'

                }
            });
            res.status(200).json({
                status: 200,
                count: result?.length,
                data: Rows,
                message: 'All book list.'
            });
        } else {
            res.status(200).json({
                status: 200,
                count: 0,
                data: Rows,
                message: 'No record found.'
            });
        }
    }).catch(err => {
        if (err) { return res.status(500).json({ status: 500, error: err, message: 'Failed to retrive a data' }); }
    })

}



// ===================GET DATA BY ID  API =====================

//  ACCESS URL =>  /api/getBook_ByID/:bookId
// METHOD TYPE => GET

exports.GetBookByID = async (req, res, next) => {
    if (req?.params?.bookId == '' || req?.params?.bookId == undefined || req?.params?.bookId == null) { res.status(404).json({ status: 404, message: 'book id is missing.' }); return false; }
    const id = req?.params?.bookId;
    // Book.findByPk(id)   //also we can find id data by findByPk function  
   await Book.findOne({ where: { id: id } })
        .then((result) => {
            if (result) {
                var rows = {
                    'id': result?.id,
                    'title': result?.title,
                    'author': result?.author,
                    'release_date': result?.release_date,
                    'subject': result?.subject,
                    'createdAt': (result?.createdAt) ? date.format(result?.createdAt, 'YYYY/MM/DD HH:mm:ss') : 'NA'
                }
                return res.status(200).json({
                    status: 200,
                    count: 1,
                    result: rows,
                    message: `Book detail for id=${id}.`
                });


            } else {
                return res.status(404).json({
                    status: 404,
                    count: 0,
                    data: Rows,
                    message: `Cannot find Tutorial with id=${id}.`
                });

            }
        }).catch((err) => {
            if (err) { return res.status(500).json({ status: 500, error: err, message: 'Failed to retrive a data' }); }
        });

}


// ==================== API FOR DISTROY DATA ================

//  ACCESS URL =>  /api/deleteBook_byID/:bookId
// METHOD TYPE => DELETE

exports.DeleteDataByID = async (req, res, next) => {

    if (req?.params?.bookId == '' || req?.params?.bookId == undefined || req?.params?.bookId == null) { res.status(404).json({ status: 404, message: 'book id is missing.' }); return false; }
    const id = req?.params?.bookId;

    await Book.destroy({
        where: {
            id: id
        }
    }).then((result) => {
        // console.log(result);  //return 1 if deleted and if not return 0 
        if (result > 0) {
            res.status(200).json({ status: 200, id: id, message: 'Book deleted successfully.' })
        } else {
            res.status(200).json({ status: 404, id: id, message: 'Id not found' });

        }

    }).catch((err) => {
        if (err) { return res.status(500).json({ status: 500, error: err, message: 'Failed to perform action into database.' }); }

    });

}


// =======================UPDATE DATA==========================

//  ACCESS URL =>  /api/update_book
// METHOD TYPE => PATCH
exports.UpdateBook = async(req, res, next) => {
    if (req?.body?.id == '' || req?.body?.id == undefined || req?.body?.id == null) { res.status(404).json({ status: 404, message: 'id is missing.' }); return false; }
    if (req?.body?.title == '' && req?.body?.author == '') { return res.status(400).json({ status: 400, message: 'please provide complete data.' }); }

    const id = req?.body?.id;
    const RawData = {
        title: req?.body?.title,
        author: req?.body?.author,
        release_date: req?.body?.release_date,
        subject: req?.body?.subject
    }
    await  Book.update(RawData, { where: { id: id } }).then((result) => {
        if (result > 0) {
            res.status(200).json({ status: 200, id: id, message: 'Book updated successfully.' });
        } else {
            res.status(200).json({ status: 200, id: id, message: 'Could not updated please try again.' });

        }
    }).catch((err) => {
        if (err) { return res.status(500).json({ status: 500, error: err, message: 'Failed to perform action into database.' }); }
    });

}


// =====================SEARCING API FOR SEARCH BOOK========================================
//  ACCESS URL =>  /api/search_book/:search
// METHOD TYPE => GET
exports.SearchBooks = async(req, res, next) => {
    if (req?.params?.search == '' || req?.params?.search == undefined || req?.params?.search == null) { res.status(404).json({ status: 404, message: 'id is missing.' }); return false; }
    const searchstr = req?.params?.search;
    var condition = searchstr ? { title: { [Op.like]: `${searchstr}%` } } : null;
    await Book.findAll({ where: condition }).then((result) => {
        if (result?.length > 0) {
            var Rows = result?.map(data => {
                return {
                    'id': data?.id,
                    'title': data?.title,
                    'author': data?.author,
                    'release_date': data?.release_date,
                    'subject': data?.subject,
                    'createdAt': (data?.createdAt) ? date.format(data?.createdAt, 'YYYY/MM/DD HH:mm:ss') : 'NA'

                }
            });
            res.status(200).json({
                status: 200,
                count: result?.length,
                data: Rows,
                message: 'All search book list.'
            });
        } else {
            res.status(200).json({
                status: 200,
                count: 0,
                data: Rows,
                message: 'No record found.'
            });
        }
    }).catch((err) => {
        if (err) { return res.status(500).json({ status: 500, error: err, message: 'Failed to perform action into database.' }); }
    });
}


// =====================SEARCING API FOR SEARCH BOOK========================================
//  ACCESS URL =>  /api/truncateAll_book/
// METHOD TYPE => DELETE

exports.DeleteAllBook = async(req, res, next) => {
    // IF truncate:false //delete all record and  primary key will start from after last deleted id 
    // IF truncate:true //truncate table  record and  primary key will start from sratch. 
   await Book.destroy({ where: {}, truncate: false }).then((result) => {
        if (result > 0) {
            return res.status(200).json({ status: 200, total_deleted_record: result, message: 'All books record deleted successfully.' });
        } else {
            return res.status(404).json({ status: 404, message: 'No record to perform a action .' });
        }

    }).catch((err) => {
        if (err) { return res.status(500).json({ status: 500, error: err, message: 'Failed to perform action into database.' }); }

    });

}

// ===================DATA FETCH WITH RAW QUERIES==================================

//  ACCESS URL =>  /api/GetRaw_data_detail/
// METHOD TYPE => GET
exports.GetRwaAllData = async (req, res, next) => {
    const sql = `SELECT * FROM books WHERE subject = ?`;
    const result = await sequelize.query(sql, {
        replacements: ['1'],
        type: QueryTypes.SELECT
    });
    
    if (result?.length > 0) {
        return res.status(200).json({
            status:200,
            count:result.length,
            data: result?.map(data=>{
                return {
                    'id': data?.id,
                    'title': data?.title,
                    'author': data?.author,
                    'release_date': data?.release_date,
                    'subject': data?.subject,
                    'createdAt': (data?.createdAt) ? date.format(data?.createdAt, 'YYYY/MM/DD HH:mm:ss') : 'NA'
                }
            }),
            message:'Books list...'
    });

    } else {

    }
}
// ======================================

exports.FindAndcount = async(rew,res,next) =>{

await Book.findAndCountAll({
    where:{
        title:{ [Op.like]: 't%' }
    },
    offset: 6,
    limit: 2
}).then((result) => {
    console.log(result);
    
}).catch((err) => {
    if (err) { return res.status(500).json({ status: 500, error: err, message: 'Failed to perform action into database.' }); }
    
});
}


