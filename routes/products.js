const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');

//get all products
router.get('/',(req, res)=> {
    let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1; //shomare page
    const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10; //limit item dar har page

    let startvalue;
    let endvalue;
    if (page > 0) {
        startvalue = (page * limit) - limit;
        endvalue = page * limit;
    } else {
        startvalue = 0;
        endvalue = 10;
    }


    database.table('products as p')
        .join([{
            table: 'categories as c',
            on: 'c.id = p.cat_id',
        }])
        .withFields(['c.title as category',
            'p.title as name',
            'p.price',
            'p.description',
            'p.quantity',
            'p.image',
            'p.id'

        ])
        .slice(startvalue, endvalue)
        .sort({id: .1})
        .getAll()
        .then(prods => {
            if (prods.length > 0) {
                res.status(200).json({
                    count: prods.length,
                    products: prods
                });
            } else {
                res.json({massage: 'no products found'})
            }
        }).catch(err => console.log(err));
});

//get single product
router.get('/:prodid', (req, res) =>{
    let productid = req.params.prodid;


    database.table('products as p')
        .join([{
            table: 'categories as c',
            on: 'c.id = p.cat_id',
        }])
        .withFields(['c.title as category',
            'p.title as name',
            'p.price',
            'p.description',
            'p.quantity',
            'p.image',
            'p.images',
            'p.id'

        ])
        .filter({'p.id': productid})
        .get()
        .then(prod => {
            if (prod) {
                res.status(200).json(prod);
            } else {
                res.json({massage: 'no product found with this id'})
            }
        }).catch(err => console.log(err));

});

//get al products from a category
router.get('/category/:catname',  (req, res)=> {
    let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1; //shomare page
    const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10; //limit item dar har page

    let startvalue;
    let endvalue;
    if (page > 0) {
        startvalue = (page * limit) - limit;
        endvalue = page * limit;
    } else {
        startvalue = 0;
        endvalue = 10;
    }
    const cat_title = req.params.catname;

    database.table('products as p')
        .join([{
            table: 'categories as c',
            on: `c.id = p.cat_id WHERE c.title LIKE '${cat_title}'`,
        }])
        .withFields(['c.title as category',
            'p.title as name',
            'p.price',
            'p.quantity',
            'p.image',
            'p.id'

        ])
        .slice(startvalue, endvalue)
        .sort({id: .1})
        .getAll()
        .then(prods => {
            if (prods.length > 0) {
                res.status(200).json({
                    count: prods.length,
                    products: prods
                });
            } else {
                res.json({massage: 'no products found from category title'})
            }
        }).catch(err => console.log(err));
});

module.exports = router;
