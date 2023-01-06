const pathNodes = {};
const getPathNodeId = (x, y) => `${x}-${y}`;
console.log('here1');
const isPlayerPermeableTile = (char) => /[ep*PGF]/.test(char); 

const CANTOR_PAIRS_TILL_25 = (() => {
    const output = [[0, 0]];
    let direction = 'right';
    let turningStep = 1;
    let step = 0;
    for (let i = 1; i < 25; i++) {
        prevX = output[i - 1][0];
        prevY = output[i - 1][1];
        step++;

        switch(direction) {
            case 'down': {
                output[i] = [prevX, prevY + 1];
                if (step === turningStep) {
                    direction = 'right';
                    step = 0;
                    turningStep++;
                }
                break;
            }
            case 'left': {
                output[i] = [prevX - 1, prevY];
                if (step === turningStep) {
                    direction = 'down';
                    step = 0;
                }
                break;
            }
            case 'up': {
                output[i] = [prevX, prevY - 1];
                if (step === turningStep) {
                    direction = 'left';
                    step = 0;
                    turningStep++;
                }
                break;
            }
            case 'right': {
                output[i] = [prevX + 1, prevY];
                if (step === turningStep) {
                    direction = 'up';
                    step = 0;
                }
                break;
            }
        }
    }
    return output;
})();

const findClosestPathNode = (x, y) => {
	const roundedX = Math.round(x);
	const roundedY = Math.round(y);
    return CANTOR_PAIRS_TILL_25.reduce((pathNode, [relX, relY]) => {
        if (pathNode) {
            return pathNode;
        }
        const id = getPathNodeId(roundedX + relX, roundedY+ relY);
        console.log(pathNodes[id], id, 
        return pathNodes[id]; 
    }, null);
}

console.log('here1');

for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
        const id = getPathNodeId(x, y);

        const cur = mapData[y][x]; 
        const top = y === 0 ? null : mapData[y - 1][x]; 
        const bot = y === rows - 1 ? null : mapData[y + 1][x]; 
        const lft = x === 0 ? null : mapData[y][x - 1]; 
        const rgt = x === columns + 1 ? null : mapData[y][x + 1]; 
        
        if (!isPlayerPermeableTile(cur)) continue;

        const canGoUp = isPlayerPermeableTile(top);
        const canGoDown = isPlayerPermeableTile(bot);
        const canGoLeft = isPlayerPermeableTile(lft);
        const canGoRight = isPlayerPermeableTile(rgt);

        const horizontals = [canGoLeft, canGoRight];
        const verticals = [canGoUp, canGoDown];

        if (horizontals.includes(true) && verticals.includes(true)) {
            pathNodes[id] = {
                top: canGoUp,
                bottom: canGoDown,
                left: canGoLeft,
                right: canGoRight,
                x,
                y,
            };
        };
        
    };
};

const opposites = {
	left: 'right',
	top: 'bottom',
	right: 'left',
	bottom: 'top',
};

const horizontals = ['left', 'right'];
const verticals = ['up', 'bottom'];

const areDirectionsParallel = (dir1, dir2) => (horizontals.includes(dir1) && horizontals.includes(dir2)) || (verticals.includes(dir1) && verticals.includes(dir2));

const getPossibleNextDirections = (state) => {
	const currentDirection = state.player.direction;
	const directions = [opposites[currentDirection]];
	const closestPathNode = findClosestPathNode(state.player.x, state.player.y);
	
	if (closestPathNode == null) {
        return directions;
    }
	
	if (horizontals.includes(currentDirection)) {
        const { top, bottom } = closestPathNode;
        if (top) {
        	directions.push('top');
        }
        if (bottom) {
        	directions.push('bottom');
        }
	} else {
		const { left, right } = closestPathNode;
        if (left) {
        	directions.push('left');
        }
        if (right) {
        	directions.push('right');
        }
    }
    return directions;
}
console.log('here1');