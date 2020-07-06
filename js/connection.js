const hostID = "bingo-Host";
let selfID, peer, con, error;

function genID(id) {
	let rand = "";
	for(let i = 0; i < 9; i++) {
		rand += String.fromCharCode(Math.random() * 26 + 0x41);
	}
	return rand + "-" + id;
}

function setSelf(id) {
	if(peer)
		peer.destroy();
	resetDogs();
	selfID = genID(id);
	peer = new Peer(selfID, {"host": "octopi.local", "key": "happi", "port": 9000});

	if(id != "Guest")
		$(".host").prop("disabled", 1);

	peer.on("open", function(id) {
		console.log("Connected as", id);
		$("#" + id.substr(10)).addClass("connected me");
		con = peer.connect(hostID);

		con.on("error", function(err) {
			console.log("Con Error!", err);
			error = err;
		});

		con.on("open", function() {
			$("#host-status").removeClass("d-none");
		});

		con.on("close", function() {
			$("#host-status").addClass("d-none");
		});

		con.on("data", function(data) {
			console.log("Received", data);

			switch(data["type"]) {
				case "dog":
					processDog(data["value"]);
					$("#last-person").text(data["sender"] + " picked last");
					break;
				case "initial":
					for(let dog of data["dogs"]) {
						processDog(dog);
					}
					for(let user of data["users"]) {
						$("#" + user.substr(10)).addClass("connected");
					}
					break;
				case "thatsAll":
					$("#last-called").css("background-image", "");
					$("#last-called-description").text("That's all");
					break;
				case "reset":
					resetDogs();
					break;
				case "connect":
					$("#" + data["user"].substr(10)).addClass("connected");
					break;
				case "disconnect":
					$("#" + data["user"].substr(10)).removeClass("connected");
					break;
			}
		});
	});

	peer.on("error", function(err) {
		console.warn("Error! Type", err.type);
		alert(err);
		$("#" + selfID.substr(10)).removeClass("connected me");
		$(".host").prop("disabled", 0)
	});
}

function send(json) {
	if(con && con._open) {
		con.send(json);
	} else {
		console.error("Not connected!");
	}
}
