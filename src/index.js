const express = require('express');
const app = express();
const config = require('./config/env');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const route = require('./routes');

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

// Route init
route(app);

app.listen(config.PORT || 3000, () => {
    console.log(`App listening on port ${config.PORT || 3000}`);
});
