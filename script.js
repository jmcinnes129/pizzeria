/********f************
    
	Project 4 Javascript
	Name: Jonathan McInnes
	Date: December 2023
	Description: The javascript file for project 4.

*********************/

const itemDescription = ["Quad-za", "Spin-eroni", "Pickle Pepperoni", "Eggs-pensive", "Shrimpy Cheese"];
const itemPrice = [24.99, 22.99, 23.99, 26.99, 28.99];
const itemImage = ["order1.jpg", "order2.jpg", "order3.jpg", "order4.jpg", "order5.jpg"];
let numberOfItemsInCart = 0;
let orderTotal = 0;

/*
 * Handles the submit event of the survey form
 *
 * param e  A reference to the event object
 * return   True if no validation errors; False if the form has
 *          validation errors
 */
function validate(e) {
	// Hides all error elements on the page
	hideErrors();

	// Determine if the form has errors
	if (formHasErrors()) {
		// Prevents the form from submitting
		e.preventDefault();

		// When using onSubmit="validate()" in markup, returning false would prevent
		// the form from submitting
		return false;
	}

	// When using onSubmit="validate()" in markup, returning true would allow
	// the form to submit
	return true;


}

/*
 * Handles the reset event for the form.
 *
 * param e  A reference to the event object
 * return   True allows the reset to happen; False prevents
 *          the browser from resetting the form.
 */
function resetForm(e) {
	// Confirm that the user wants to reset the form.
	if (confirm('Clear order?')) {
		// Ensure all error fields are hidden
		hideErrors();

		// Set focus to the first text field on the page
		document.getElementById("qty1").focus();

		// When using onReset="resetForm()" in markup, returning true will allow
		// the form to reset
		return true;
	}

	// Prevents the form from resetting
	e.preventDefault();

	// When using onReset="resetForm()" in markup, returning false would prevent
	// the form from resetting
	return false;
}

/*
 * Does all the error checking for the form.
 *
 * return   True if an error was found; False if no errors were found
 */
function formHasErrors() {
	// Determine if any items are in the cart
	// When the cart has no items, submission of form is halted
	if (numberOfItemsInCart == 0) {
		// Display an error message contained in a modal dialog element

		const modal = document.querySelector("#cartError");
		modal.showModal();

		const closeModal = document.querySelector(".close-button");

		closeModal.addEventListener("click", () => {
			modal.close();
			document.getElementById("qty1").focus();
		});

		// Form has errors
		return true;
	}

	//	Complete the validations below
	
	let requiredFields = ["fullname", "address", "phonenumber", "email", "cardname", "cardnumber"];
	let errorFlag = false;

	for(let i=0; i<requiredFields.length; i++){
		let textField = document.getElementById(requiredFields[i]);
		if(!formFieldHasInput(textField)){
			document.getElementById(requiredFields[i] + "_error").style.display = "block";
			if(!errorFlag){
				textField.focus();
				textField.select();
			}
			errorFlag = true;
		}
	}

	let numberRegex = new RegExp(/^[0-9]{10}$/);
	let numberValue = document.getElementById("phonenumber").value;

	if(!numberRegex.test(numberValue)){
		document.getElementById("invalidnumber_error").style.display = "block";
		if(!errorFlag){
			document.getElementById("phonenumber").focus();
			document.getElementById("phonenumber").select();
		}
		errorFlag = true;
	}

	let emailRegex = new RegExp(/^\S+@\S+\.\S+$/);
	let emailValue = document.getElementById("email").value;

	if(!emailRegex.test(emailValue)){
		document.getElementById("emailformat_error").style.display = "block";
		if(!errorFlag){
			document.getElementById("email").focus();
			document.getElementById("email").select();
		}	
		errorFlag = true;
	}

	let cardType = ["visa", "amex", "mastercard"];
	let cardTypeChecked = false;

	for(let i=0; i<cardType.length && !cardTypeChecked; i++){
		if(document.getElementById(cardType[i]).checked){
			cardTypeChecked = true;
		}
	}

	if(!cardTypeChecked){
		document.getElementById("cardtype_error").style.display = "block";
		errorFlag = true;
	}

	let month = document.getElementById("month");
	if(month.value == "0"){
		document.getElementById("month_error").style.display = "block";
		errorFlag = true;
	}

	let expiryMonth = document.getElementById("month");
	let expiryYear = document.getElementById("year");

	let selectedYear = expiryYear.value;
	let selectedMonth = expiryMonth.value;

	let lastDay = new Date(selectedYear, selectedMonth -1, 0).getDate();

	let expiryDate = new Date(selectedYear, selectedMonth -1, lastDay);

	if(expiryDate < new Date()){
		document.getElementById("expiry_error").style.display = "block";

		errorFlag = true; 
	}


	let cardNumber = document.getElementById("cardnumber").value;
	if(!(cardNumber.length === 10)){
		document.getElementById("invalidcard_error").style.display = "block";
		if(!errorFlag){
			document.getElementById("cardnumber").focus();
			document.getElementById("cardnumber").select();
		}
		errorFlag = true;
	}
	else{
		let checkingFactors = "432765432";
		let sum = 0;
		for(let i=0; i<9; i++){
			sum += parseInt(cardNumber[i]) * parseInt(checkingFactors[i]);
		}

		let remainder = sum % 11;
		let checkNumber = 11 - remainder;
		if(checkNumber != parseInt(cardNumber[9])){
			document.getElementById("invalidcard_error").style.display = "block";

			if(errorFlag){
				document.getElementById("cardnumber").focus();
				document.getElementById("cardnumber").select();
			}
			errorFlag = true;
		}	
	}
	
	return errorFlag;
}

