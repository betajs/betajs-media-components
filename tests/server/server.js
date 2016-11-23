var Express = require("express");
var FS = require("fs");
var Multer = require("multer");
var Ffmpeg = require("js-ffmpeg");


//In case if require SSL based hostname, also please uncomment below code
// var https = require('https');
// var fs = require('fs');
// var path = require('path');
//
// var options = {
// 	key: fs.readFileSync(path.join(__dirname, '/ssl/server.key')),
// 	cert: fs.readFileSync(path.join(__dirname, '/ssl/server.crt')),
// 	requestCert: false,
// 	rejectUnauthorized: false
// };

var express = Express();
var upload = Multer({ storage: Multer.memoryStorage() });
var port = 6001;

express.use("/static", Express["static"](__dirname + '/static'));
express.use("/assets", Express["static"](__dirname + '/../..'));

express.get('/files/:filename', function (request, response) {
	console.log("Streaming " + request.params.filename);
	response.sendFile(__dirname + "/temp/" + request.params.filename);
});

express.post("/files/:filename", upload.single('file'), function (request, response) {
	console.log("Storing " + request.params.filename);
	FS.writeFileSync(__dirname + "/temp/" + request.params.filename, request.file.buffer);
	response.status(200).send({});
});

express.post("/files/:source/transcode/:target", function (request, response) {
	var target = __dirname + "/temp/" + request.params.target;
	var video_source = __dirname + "/temp/" + request.params.source;
	var audio_source = request.query.audio ? __dirname + "/temp/" + request.query.audio : null;
	var sources = [video_source];
	if (audio_source)
		sources.push(audio_souce);
	console.log("Transcoding " + request.params.source + (request.query.audio ? " + " + request.query.audio : "") + " -> " + request.params.target);
	Ffmpeg.ffmpeg_simple(sources, {}, target).callback(function (error, value) {
		response.status(200).send({});
	});
});

// //In the case if require SSL based hostname
// https.createServer(options, express).listen(port, function () {
// 	console.log('Server started and listen port %s., Full path: https://localhost:%s/static/index.html', port, port);
// });

express.listen(port, function () {
	console.log("Listening on", port);
});