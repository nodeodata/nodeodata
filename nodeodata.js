var nExpress = require("express"),
	app = nExpress();
var nFs = require("fs");

module.exports = {
	createODataServer: function(mSettings) {
		//Create server config
		var noserverConfig = {
			rootDir: mSettings.rootDir || "./",
			host: mSettings.host || "127.0.0.1",
			port: mSettings.port || "5454",
			servicesFile: mSettings.servicesFile || "nodeodata-services.json"
		};
		//TODO: Check for "nodedata-services.json" file exists or not before starting the server
		//start the server to listen on provided host and port
		var noserver = app.listen(noserverConfig.port, noserverConfig.host, function() {
			console.log("OData Server up and running on http://%s:%s", this.address().address, this.address().port);
		});
	}
};

app.get("/*", function(req, res) {
	if (req.url === "/") { //If root of nodeodata-server
		res.sendFile("areyoulost.html", {
			root: __dirname
		});
		return 0;
	}
	nFs.readFile("./nodeodata-services.json", 'utf-8', function(oError, oData) {
		if (!oError) { //File found as expected
			var oServices = JSON.parse(oData);
			var bServiceExist = oServices.hasOwnProperty(req.url.split("/")[1]);
			if (bServiceExist) {
				res.send("Hello Visiter! Resource requested is found. Wait for some more time.. development is still in progress to show you something awesome soon");
			} else {
				res.status(404).send("The resource you are looking for has been removed, had it's name changed, or is temporarily unavailable.");
			}
		} else {
			res.status(500).send({error: "Something Blew Up"});
		}
		
	});
});