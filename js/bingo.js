let balls = [];

function generateGrid() {
	let grid = [];
	for(let col = 0; col < 5; col++) {
		let values = [];
		for(let i = 0; i < 15; i++) {
			values.push((col * 15) + i + 1);
		}

		let arr = []
		for(let row = 0; row < 5; row++) {
			let index = Math.floor(Math.random() * values.length);
			arr.push(values[index]);
			values[index] = values[values.length - 1];
			values.pop();
		}
		grid.push(arr);
	}
	console.log(grid);
	populate(grid);
	send("grid", grid);
}

function populate(grid) {
	for(let col = 0; col < 5; col++) {
		for(let row = 0; row < 5; row++) {
			document.getElementById("r" + row + "c" + col).innerHTML = grid[col][row];
			document.getElementById("r" + row + "c" + col).style.backgroundColor = "";
		}
	}

	// Center is free
	document.getElementById("r2c2").innerHTML = "FREE";
	document.getElementById("r2c2").style.backgroundColor = "green";

	// Fill balls array
	for(let i = 0; i < 75; i++) {
		balls[i] = i + 1;
	}

	// Clear balls chosen
	document.getElementById("ballsChosen").innerHTML = "Balls chosen: ";
}

function processBall(index) {
	console.log("Processing", index)
	// Remove the ball from the array
	let ball = balls[index];
	balls[index] = balls[balls.length - 1];
	balls.pop();

	document.getElementById("ballsChosen").innerHTML += ball + ", ";

	// If that number is on the card, change the background to green
	for(let cell of document.getElementsByTagName("td")) {
		if(cell.innerHTML == ball) {
			cell.style.backgroundColor = "green";
		}
	}
}

function pickBall() {
	if(balls.length > 0) {
		let index = Math.floor(Math.random() * balls.length);
		processBall(index);
		send("ball", index);
	}
}