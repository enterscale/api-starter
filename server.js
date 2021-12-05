let express = require("express");
let compression = require('compression');
let morgan = require('morgan');
let jwt = require("jsonwebtoken");
let cors = require("cors");
const helmet = require('helmet');
require('dotenv').config();

const path = require('path');
const rfs = require('rotating-file-stream'); // version 2.x

// create a rotating write stream
var accessLogStream = rfs.createStream('access.log', {
    interval: '1M', // rotate Monthly
    path: path.join(__dirname, 'log'),
    compress: "gzip" // compress rotated files
});

let response = require("./utils/response");

let AppUser = require('./modules/app-user/app-user.model');

let app = express();

function ignoreFavicon(req, res, next) {
    if (req.originalUrl.includes('favicon.ico')) {
        return res.status(204).end()
    }
    next();
}

app.use(ignoreFavicon);

app.use(require('express-status-monitor')({
    title: 'STARTER API Status',
    spans: [{
        interval: 1,            // Every second
        retention: 60           // Keep 60 datapoints in memory
    }, {
        interval: 5,            // Every 5 seconds
        retention: 60
    }, {
        interval: 15,           // Every 15 seconds
        retention: 60
    },
    {
        interval: 60,           // Every 60 seconds
        retention: 60
    }],
}));

// compress all responses
app.use(compression());
app.use(helmet());
app.use(cors());
switch (process.env.NODE_ENV) {
    case 'production':
        app.use(morgan(':remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - [:date[clf]]- :response-time ms', { stream: accessLogStream }));
        break;

    default:
        app.use(morgan(':remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - [:date[clf]]- :response-time ms'));
        break;
}

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));


/**
 * Validates that their a Valid AUTH Token in the request Headers.
 */
app.use(function (req, res, next) {

    let signInUrl = req.originalUrl;
    if (signInUrl.indexOf("app/") !== -1 || signInUrl === "/v1/api" || signInUrl === "/status") { next(); }
    else {
        if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === "Bearer") {
            let token = req.headers.authorization.split(' ')[1] || req.query.token || req.cookies.token;
            jwt.verify(token, process.env.TOKEN_SECRET, async function (err, decode) {
                if (err) {
                    console.log("error => ", err);
                    req.user = undefined;
                    return res.status(401).json(response.error(401, "Unauthorized User."));
                }
                else {
                    //Split appid and appkey
                    // Check if it exists and active on Database
                    req.user = decode;
                    let userAppDataArray = decode['data'].split('|');
                    let appId = userAppDataArray[0];
                    let appKey = userAppDataArray[1];

                    req.who = appId;

                    let data = await AppUser.findAll({ where: { appId, appKey, status: false, isActive: true }, attributes: { exclude: ['updatedAt', 'createdAt'] } });

                    if (!data.length) {
                        console.log('User doesnot exist')
                        return res.status(401).json(response.error(401, "Unauthorized User."));
                    } else {
                        next();
                    }
                }
            });

        } else {
            console.log('No Bearer Header found');
            req.user = undefined;
            return res.status(401).json(response.error(401, "Unauthorized User."));
        }
    }
});


module.exports = app;