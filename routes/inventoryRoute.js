// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const classValidate = require("../utilities/classification-validation")
const accountValidate = require("../utilities/account-validation")
const utilities = require("../utilities/")
// const detController = require("../controllers/invController")


router.get("/", accountValidate.checkAccountType, invController.buildInventory)

router.get("/add-classification", accountValidate.checkAccountType, invController.addClassification)

router.get("/add-vehicle", accountValidate.checkAccountType, invController.addInventory)

router.get("/manage", accountValidate.adminAccount, utilities.handleErrors(invController.manageUsers))

router.get("/manage/data", accountValidate.adminAccount, utilities.handleErrors(invController.getUsers))

// router.get("/manage/edit/:account_id", accountValidate.adminAccount, utilities.handleErrors(invController.editUser))

router.get("/manage/editUser/:account_id", accountValidate.adminAccount,utilities.handleErrors(invController.editUserView))

router.get("/manage/deleteUser/:account_id", accountValidate.adminAccount, utilities.handleErrors(invController.deleteUserView))

router.get("/get-error", (req, res, next) => {
    next(new Error("500 error"))
})

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build details of vehicle view
router.get("/detail/:inv_id", invController.buildbyInvId);

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

router.get("/edit/:inv_id", accountValidate.checkAccountType, utilities.handleErrors(invController.editInventory));

router.get("/delete/:inv_id", accountValidate.checkAccountType, utilities.handleErrors(invController.deleteInventory))

router.post("/add-classification", accountValidate.checkAccountType, classValidate.classificationRules(), classValidate.checkClassificationData, invController.addNewClassification);

router.post("/add-inventory", accountValidate.checkAccountType, classValidate.inventoryRules(), classValidate.checkInventoryData, invController.addNewInventory);

router.post("/update", accountValidate.checkAccountType, classValidate.newInventoryRules(), classValidate.checkUpdateData, invController.updateInventory);

router.post("/delete", accountValidate.checkAccountType, utilities.handleErrors(invController.deleteItem))

router.post("/manage/editUser/", accountValidate.adminAccount, accountValidate.editUserRules(), accountValidate.checkEditUserData, utilities.handleErrors(invController.updateUser))

router.post("/delete-user", accountValidate.adminAccount, utilities.handleErrors(invController.deleteUser))

module.exports = router;