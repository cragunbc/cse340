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

module.exports = invCont