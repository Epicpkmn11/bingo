let connections = [];

peer = new Peer("bingo-Host")

peer.on("open", function(id) {
	console.log("Connected as", id);
});

peer.on("connection", function(c) {
	c.on("open", function() {
		console.log("Connected", c.peer);
		connections.push(c);
		let users = [];
		connections.forEach(function(item) { users.push(item.peer); });
		c.send({"type": "initial", "dogs": current, "users": users});
		
		// Tell everyone who connected
		for(let connection of connections) {
			if(connection != c) {
				connection.send({"type": "connect", "user": c.peer});
			}
		}
	});
	c.on("close", function() {
		console.log("Disconnected", c.peer);
		connections = connections.filter(function(item ) { return item != c});
		// Tell everyone who disconnected
		for(let connection of connections) {
			if(connection != c) {
				connection.send({"type": "disconnect", "user": c.peer});
			}
		}
	});
	c.on("data", function(data) {
		console.log("Received", data);

		// Send to all peers except the one that sent it
		for(let connection of connections) {
			if(connection != c) {
				connection.send(data);
			}
		}

		switch(data["type"]) {
			case "dog":
				processDog(data["value"]);
				break;
			case "thatsAll":
				$("#last-called").css("background-image", "");
				$("#last-called-description").text("That's all");
				break;
			case "reset":
				resetDogs();
				break;
		}
	});
});

peer.on("error", function(err) {
	console.warn("Error! Type", err.type);
	alert(err);
});
