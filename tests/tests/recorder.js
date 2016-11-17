/* This probably requires some Selenium-type interaction */
mytest("simulate recording", function () {
	$("#visible-fixture").html('<br/><ba-videorecorder ba-width=400 ba-height=300 ba-theme="modern" ba-simulate ba-localplayback></ba-videorecorder>');
	var dyn = BetaJS.Dynamics.Dynamic.activate({
		element: $("#visible-fixture").get(0)
	});
	var recorder = dyn.scope(">[tagname='ba-videorecorder']").materialize(true);
    // Click Record
   	$("[ba-click='primary()']").click();
    recorder.host.on("start:CameraHasAccess", function () {
        // Record Button
    	$("[onclick]:visible").last().click();
    });
    recorder.host.on("start:Recording", function () {
    	// Stop after 5 minutes
    	setTimeout(function () {
            // Stop Button
        	$("[onclick]:visible").last().click();
    	}, 10000);
    });
    recorder.host.on("start:CovershotSelection", function () {
    	$("[data-gallery-container]").children().last().click();
    });
    recorder.host.on("start:Player", function () {
    	setTimeout(function () {
    		recorder.destroy();
    		$("#visible-fixture").html("");
        	ok(true);
        	start();
    	}, 1000);
    });
}, {selenium: true});
