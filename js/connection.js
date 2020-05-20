let selfID, peerID, con, peer;

function connectionCheck() {
	if(!con._open)  {
		document.getElementById(peerID.substr(5)).classList.remove("connected");
	} else {
		document.getElementById(peerID.substr(5)).classList.add("connected");
	}
}

function connect() {
	if(peerID) {
		console.log("Connecting to", peerID);
		con = peer.connect(peerID);
		con.on("open", function() {
			console.log("Connected to", peerID);
			con.send("hi! .o/");
		});
	}
}

function setSelf(id) {
	selfID = "bingo-" + id;
	peer = new Peer(selfID);
	peer.on("error", function(err) {
		console.log("Error! Type", err.type);
		if(err.type == "unavailable-id" || err.type == "invalid-id") {
			alert(err);
		}
	});
	peer.on("open", function(id) {
		console.log("Connected as", id);
		con = peer.connect(peer);
		setInterval(connectionCheck, 3000);
	});
	peer.on("connection", function(con) {
		con.on("data", function(data) {
			let parsed = JSON.parse(data);
			console.log("Received", parsed);

			if(parsed["type"] == "dog") {
				processDog(parsed["value"]);
			}
		});
	});
}

function setPeer(id) {
	peerID = "bingo-" + id;
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
