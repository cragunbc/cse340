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
  const classificationSelect = await utilities.buildClassificationList()
  try {
    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      erorrs: null,
      classificationSelect
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


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleInfoByInvId(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData[0].classification_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body

  const parsedInvId = parseInt(inv_id)
  const parsedClassificationId = parseInt(classification_id)
  const parsedInvPrice = parseFloat(inv_price)
  const parsedInvYear = parseInt(inv_year)
  const parsedInvMiles = parseInt(inv_miles)

  const updateResult = await invModel.updateInventory(
    parsedInvId,
    parsedClassificationId,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    parsedInvPrice,
    parsedInvYear,
    parsedInvMiles,
    inv_color,
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: parsedInvId,
    inv_make,
    inv_model,
    inv_year: parsedInvYear,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price: parsedInvPrice,
    inv_miles: parsedInvMiles,
    inv_color,
    classification_id: parsedClassificationId
    })
  }
}

// invCont.updateInventory = async function (req, res, next) {
//   let nav = await utilities.getNav()
//   const {classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color} = req.body
//   try {
//     const data = await invModel.updateInventory(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)
//     if (data) {
//       req.flash("notice", `Vehicle was successfully updated`)
//       res.redirect("/inv/")
//     } else {
//       throw new Error("Error adding a new vehicle")
//     }
//   } catch (error) {
//     console.error("Error adding a new inventory vehicle", error)
//     res.status(500).render("inventory/management", {
//       title: "Vehicle Management",
//       nav,
//       errors: []
//     })
//   }
// }

module.exports = invCont