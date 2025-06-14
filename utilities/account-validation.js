const accountModel = require("../models/account-model")
const utilities = require(".")
const bcrypt = require("bcryptjs")
  const { body, validationResult } = require("express-validator")
  const validate = {}


/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
        .trim()
        .escape()
        .notEmpty()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
          const emailExists = await accountModel.checkExistingEmail(account_email)
          if (emailExists){
            throw new Error("Email exits. Please log in or use different email")
          }
        }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

/*  **********************************
  *  Login Data Validation Rules
  * ********************************* */
  validate.loginRules = () => {
    return [
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      // .escape()
      // .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (!emailExists){
          throw new Error("Email does not exits. Please log in or use different email")
        }
      }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

//   /* ******************************
//  * Check data and return errors or continue to registration
//  * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    })
    return
  }
  next()
}

validate.checkAccountType = async (req, res, next) => {
  console.log("Middleware running")
  console.log("Logged in user type:", req.session.clientData?.account_type)
  if(req.session.clientData) {
    const account = req.session.clientData.account_type
    if(account === "Admin" || account === "Employee") {
      return next()
    }
  }

  let nav = await utilities.getNav()
  req.flash("notice", "You don't have access to view that page")  
  return res.status(403).render("account/login", {
    title: "Login",
    nav,
    errors: null
  })
}

validate.adminAccount = async (req, res, next) => {
  console.log("Middleware running")
  console.log("Logged in user type:", req.session.clientData?.account_type)
  if(req.session.clientData) {
    const account = req.session.clientData.account_type
    if(account === "Admin") {
      return next()
    }
  }

  let nav = await utilities.getNav()
  req.flash("notice", "You don't have access to view that page")  
  return res.status(403).render("account/login", {
    title: "Login",
    nav,
    errors: null
  })
}

validate.editUserRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      // body("account_email")
      //   .trim()
      //   .escape()
      //   .notEmpty()
      //   .isEmail()
      //   .normalizeEmail() // refer to validator.js docs
      //   .withMessage("A valid email is required.")
      //   .custom(async (account_email, {req}) => {
      //     const emailExists = await accountModel.checkExistingEmail(account_email)
      //     if (emailExists && parseInt(emailExists.account_id) !== parseInt(req.body.account_id)){
      //       console.log("Exisitng ID:", emailExists.account_id)
      //       console.log("Form ID: ", req.body.account_id)
      //       throw new Error("Email exits. Please enter a different email")
      //     }
      //     return true
      //   }),
  
      // password is required and must be strong password
      body("account_password")
        .optional({checkFalsy: true})
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
        
      body("account_type")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide an account."), // on error this message is sent.
    ]
}

validate.checkEditUserData = async (req, res, next) => {
  const { account_id, account_firstname, account_lastname, account_email, account_password, account_type } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/edit-user", {
      errors: errors.array(),
      title: `Edit ${account_firstname} ${account_lastname}`,
      nav,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
      account_password: "",
      account_type
    })
    return
  }
  next()
}

module.exports = validate