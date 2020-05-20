let selfID, peerID, con, peer;

function connect() {
	if(peerID && (!con || !con._open)) {
		console.log("Connecting to", peerID);
		con = peer.connect(peerID);
		con.on("open", function() {
			console.log("Connected to", peerID);
			$("#" + peerID.substr(6)).addClass("connected");
		});
		con.on("close", function() {
			console.log("Disconneced", peerID);
			$("#" + peerID.substr(6)).removeClass("connected");
		})
	}
}

function setSelf(id) {
	selfID = "bingo-" + id;
	peer = new Peer(selfID)
	$("#" + id).prop("disabled", 1);;
	peer.on("error", function(err) {
		console.log("Error! Type", err.type);
		switch(err.type) {
			case "unavailable-id":
			case "invalid-id":
				alert(err);
				$("#" + selfID.substr(6)).prop("disabled", 0);
				$("#" + peerID.substr(6)).prop("disabled", 0);
				break;
			case "network":
				$("#" + selfID.substr(6)).removeClass("connected");
				$("#" + peerID.substr(6)).removeClass("connected");
				$("#" + selfID.substr(6)).prop("disabled", 0);
				$("#" + peerID.substr(6)).prop("disabled", 0);
				break;
		}
	});
	peer.on("open", function(id) {
		console.log("Connected as", id);
		$("#" + id.substr(6)).addClass("connected");
		con = peer.connect(peer);
		connect();
		setInterval(connect, 3000);
	});
	peer.on("connection", function(con) {
		con.on("data", function(data) {
			let parsed = JSON.parse(data);
			console.log("Received", parsed);

			switch(parsed["type"]) {
				case "dog":
					processDog(parsed["value"]);
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
}

function setPeer(id) {
	peerID = "bingo-" + id;
	$("#" + id).prop("disabled", 1);
	connect();
}

function send(json) {
	console.log("Sending", json);
	if(con && con._open) {
		con.send(JSON.stringify(json));
	} else {
		console.error("Not connected!");
	}
}
