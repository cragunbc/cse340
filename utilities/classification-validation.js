const { body, validationResult } = require("express-validator")
const utilities = require(".")
const invModel = require("../models/inventory-model")
const validate = {}

validate.classificationRules = () => {
    return [
        body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Classification name is required")
        .isAlpha()
        .withMessage("Classification name should only containe letters")
    ]
}

validate.checkClassificationData = async (req, res, next) => {
    const {classification_name} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            classification_name,
            title: "Add New Classification",
            nav,
            errors: errors.array()
        })
        return
    }
    next()
}

validate.checkInventoryData = async (req, res, next) => {
    const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const dropDownSelect = await utilities.buildClassificationList(classification_id)
        res.render("inventory/add-inventory", {
            title: "Add New Vehicle",
            nav,
            dropDownSelect,
            classification_id,
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail, 
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
            errors: errors.array()
        })
        return
    }
    next()
}

validate.checkUpdateData = async (req, res, next) => {
    const {inv_id, classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const itemData = await invModel.getVehicleInfoByInvId(inv_id)
        const dropDownSelect = await utilities.buildClassificationList(classification_id)
        const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
        res.render("inventory/edit-inventory", {
            title: "Edit " + itemName,
            nav,
            inv_id,
            dropDownSelect,
            classification_id,
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail, 
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
            errors: errors.array()
        })
        return
    }
    next()
}

validate.inventoryRules = () => {
    return [
        body("classification_id")
        .notEmpty()
        .withMessage("Classification must be selected"),

        body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Car make is required"),

        body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Car model is required"),

        body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Car description is required"),

        body("inv_image")
        .trim()
        .notEmpty()
        .withMessage("Car image is required"),

        body("inv_thumbnail")
        .trim()
        .notEmpty()
        .withMessage("Car thumbnail is required"),

        body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Car price is required"),

        body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Car year is required"),

        body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Car miles is required"),

        body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Car color is required"),
    ]
}

validate.newInventoryRules = () => {
    return [
        body("classification_id")
        .notEmpty()
        .withMessage("Classification must be selected"),

        body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Car make is required"),

        body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Car model is required"),

        body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Car description is required"),

        body("inv_image")
        .trim()
        .notEmpty()
        .withMessage("Car image is required"),

        body("inv_thumbnail")
        .trim()
        .notEmpty()
        .withMessage("Car thumbnail is required"),

        body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Car price is required"),

        body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Car year is required"),

        body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Car miles is required"),

        body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Car color is required"),
    ]
}


module.exports = validate