/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require('express-ejs-layouts')
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/index")
const session = require("express-session")
const pool = require('./database/')
const accountRoute = require("./routes/accountRoute")
const bodyParser = require("body-parser")
app.use(express.urlencoded({ extended: true }))
const cookieParser = require("cookie-parser")




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


// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cookieParser())
app.use(utilities.checkJWTToken)

app.use((req, res, next) => {
  res.locals.loggedin = Boolean(req.session.clientData)
  res.locals.clientFirstname = req.session.clientData?.account_firstname
  res.locals.clientData = req.session.clientData
  next()
})


/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Routes
 *************************/
app.use(static)

// Index route
// app.get("/", function(req, res){
//   res.render("index", {title: "Home"})
// })
// app.get("/", baseController.buildHome)
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory Route
// app.use("/inv/", inventoryRoute)

app.use("/inv", inventoryRoute)

app.use("/account", accountRoute)

// app.use("/register", accountRoute)

app.get("/inv/get-error", (req, res, next) => {
    next(new Error("500 error"))
})

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})



/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/

// app.use(async (err, req, res, next) => {
//   let nav = await utilities.getNav()
//   console.error(`Error at: "${req.originalUrl}": ${err.message}`)
//   if(err.status == 404){message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
//   res.render("errors/error", {
//     title: err.status || 'Server Error',
//     message,
//     nav
//   })
// })


app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  const status = err.status || 500
  const error404 = status === 404
  const error500 = status === 500
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  const message = err.message || (error404 ? "Oh no! There was a crash. Maybe try a different route?": "Sorry we appear to have lost that page")
  // if(err.status == 500){message = err.message} else {message = 'Sorry, we appear to have lost that page.'}
  const template = error404 ? "errors/error" : "errors/500error"
  res.status(status).render(template, {
    title: status,
    message,
    nav
  })
})
/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
