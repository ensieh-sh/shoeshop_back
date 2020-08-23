const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');

//get all orders
router.get('/', (req, res) => {
    database.table('orders_details as od ')
        .join([
            {
                table: 'orders as o',
                on: 'o.id=od.order_id'
            },
            {
                table: 'products as p',
                on: 'p.id =od.product_id'
            },
            {
                table: 'users.js as u',
                on: 'u.id=o.user_id'
            }
        ])
        .withFields(['o.id', 'p.title as name', 'p.description', 'p.price', 'u.username'])
        .sort({id: .1})
        .getAll()
        .then(orders => {
            if (orders.length > 0) {
                res.status(200).json(orders);
            } else {
                res.json({massage: 'no orders found '});
            }
        }).catch(err => console.log(err));
});

//get one order list by id
router.get('/:id', (req, res) => {
    const orderid = req.params.id;

    database.table('orders_details as od ')
        .join([
            {
                table: 'orders as o',
                on: 'o.id=od.order_id'
            },
            {
                table: 'products as p',
                on: 'p.id =od.product_id'
            },
            {
                table: 'users as u',
                on: 'u.id=o.user_id'
            }
        ])
        .withFields(['o.id', 'p.title as name', 'p.description', 'p.price', 'u.username','p.image','od.quantity'])
        .filter({'o.id': orderid})
        .getAll()
        .then(orders => {
            if (orders.length > 0) {
                res.status(200).json(orders);
            } else {
                res.json({massage: 'no orders found with order id :' + orderid});
            }
        }).catch(err => console.log(err));

});


// add new order
router.post('/new', (req, res) => {

    let {userid, products} = req.body;

    if (userid !== null && userid > 0 && !isNaN(userid)) {
        database.table('orders')
            .insert({
                user_id: userid
            }).then(neworderid => {

            if (neworderid > 0) {
                products.forEach(async (p) => {

                    let data = await database.table('products').filter({id: p.id}).withFields(['quantity']).get();

                    let incart = p.incart;

                    //    kam krdn tedad product ha b andaze sefaresh
                    if (data.quantity > 0) {
                        data.quantity = data.quantity - incart;

                        if (data.quantity < 0) {
                            data.quantity = 0;
                        }

                    } else {
                        data.quantity = 0;
                    }

                    //    ezafe krdn detail order
                    database.table('orders_details')
                        .insert({
                            order_id: neworderid,
                            product_id: p.id,
                            quantity: incart
                        }).then(newId => {
                        database.table('products')
                            .filter({id: p.id})
                            .update({
                                quantity: data.quantity
                            }).then(successNum => {
                        }).catch(err => console.log(err));
                    }).catch(err => console.log(err));

                });
            } else {
                res.json({message: 'new order failed while adding order details', success: false})
            }
            res.json({
                message: 'Order successfully placed with order id :' + neworderid,
                success: true,
                order_id: neworderid,
                products: products
            });
        }).catch(err => console.log(err));
    } else {
        res.json({message: 'New order failed', success: false});
    }


});


//fake gateway
router.post('/payment', (req, res) => {
    setTimeout(() => {
        res.status(200).json({success: true});
    }, 3000)
});


module.exports = router;
