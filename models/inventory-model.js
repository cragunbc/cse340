const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

module.exports = {getClassifications}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

module.exports = {getClassifications, getInventoryByClassificationId}


async function getVehicleInfoByInvId(inv_id) {
  try {
    console.log("calling getvehicleInfoByInvId with my inv_id:", inv_id)
    const data = await pool.query(
      `SELECT * FROM public.inventory
      WHERE inv_id = $1`,[inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getvehiclebyid error " + error)
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getVehicleInfoByInvId}

async function addVehicleByClassificationName(classification_name) {
  try {
    console.log("adding addVehicleByClassificationName with classificationName:", classification_name)
    const data = await pool.query(
     `INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *`,[classification_name]
    )
    return data.rows
  } catch (error) {
    console.error("adding by classificaionName", error)
    throw error
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getVehicleInfoByInvId, addVehicleByClassificationName}

async function addNewInventoryVehicle(classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) {
  try {
    console.log("adding addNewInventoryVehicle with classification_id", classification_id)
    const data = await pool.query(
      `INSERT INTO public.inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color]
    )
    return data.rows[0]
  } catch (error) {
    console.error("adding new vehicle", error)
    throw error
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getVehicleInfoByInvId, addVehicleByClassificationName, addNewInventoryVehicle}


async function updateInventory(inv_id, classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) {
  try {
    console.log("updating InventoryVehicle with classification_id", classification_id)
    const data = await pool.query(
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *",
      [inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id, inv_id]
    )
    return data.rows[0]
  } catch (error) {
    console.error("updating new vehicle", error)
    throw error
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getVehicleInfoByInvId, addVehicleByClassificationName, addNewInventoryVehicle, updateInventory}