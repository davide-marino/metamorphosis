$(document).ready(function() {
	var companies = [
		{ name: "Tecnolife", city: "Rome" },
		{ name: "Google", city: "MountainView" },
		{ name: "Yahoo", city: "San Jos�" },
		{ name: "Facebook", city: "Menlo Park" }
	];

	var template = new metamorphosis($("#rowsTemplate").html());
	$("#myTable").append(template.render(companies));
});