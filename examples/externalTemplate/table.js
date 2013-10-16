$(document).ready(function() {
	var companies = [
		{ name: "Tecnolife", city: "Rome" },
		{ name: "Google", city: "MountainView" },
		{ name: "Yahoo", city: "San José" },
		{ name: "Facebook", city: "Menlo Park" }
	];

	$("#rowsTemplate").load("template.html");
	var template = new metamorphosis($("#rowsTemplate").html());
	$("#myTable").append(template.render(companies));
});