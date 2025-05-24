
const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}



/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/***********************************
 * Build Vehicle Detail Page
 ***********************************/

Util.buildVehicleInfo = async function (data) {
  let vehicleDetails = "";
  if (data) {
    vehicleDetails += `<section class="vehicle_detail">`

    vehicleDetails += `<h2 class="vehicle_name">${data.inv_year} ${data.inv_make} ${data.inv_model}</h2>`

    vehicleDetails += 
      `<div class="vehicle_image">
        <img src=${data.inv_image} alt="Image of ${data.inv_year} ${data.inv_make} ${data.inv_model}">
      </div>`

    vehicleDetails += 
      `<div class="vehicle_info">
        <h3 class="vehicle_detail_heading">${data.inv_make} ${data.inv_model} Details</h3>
        <p class="vehicle_price"><strong>Price:</strong> $<span>${new Intl.NumberFormat('en-US').format(data.inv_price)}</span></p>
        <p class="vehicle_description"><strong>Description:</strong> ${data.inv_description}</p>
        <p class="vehicle_color"><strong>Color:</strong> ${data.inv_color}</p>
        <p class=vehicle_miles><strong>Miles:</strong> ${Number(data.inv_miles).toLocaleString()}</p>
      </div>`

    vehicleDetails += `</section>`
  } else {
    vehicleDetails += `<p class="notice">Sorry, no vehicle details were found.</p>`
  }
  return vehicleDetails
}



/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
