console.log("Start script...");

// Game const
const shot = document.getElementById("shot");
const record = document.getElementById("record");
const hit = document.getElementById("hit");
const dead = document.getElementById("dead");
const table = document.getElementById("enemy");
const buttonAgain = document.getElementById("again");

// Game class
const game = {
	record: 0,
	shot: 0,
	hit: 0,
	dead: 0
};

const state = {
	hit(element) {
		this.changeState(element, 'hit')
	},
	changeState(element, value) {
		element.className = value;
	}
}

// Get fire
const fire = (event) => {
	console.log(event.target);
	state.hit(event.target);
};

// Game initialization
const init = () => {
	table.addEventListener('click', fire);
};

init();