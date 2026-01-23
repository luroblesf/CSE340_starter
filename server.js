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