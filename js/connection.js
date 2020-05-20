const hostID = "bingo-Host";
let selfID, peer, con;

function setSelf(id) {
	selfID = id ? "bingo-" + id : id;
	peer = new Peer(selfID);

	$(".host").prop("disabled", 1);

	peer.on("open", function(id) {
		console.log("Connected as", id);
		$("#" + id.substr(6)).addClass("connected");
		con = peer.connect(hostID);
		con.on("data", function(data) {
			console.log("Received", data);

			switch(data["type"]) {
				case "dog":
					processDog(data["value"]);
					$("#last-person").text(data["sender"] + " picked last");
					break;
				case "initial":
					for(let dog of data["value"]) {
						processDog(dog);
					}
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
		$("#" + selfID.substr(6)).removeClass("connected");
		$(".host").prop("disabled", 1)
	});
}

function send(json) {
	if(con && con._open) {
		con.send(json);
	} else {
		console.error("Not connected!");
	}
}
