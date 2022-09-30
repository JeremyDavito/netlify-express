const express = require('express');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const groupRoutes= require('./routes/group.routes');
const conversationRoutes = require('./routes/conversations.routes');
const messageRoutes = require('./routes/messages.routes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");

const {checkUser } = require('./middleware/authMiddleware');
const { requireAuth } = require('./middleware/authMiddleware');
const cors = require('cors');
//TODO VOIR MORGAN NPM


require('dotenv').config({ path: './config/.env' });
require('./config/db');

const allowedOriginsUrl = [ process.env.CLIENT_URL, process.env.ADMIN_URL]


const corsOptions = {
    origin: allowedOriginsUrl,
    credentials: true,
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
  }
  app.use(cors(corsOptions)); 
 
/* app.use(cors()); */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
 app.use(helmet());
app.use(morgan("common")); 

//Cors Configuration - Start
/*  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested, Content-Type, Accept Authorization"
    )
    if (req.method === "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "POST, PUT, PATCH, GET,OPTION, DELETE"
      )
      return res.status(200).json({})
    }
    next()
  })  */
  //Cors Configuration - End
  

/* 
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    // handle OPTIONS method
    if ('OPTIONS' == req.method) {
        return res.sendStatus(200);
    } else {
        next();
    }
});
 */

//jwt -->> check pour chaque page si l'user a bien le bon jsonwebtoken pr la sécurité
app.get('*', checkUser)
app.get('/jwtid', requireAuth, (req,res)=> {res.status(200).send(res.locals.user._id)});

//routes
app.use('/api/user', userRoutes);

app.use('/api/post', postRoutes);

app.use('/api/group', groupRoutes);

app.use("/api/conversations", conversationRoutes);

app.use("/api/messages", messageRoutes);



/* 
app.get('/hello', function (req, res) {
    res.json("Hello World")
}) */



//server

app.listen(process.env.PORT || 5000, () => {
    console.log(`Listening on port ${process.env.PORT}`)
});
