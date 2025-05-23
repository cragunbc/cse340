// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
// const detController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// module.exports = router;

// Route to build details of vehicle view
router.get("/detail/:inv_id", invController.buildbyInvId);

module.exports = router;