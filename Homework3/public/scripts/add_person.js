/*
 * add_person.js is a script for the add_person.html page
 *
 * The script uses AJAX form to send a POST request to the server
 *		to update the person/employee records based on input from the user
 *
 * Created by: Ethan Clark (elc3)
 * Homework2 for CS336 Web Development
 * October 24, 2016
 */

// Check that the document is ready to go...
$(document).ready(function() {

	// Get the form attribute from the HTML and on the submit action...
	$("form").submit(function( event ) {

		// Prevent the form from doing the default HTML form submit
		event.preventDefault();

		// Get the form and the person data from the inputs the user entered
		var form = $(this);
		var person_data = {"user_first_name": $("#firstname").val(), "user_last_name": $("#lastname").val(),
							"user_id_number": $("#id_num").val(), "user_start_date": $("#startdate").val()}

		// AJAX call to the server that sends the person_data to the server to use
		$.ajax({
			type: 'POST',
			url: '/people',
			contentType: 'application/json',
			data: JSON.stringify(person_data),
			dataType: 'json',
		})
		.done(function(json_string) {
			json = JSON.parse(json_string)
			$("#tempspot").empty()
			$("#tempspot").append("<p>" + "Thank you for entering " + json.first + " " + json.last + " in the system!" + "</p>")
		})
		.fail(function(xhr, status, errorThrown) {
			alert("There was a problem:");
			console.log("Error: " + errorThrown);
			console.log("Status: " + status);
		})
	});

});