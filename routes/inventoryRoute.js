// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const classValidate = require("../utilities/classification-validation")
const utilities = require("../utilities/")
// const detController = require("../controllers/invController")


router.get("/", invController.buildInventory)

router.get("/add-classification", invController.addClassification)

router.get("/add-vehicle", invController.addInventory)

router.get("/get-error", (req, res, next) => {
    next(new Error("500 error"))
})

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build details of vehicle view
router.get("/detail/:inv_id", invController.buildbyInvId);

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventory));

router.post("/add-classification", classValidate.classificationRules(), classValidate.checkClassificationData, invController.addNewClassification);

router.post("/add-inventory", classValidate.inventoryRules(), classValidate.checkInventoryData, invController.addNewInventory);

router.post("/update", classValidate.newInventoryRules(), classValidate.checkUpdateData, invController.updateInventory);

module.exports = router;