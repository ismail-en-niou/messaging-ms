const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Declaration of routers
const UserRoute = require('./routers/userRoute');
const chatRoute = require('./routers/chatRoute');
const msgRoute = require('./routers/msgRoute');

const app = express();
let port = process.env.PORT || 5000;
let url = process.env.ATLAS_URI;

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Version 1 of routers
app.use("/api/v1/users", UserRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/messages" , msgRoute);

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to our chat app');
});

// Database connection
mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log(`
 ██████╗ ██████╗ ███╗   ██╗███╗   ██╗███████╗ ██████╗████████╗
██╔════╝██╔═══██╗████╗  ██║████╗  ██║██╔════╝██╔════╝╚══██╔══╝
██║     ██║   ██║██╔██╗ ██║██╔██╗ ██║█████╗  ██║        ██║   
██║     ██║   ██║██║╚██╗██║██║╚██╗██║██╔══╝  ██║        ██║   
╚██████╗╚██████╔╝██║ ╚████║██║ ╚████║███████╗╚██████╗   ██║   
 ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═══╝╚══════╝ ╚═════╝   ╚═╝ 
            `);
    })
    .catch((err) => {
        console.error('Database connection error:', err);
        process.exit(1); // Exit on connection error
    });

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});
