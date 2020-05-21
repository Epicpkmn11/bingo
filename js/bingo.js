const names = ["Bear Dogs","Black and White","Blue Bowtie","Blue Bandana","Bread Dog","Churro","Crown","Dog and Cat","Flower Crown","Frisbee","German Shepard","Gold Bandana","Golden Retriever","Green Bandana","Heart Happi","Hibiscus","Husky","Jester and Queen","Lilacs","Minnie Mouse Dog","Misty","Music Note","Pancakes","Pink Bandana","Pink Bow","Purple Bandana","Red Bowtie",	"Red Car","Rose","Sailboat","Side Eye","Stethoscope","Sunglasses","Taco Dog","Toby Badge","Two Doodles","U of M Color","Waffle","White Fluffy"];
let dogs = names.slice(0);
let current = [];
let deckNo = 0;

function reset() {
	resetDogs();
	send({"type": "reset"});
}

function resetDogs() {
	dogs = names.slice(0);
	current = [];
	$("#decks").html("<div class='card-deck' id='deck0'></div>");
	$("#last-called").css("background-image", "");
	$("#last-called-description").text("");
	deckNo = 0;
	cardNo = 0;
}

function processDog(index) {
	console.log("Processing", index);
	// Remove the dog from the array
	let dog = dogs[index];
	dogs[index] = dogs[dogs.length - 1];
	dogs.pop();

	current.push(index);

	if($("#deck" + deckNo).children().length == 5) {
		let deck = document.createElement("div");
		deck.id = "deck" + ++deckNo;
		deck.classList = "card-deck";
		$("#decks").prepend(deck);
	}
	let card = document.createElement("div");
	card.id = "card" + (deckNo * 5 + $("#deck" + deckNo).children().length);
	card.classList = "called card";
	card.style.backgroundImage = "url('images/" + dog + ".png')";
	$("#deck" + deckNo).prepend(card);
	$("#last-called").css("background-image", "url('images/" + dog + ".png')");
	$("#last-called-description").text(dog);
}

function pickDog() {
	if(dogs.length > 0) {
		let index = Math.floor(Math.random() * dogs.length);
		processDog(index);
		if(selfID) {
			send({"type": "dog", "value": index, "sender": selfID.substr(6)});
		}
	} else {
		$("#last-called").css("background-image", "");
		$("#last-called-description").text("That's all");
		send({"type": "thatsAll"});
	}
	if(selfID)
		$("#last-person").text(selfID.substr(6) + " last picked");
	$("#pick-dog").prop("disabled", 1);
	setTimeout(function() {
		$("#pick-dog").prop("disabled", 0);
	}, 3000);
}