/*
 * Adds an item to the cart and hides the quantity and add button for the product being ordered.
 *
 * param itemNumber The number used in the id of the quantity, item and remove button elements.
 */
function addItemToCart(itemNumber) {
	// Get the value of the quantity field for the add button that was clicked 
	let quantityValue = document.getElementById("qty" + itemNumber).value.trim();

	// Determine if the quantity value is valid
	if (!isNaN(quantityValue) && quantityValue != "" && quantityValue != null && quantityValue != 0 && !document.getElementById("cartItem" + itemNumber)) {
		// Hide the parent of the quantity field being evaluated
		document.getElementById("qty" + itemNumber).parentNode.style.visibility = "hidden";

		// Determine if there are no items in the car
		if (numberOfItemsInCart == 0) {
			// Hide the no items in cart list item 
			document.getElementById("noItems").style.display = "none";
		}

		// Create the image for the cart item
		let cartItemImage = document.createElement("img");
		cartItemImage.src = "images/" + itemImage[itemNumber - 1];
		cartItemImage.alt = itemDescription[itemNumber - 1];

		// Create the span element containing the item description
		let cartItemDescription = document.createElement("span");
		cartItemDescription.innerHTML = itemDescription[itemNumber - 1];

		// Create the span element containing the quanitity to order
		let cartItemQuanity = document.createElement("span");
		cartItemQuanity.innerHTML = quantityValue;

		// Calculate the subtotal of the item ordered
		let itemTotal = quantityValue * itemPrice[itemNumber - 1];

		// Create the span element containing the subtotal of the item ordered
		let cartItemTotal = document.createElement("span");
		cartItemTotal.innerHTML = formatCurrency(itemTotal);

		// Create the remove button for the cart item
		let cartItemRemoveButton = document.createElement("button");
		cartItemRemoveButton.setAttribute("id", "removeItem" + itemNumber);
		cartItemRemoveButton.setAttribute("type", "button");
		cartItemRemoveButton.innerHTML = "Remove";
		cartItemRemoveButton.addEventListener("click",
			// Annonymous function for the click event of a cart item remove button
			function () {
				// Removes the buttons grandparent (li) from the cart list
				this.parentNode.parentNode.removeChild(this.parentNode);

				// Deteremine the quantity field id for the item being removed from the cart by
				// getting the number at the end of the remove button's id
				let itemQuantityFieldId = "qty" + this.id.charAt(this.id.length - 1);

				// Get a reference to quanitity field of the item being removed form the cart
				let itemQuantityField = document.getElementById(itemQuantityFieldId);

				// Set the visibility of the quantity field's parent (div) to visible
				itemQuantityField.parentNode.style.visibility = "visible";

				// Initialize the quantity field value
				itemQuantityField.value = "";

				// Decrement the number of items in the cart
				numberOfItemsInCart--;

				// Decrement the order total
				orderTotal -= itemTotal;

				// Update the total purchase in the cart
				document.getElementById("cartTotal").innerHTML = formatCurrency(orderTotal);

				// Determine if there are no items in the car
				if (numberOfItemsInCart == 0) {
					// Show the no items in cart list item 
					document.getElementById("noItems").style.display = "block";
				}
			},
			false
		);

		// Create a div used to clear the floats
		let cartClearDiv = document.createElement("div");
		cartClearDiv.setAttribute("class", "clear");

		// Create the paragraph which contains the cart item summary elements
		let cartItemParagraph = document.createElement("p");
		cartItemParagraph.appendChild(cartItemImage);
		cartItemParagraph.appendChild(cartItemDescription);
		cartItemParagraph.appendChild(document.createElement("br"));
		cartItemParagraph.appendChild(document.createTextNode("Quantity: "));
		cartItemParagraph.appendChild(cartItemQuanity);
		cartItemParagraph.appendChild(document.createElement("br"));
		cartItemParagraph.appendChild(document.createTextNode("Total: "));
		cartItemParagraph.appendChild(cartItemTotal);

		// Create the cart list item and add the elements within it
		let cartItem = document.createElement("li");
		cartItem.setAttribute("id", "cartItem" + itemNumber);
		cartItem.appendChild(cartItemParagraph);
		cartItem.appendChild(cartItemRemoveButton);
		cartItem.appendChild(cartClearDiv);

		// Add the cart list item to the top of the list
		let cart = document.getElementById("cart");
		cart.insertBefore(cartItem, cart.childNodes[0]);

		// Increment the number of items in the cart
		numberOfItemsInCart++;

		// Increment the total purchase amount
		orderTotal += itemTotal;

		// Update the total puchase amount in the cart
		document.getElementById("cartTotal").innerHTML = formatCurrency(orderTotal);
	}
}

