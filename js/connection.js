const hostID = "bingo-Host";
let selfID, peerID, con, conHost, peer;

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
	if(selfID != hostID && (!conHost || !conHost._open)) {
		console.log("Connecting to", hostID);
		conHost = peer.connect(hostID);
		conHost.on("open", function() {
			console.log("Connected to", hostID);
			$("#host-status").removeClass("d-none");
		});
		conHost.on("close", function() {
			console.log("Disconneced", hostID);
			$("#host-status").addClass("d-none");
		})
	}
}

function setSelf(id) {
	selfID = "bingo-" + id;
	peer = new Peer(selfID)
	$("#" + id).prop("disabled", 1);;
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
					if(peerID)
						$("#last-person").text(peerID.substr(6) + " picked last");
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
		console.error("Not connected!", peerID);
	}
	if(conHost && conHost._open) {
		conHost.send(JSON.stringify(json));
	} else {
		console.error("Not connected!", hostID);
	}
}
