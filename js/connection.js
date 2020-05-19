let selfID, peerID, con, peer;

function connectionCheck() {
	if(!con._open) {
		connect();
		document.getElementById("status").classList = "disconnected";
		document.getElementById("status").innerHTML = "Disconnected";
	} else {
		document.getElementById("status").classList = "connected";
		document.getElementById("status").innerHTML = "Connected";
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

function setSelf() {
	selfID = "bingo-" + document.getElementById("selfID").value;
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
			console.log("Received", data);

			if(data.includes("ball-")) {
				processBall(data.substr(5));
			} else if(data.includes("grid-")) {
				let grid = [];
				let arr = data.substr(5).split(",");
				for(let y = 0; y < 5; y++) {
					let row = [];
					for(let x = 0; x < 5; x++) {
						row.push(arr[y * 5 + x]);
					}
					grid.push(row);
				}
				populate(grid);
			} else if(data.includes("message-")) {
				let p = document.createElement("p");
				p.append(peerID.substr(6) + ": " + data.substr(8));
				document.getElementById("messages").appendChild(p);
			}
		});
	});
}

function setPeer() {
	peerID = "bingo-" + document.getElementById("peerID").value;
	connect();
}

function send(prefix, value) {
	console.log("Sending", value);
	if(con && con._open) {
		con.send(prefix + "-" + value);
		if(prefix == "message") {
			let p = document.createElement("p");
			p.append(selfID.substr(6) + ": " + value);
			document.getElementById("messages").appendChild(p);

			document.getElementById("input").value = "";
		}
	} else {
		console.error("Not connected!");
	}
}
