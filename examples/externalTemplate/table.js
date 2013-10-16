$(document).ready(function() {
	loadTemplate();
});

function loadTemplate() {
	$.ajax({async: false, dataType: "html", url: "template.html", success: createAndRenderTemplate});
}

function createAndRenderTemplate(data) {
	var companies = [
		{ name: "Tecnolife", city: "Rome" },
		{ name: "Google", city: "MountainView" },
		{ name: "Yahoo", city: "San José" },
		{ name: "Facebook", city: "Menlo Park" }
	];

	var template = new metamorphosis(data);
	$("#myTable").append(template.render(companies));
}