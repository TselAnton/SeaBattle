const shot = document.getElementById("shot");
const record = document.getElementById("record");
const hit = document.getElementById("hit");
const dead = document.getElementById("dead");
const table = document.getElementById("enemy");
const buttonAgain = document.getElementById("again");

const numOfTrying = 5;

// Ships count
const fiveLengthShip = 1;
const fourLengthShip = 2;
const threeLengthShip = 3;
const twoLengthShip = 4;
const oneLengthShip = 5;

// Game parameters
const gameParameters = {
	record: 0,
	shot: 0,
	hit: 0,
	dead: 0,
	madeMoves: [],
	ships: [],
	resetParameters() {
		this.short = 0;
		this.hit = 0;
		this.dead = 0;
		this.madeMoves = [];
		this.generateShips();
	},
	generateShips() {
		numOfGenerated = 0;
		while (numOfGenerated < 5) {
			this.ships = [];
			numOfGenerated += generateManyShips(fiveLengthShip, 5);
			numOfGenerated += generateManyShips(fourLengthShip, 4);
			numOfGenerated += generateManyShips(threeLengthShip, 3);
			numOfGenerated += generateManyShips(twoLengthShip, 2);
			numOfGenerated += generateManyShips(oneLengthShip, 1);
		}
	}
};

// Generation many ships
const generateManyShips = (shipCount, shipLength) => {
	console.log("Генерация " + shipLength + "-палубных кораблей в количестве: " + shipCount + " шт.");
	for (var i = 0; i < shipCount; i++) {
		generateOneShip(shipLength);
	}
}

// Generation one ship
const generateOneShip = (shipLength) => {
	isNormalGenerated = false;
	trying = 0;
	
	while(!isNormalGenerated) {
		trying++;
		
		//Generate head of ship
		head = getRandomInt(100);
		while (!isEmptyCell(head)) {
			head = getRandomInt(100);
		}
	
		// Chose direction of generation
		dir = getRandomInt(4);
		for (var i = 0; i < 4; i++) {
			dir = (++dir) % 4;
			if (isCanBeGenerated(head, dir, shipLength)) {
				isNormalGenerated = true;
				console.log(shipLength + "-палубный корабль сгенерировался");
				return true;
			}
		}
		
		if (trying == numOfTrying) {
			return false;
		}
	}
}

// Check is ship can create in this direction
const isCanBeGenerated = (head, dir, shipLength) => {
	shipCoordinate = [];
	for (var i = 0; i < shipLength; i++) {
		if (dir == 0) {			// Down
			head += 10;
		} else if (dir == 1) {	// Up
			head -= 10;
		} else if (dir == 2) {	// Left
			head -= i;
		} else {				// Right
			head += i;
		}
		if (head > 99 || head < 0 || !isEmptyAround(head)) {
			return false;
		}
		shipCoordinate.push(head);
	}
	gameParameters.ships = gameParameters.ships.concat(shipCoordinate);
	return true;
}

// Check is cells is empty around the cell
const isEmptyAround = (cell) => {
	// Check left
	if (!((cell % 10 == 0) || (isEmptyCell(cell -1)))) {
		return false;
	}
	// Check left-down
	if (!((cell % 10 == 0) || (cell + 9 > 99) || isEmptyCell(cell + 9))) {
		return false;
	}
	// Check down
	if (!((cell + 10 > 99) || (isEmptyCell(cell + 10)))) {
		return false;
	}
	// Check right-down
	if (!((cell + 10 > 99) || (cell + 1 % 10 == 0) || (isEmptyCell(cell + 11)))) {
		return false;
	}
	// Check right
	if (!((cell + 1 % 10 == 0) || isEmptyCell(cell + 1))) {
		return false;
	}
	// Check up-right
	if (!((cell + 1 % 10 == 0) || (cell - 10 < 0) || (isEmptyCell(cell - 9)))) {
		return false;
	}
	// Check up
	if (!((cell - 10 < 0) || (isEmptyCell(cell - 10)))) {
		return false;
	}
	// Check left-up
	if (!((cell - 10 < 0) || (cell % 10 == 0) || (isEmptyCell(cell - 11)))) {
		return false;
	}
	return true;
}

