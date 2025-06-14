const utilities = require('../utilities/index')
const accountModel = require('../models/account-model')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()


async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

async function loginAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body

    return res.status(200).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      message: `You successfully logged into ${account_email}!`
    })
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      
      req.session.clientData = {
        account_id: accountData.account_id,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
        account_type: accountData.account_type
      }
      console.log(accountData)
      
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}


async function accountManagement(req, res) {
  const { account_firstname, account_id, account_type } = req.session.clientData
  let nav = await utilities.getNav()
  res.render("account/loginSuccess", {
    title: "Account Management",
    nav,
    errors: null,
    account_firstname,
    account_id,
    account_type
  })
}

async function logout(req, res) {
  req.session.destroy(error => {
    if (error) {
      console.log("Session Erorr:", error)
      req.flash("notice", "There was an error when trying to log you out")
      return res.redirect("/account/")
    }

    res.clearCookie("sessionId")
    res.redirect("/")
  })
}

async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const account_id = req.params.account_id
  const accountData = await accountModel.getAccountById(account_id)
  res.render("account/accountUpdate", {
    title: "Edit Account",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_id
  })
}

async function updatePassword(req, res) {
  const { account_id, account_password } = req.body

  if(!account_password || account_password.length < 12) {
    req.flash("notice", "Your password needs to be atleast 12 chracters")
    return res.redirect(`/account/accountUpdate/${account_id}`)
  }

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)

    const updatePassword = await accountModel.passwordUpdate({
      account_id,
      account_password: hashedPassword
    })

    if (updatePassword) {
      req.flash("notice", "Your password was successfully changed")
      return res.redirect("/account/")
    } else {
      throw new Error("There was an error with your request")
    }
  } catch {
    req.flash("notice", "There was an error updating your password")
    return res.status(500).render("account/accountUpdate", {
      title: "Edit Account",
      account_id
    })
  }
}

async function accountUpdateProcess(req, res) {
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  const emailExists = await accountModel.emailCheck(account_email, account_id)
  let nav = await utilities.getNav()
  const errors = []

  if (emailExists) {
    errors.push("This email already exists. Please choose another one")
  }
  if (!account_firstname || account_firstname.trim() === "") {
    errors.push("First name is required")
  }
  if (!account_lastname || account_lastname.trim() === "") {
    errors.push("Last name is required")
  }
  if (!account_email || account_email.trim() === "") {
    errors.push("Email is required")
  }

  if (errors.length > 0) {
    return res.render("account/accountUpdate", {
      title: "Edit Account",
      nav,
      errors,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    })
  }

  try {
    const updateAccount = await accountModel.updateAccountInfo({
      account_firstname,
      account_lastname,
      account_email,
      account_id
    })
    if(updateAccount) {
      req.flash("notice", "Your account was successfully updated")
      return res.redirect("/account/")
    } else {
      throw new Error("Your account couldn't be updated")
    }
  } catch (error) {
    req.flash("notice", "There was an error updating your account")
    return res.status(500).render("/account/accountUpdate", {
      title: "Edit Account",
      account_firstname,
      account_lastname,
      account_email,
      account_id,
      nav
    })
  }
}

// invCont.manageUsers = async function (req, res, next) {
//   let nav = await utilities.getNav()
//   // let dropDownSelect = await utilities.buildClassificationList()
//   try {
//     res.render("./inventory/add-inventory", {
//       title: "Add New Vehicle",
//       nav,
//       dropDownSelect,
//       errors: null
//     })
//   } catch (error) {
//     console.error("Error adding a new vehicle", error)
//     next(error)
//   }
// }

module.exports = { buildLogin, buildRegister, registerAccount, loginAccount, accountLogin, accountManagement, logout, updateAccount, accountUpdateProcess, updatePassword }