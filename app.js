const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');



const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: 'Content-Type,Authorization,Origin,X-Requested-With,Accept,Access-Control-Allow-Headers',
}));
app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());



//import routes
const productsRoute = require('./routes/products');
const ordersRoute = require('./routes/orders');
const usersRoute = require('./routes/users');
const authRoutes=require('./routes/auth');

//use routes


app.use('/api/products', productsRoute);
app.use('/api/orders', ordersRoute);
app.use('/api/auth',authRoutes);
app.use('/api/users',usersRoute);




module.exports = app;
