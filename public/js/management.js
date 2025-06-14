'use strict' 
 
//  // Get a list of items in inventory based on the classification_id 
//  let classificationList = document.querySelector("#classificationList")
//  classificationList.addEventListener("change", function () { 
//   let classification_id = classificationList.value 
//   console.log(`classification_id is: ${classification_id}`) 
//   let classIdURL = "/inv/getInventory/"+classification_id 
//   fetch(classIdURL) 
//   .then(function (response) { 
//    if (response.ok) { 
//     return response.json(); 
//    } 
//    throw Error("Network response was not OK"); 
//   }) 
//   .then(function (data) { 
//    console.log(data); 
//    buildInventoryList(data); 
//   }) 
//   .catch(function (error) { 
//    console.log('There was a problem: ', error.message) 
//   }) 
//  })

window.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch("/inv/manage/data")
        const data = await res.json()
        buildUserList(data)
    } catch (error) {
        console.log("Couldn't load your data", error)
    }
})

// Build inventory items into HTML table components and inject into DOM 
function buildUserList(data) { 
 let usersDisplay = document.getElementById("usersDisplay"); 
 // Set up the table labels 
 let dataTable = '<thead>'; 
 dataTable += '<tr><th>ID</th><th>First Name</th><th>Last Name</th><th>Modify</th><th>Delete</th></tr>'; 
 dataTable += '</thead>'; 
 // Set up the table body 
 dataTable += '<tbody>'; 
 // Iterate over all vehicles in the array and put each in a row 
 data.forEach(function (element) { 
  console.log(element.account_id + ", " + element.account_firstname);
  dataTable += `<tr><td>${element.account_id}</td>`;
  dataTable += `<td>${element.account_firstname}</td>`; 
  dataTable += `<td>${element.account_lastname}</td>`; 
  dataTable += `<td><a href='/inv/manage/editUser/${element.account_id}' title='Click to update'>Modify</a></td>`; 
  dataTable += `<td><a href='/inv/manage/deleteUser/${element.account_id}' title='Click to delete'>Delete</a></td></tr>`; 
 }) 
 dataTable += '</tbody>'; 
 // Display the contents in the Inventory Management view 
 usersDisplay.innerHTML = dataTable; 
}