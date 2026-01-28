/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const env = require("dotenv").config();
const app = express();
const expressLayouts = require("express-ejs-layouts");
const utilities = require("./utilities");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const errorRoutes = require("./routes/errorRoutes");
const errorHandler = require("./middleware/errorHandler");
const path = require("path");
const session = require("express-session");
const pool = require("./database/database");
const bodyParser = require("body-parser")

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res)
  next()
})

/* ***********************
 * View Engine and Views
 *************************/
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* ***********************
 * View Layouts
 *************************/
app.use(expressLayouts);
app.set("layout", "layouts/layout");

/* ***********************
 * Static Files
 *************************/
app.use(express.static(path.join(__dirname, "public")));

/* ***********************
 * Routes
 *************************/
// Inventory routes
app.use("/inventory", inventoryRoute);

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));

//Account routes
app.use('/account', require('./routes/accountRoute'));

// Error Routes (intencional 500)
app.use("/error", errorRoutes);

// File Not Found Route - must be last route in list
app.use((req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});



/* ***********************
 * Express Error Handler
 *************************/
app.use(errorHandler);

/* ***********************
 * Server Information
 *************************/
const port = process.env.PORT || 5500;


/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});