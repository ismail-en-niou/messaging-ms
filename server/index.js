const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const UserRoute = require('./routers/userRoute');


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
let port = process.env.port || 5000;
let url = process.env.ATLAS_URI;
app.use(cors());
app.use("/api/users", UserRoute);

app.use(express.json());

// routes

app.get('/', (req, res) => {
    res.send('welcom our chat app');
});

app.post('/add', (req, res) => {
    res.send('Add');
});


// database connection
mongoose.connect(url).then(() => {
        console.log('MongoDB connected');
    }).catch((err) => {     
        console.log("Error: " + err);
    });



app.listen(port ,(req , res) => {
    console.log(`Server is running on port ${port}`);
});
