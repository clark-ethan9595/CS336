/*
 * script.js contains the necessary jQuery/AJAX functions for lab7.html
 * Created by: Ethan Clark
 * October 19, 2016
 */

// If the document is ready...
$(document).ready(function() {

    // Creating a new DOM element and adding it to the document
    var myNewParagraph = $("<p>", {
        html: "",
        "id": "new",
    });
    myNewParagraph.appendTo("body");

    // If the Get Data button is pushed...
    $("button#get-data").click(

        // Request a GET method from the server with appropriate data
        //      and display it on the browser
    	function() {
    		console.log("AJAX request issued...");
    		$.ajax({
    			url: "/hello",
    			type: "GET",
    			data: {
    				name: "Lab07"
    			}
    		})
    		.done(function(result){
    			console.log("AJAX request succeeded")
    			$("#new").html(result.message);
    		})
    		.fail(function(xhr, status, errorThrown) {
    			console.log("AJAX request failed...");
    		})
    	});
});