const express = require('express');
const app = express();
const config = require('./config/env');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const route = require('./routes');
const session = require('express-session');
const passport = require('passport');

const http = require('http');
const socket = require('./eventHandler/socket');
const server = http.createServer(app);

// Initialize the socket.io server
// socket.initSocket(server);

// HTTP logger
app.use(morgan('combined'));

// Cookie
app.use(cookieParser());

app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

// Session
app.use(
    session({
        secret: config.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
    }),
);

app.use(passport.initialize());
app.use(passport.session());

// Route init
route(app);

app.listen(config.PORT || 3000, () => {
    console.log(`App listening on port ${config.PORT || 3000}`);
});

// server.listen(config.SOCKET_PORT || 3001, () => {
//     console.log(`Socket server listening on port ${config.SOCKET_PORT || 3001}`);
// });