// Compare with already created ships
const isEmptyCell = (cell) => {
	if (gameParameters.ships.length == 0) {
		return true;
	}
	
	for (var i = 0; i < gameParameters.ships.length; i++) {
		if (gameParameters.ships[i] == cell) {
			return false;
		}
	}
	return true;
}

// Cell state
const state = {
	hit(element) {
		this.changeState(element, "hit");
	},
	miss(element) {
		this.changeState(element, "miss");
	},
	dead(r, c) {
		console.log("Table is: " + table)
		console.log("Rows is: " + table.rows[r])
		console.log("Cells is: " + table.rows[r].cells[c])
		this.changeState(table, "dead"); //TODO
	},
	clear(element) {
	    this.changeState(element, "");
	},
	changeState(element, value) {
		element.className = value;
	}
}

// Check hit or miss. Chang hit to dead
const doFire = (target) => {
	if (isHit(target.id)) {
		state.hit(target);
		checkDeadOfShip(target.id);
	} else {
		state.miss(target);
	}
}

// Check is dead ship
const checkDeadOfShip = (cell) => {
	cell = parseInt(cell);
	shipCoordinates = [cell];
	isDead = true; 
	
	if (isHit(cell - 10) || isHit(cell + 10)) {		// The ship is vertical
		for (var i = 1; i < 5; i++) {
			upperCell = cell - 10 * i
			if ((!isHit(upperCell))) {
				break;
			} else if (isNewMove(upperCell)) {
				isDead = false;
				break;
			} else {
				shipCoordinates.push(upperCell);
			}
		}
		for (var i = 1; i < 5; i++) {
			lowerCell = cell + 10 * i
			if ((!isHit(lowerCell))) {
				break;
			} else if (isNewMove(lowerCell)) {
				isDead = false;
				break;
			} else {
				shipCoordinates.push(lowerCell);
			}
		}
	} else { 										// The ship is horizontal
		for (var i = 1; i < 5; i++) {
			leftCell = cell - i
			if ((!isHit(leftCell))) {
				break;
			} else if (isNewMove(leftCell)) {
				isDead = false;
				break;
			} else {
				shipCoordinates.push(leftCell);
			}
		}
		for (var i = 1; i < 5; i++) {
			rightCell = cell + i
			if ((!isHit(rightCell))) {
				break;
			} else if (isNewMove(rightCell)) {
				isDead = false;
				break;
			} else {
				shipCoordinates.push(rightCell);
			}
		}
	}
	
	if (isDead) {
		for (var i = 0; i < shipCoordinates.length; i++) {
			state.dead(shipCoordinates[i]);
		}
	}
}

// Check for ship on cell
const isHit = (cell) => {
	for (var i = 0; i < gameParameters.ships.length; i++) {
		if (gameParameters.ships[i] == cell) {
			return true;
		}
	}
	return false;
}

// Compare with already dided moves
const isNewMove = (id) => {
	for (var i = 0; i < gameParameters.madeMoves.length; i++) {
		if (gameParameters.madeMoves[i] == id) {
			return false;
		}
	}
	return true;
}

// Get Random Integer Num
const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
}

// Do click
const doClick = (item) => {
	target = item.target;
	if (target.id != "") {
		cellId = target.id;
		if (isNewMove(cellId)) {
			console.log("Сделан ход в ячейку " + cellId);
			gameParameters.madeMoves.push(cellId);
			doFire(target);
		} else {
			console.log("Невозможно сделать повторный ход!");
		}
	}
};

// Reset Game
const resetGame = () => {
	console.log("Сброс игровых параметров");
    gameParameters.resetParameters();
    for (i = 0; i < 10; i++) {
        for (j = 0; j < 10; j++) {
            state.clear(table.rows[j].cells[i]);
        }
    }
};

// Game initialization
const init = () => {
	gameParameters.generateShips();
	table.addEventListener('click', doClick);
	buttonAgain.addEventListener('click', resetGame);
};
init();