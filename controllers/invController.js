const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

// module.exports = invCont

invCont.buildbyInvId = async function(req, res, next) {
  console.log("inv_id from params:", req.params.inv_id)
  const inv_id = req.params.inv_id
  if (!inv_id) {
    return res.status(400).send("Vehicle ID is required.")
  } try {
    const data = await invModel.getVehicleInfoByInvId(inv_id)

    if (!data || data.length === 0) {
      return res.status(404).send("Vehicle not found.")
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