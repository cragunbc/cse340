const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  if (!classification_id || isNaN(parseInt(classification_id))) {
    return next({status: 404, message: "Invalid classification of vehicle"})
  } try {
    const data = await invModel.getInventoryByClassificationId(classification_id)

    if(!data || data.length === 0) {
      return next({status: 404, message: "Your vehicle classification wasn't found"})
    }
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (error) {
    console.error("Error in buildByClassificationId", error)
    next(error)
  }
}

// module.exports = invCont

invCont.buildbyInvId = async function(req, res, next) {
  console.log("inv_id from params:", req.params.inv_id)
  const inv_id = req.params.inv_id
  if (!inv_id || isNaN(parseInt(inv_id))) {
    return next({status: 404, message: "Invalid or missing vehicle ID"})
  } try {
    const data = await invModel.getVehicleInfoByInvId(inv_id)

    if (!data || data.length === 0) {
      return next({status: 404, message: "Your vehicle wasn't found"})
    }
    const vehicleDetails = await utilities.buildVehicleInfo(data[0])
    let nav = await utilities.getNav()
    const vehicleName = inv_id
    res.render("./inventory/details", {
      title: vehicleName,
      nav,
      vehicleDetails,
    })
  } catch (error) {
    console.error("Error in buildingbyInvID: ", error)
    next(error)
  }

}

invCont.buildInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  try {
    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav
    })
  } catch (error) {
    console.error("Error pulling up page: ", error)
    next(error)
  }
}


invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  try {
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: []
    })
  } catch (error) {
    console.error("Error adding a new classification: ", error)
    next(error)
  }
}

invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let dropDownSelect = await utilities.buildClassificationList()
  try {
    res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      dropDownSelect,
      errors: null
    })
  } catch (error) {
    console.error("Error adding a new vehicle", error)
    next(error)
  }
}

invCont.addNewClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  try {
    const data = await invModel.addVehicleByClassificationName(classification_name)
    if (data) {
      req.flash("notice", `${classification_name} was successfully added!`)
      res.redirect("/inv/")
    } else {
      throw new Error("Error inserting a new vehicle classification")
    }
  } catch (error) {
    console.error("Error adding a new vehicle classification", error)
    res.status(500).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: []
    })
  }
}

invCont.addNewInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color} = req.body
  try {
    const data = await invModel.addNewInventoryVehicle(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)
    if (data) {
      req.flash("notice", `New vehicle was successfully added`)
      res.redirect("/inv/")
    } else {
      throw new Error("Error adding a new vehicle")
    }
  } catch (error) {
    console.error("Error adding a new inventory vehicle", error)
    res.status(500).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: []
    })
  }
}

module.exports = invCont