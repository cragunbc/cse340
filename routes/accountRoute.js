// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/index")
const regValidate = require('../utilities/account-validation')
const loginValidate = require('../utilities/account-validation')


router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.accountManagement))
router.get("/logout", utilities.handleErrors(accountController.logout))
router.get("/accountUpdate/:account_id", accountController.updateAccount)
router.post("/register", regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))
// Process the login attempt
// router.post("/login", (req, res) => res.status(200).send('login process'))
router.post("/login", loginValidate.loginRules(), loginValidate.checkLoginData, utilities.handleErrors(accountController.accountLogin))
router.post("/accountUpdate/:account_id", utilities.handleErrors(accountController.accountUpdateProcess))
router.post("/accountUpdate/password/:account_id", utilities.handleErrors(accountController.updatePassword))

module.exports = router;