/*
* Checks that a field has input.
*/
function formFieldHasInput(fieldElement) {
	// Check if the text field has a value
	if (fieldElement.value == null || fieldElement.value.trim() == "") {
		// Invalid entry
		return false;
	}
	// Valid entry
	return true;
}

/*
 * Hides all of the error elements.
 */
function hideErrors() {
	// Get an array of error elements
	let error = document.getElementsByClassName("error");

	// Loop through each element in the error array
	for (let i = 0; i < error.length; i++) {
		// Hide the error element by setting it's display style to "none"
		error[i].style.display = "none";
	}
}

/*
 * Handles the load event of the document.
 */
function load() {
	//	Populate the year select with up to date values
	let year = document.getElementById("year");
	let currentDate = new Date();
	for (let i = 0; i < 7; i++) {
		let newYearOption = document.createElement("option");
		newYearOption.value = currentDate.getFullYear() + i;
		newYearOption.innerHTML = currentDate.getFullYear() + i;
		year.appendChild(newYearOption);
	}
	
	// Add event listener for the form submit
	document.getElementById("orderform").addEventListener("submit", validate);

	document.getElementById("addQuad").addEventListener("click", 
		function(){
			addItemToCart("1");
		});

		document.getElementById("addSpin").addEventListener("click", 
		function(){
			addItemToCart("2");
		});

		document.getElementById("addPickel").addEventListener("click", 
		function(){
			addItemToCart("3");
		});

		document.getElementById("addEggs").addEventListener("click", 
		function(){
			addItemToCart("4");
		});

		document.getElementById("addShrimpy").addEventListener("click", 
		function(){
			addItemToCart("5");
		});

		hideErrors();
		
}

// Add document load event listener
document.addEventListener("DOMContentLoaded", load);