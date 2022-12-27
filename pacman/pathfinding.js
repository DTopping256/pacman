const pathNodes = {};
const getPathNodeId = (x, y) => `${x}-${y}`;

const isPlayerPermiableTile = (char) => /[ep*PG]/.test(char); 

const CANTOR_PAIRS_TILL_25 = (() => {
    const output = [[0, 0]];
    let direction = 'right';
    let turningStep = 1;
    let step = 0;
    for (let i = 1; i < 26; i++) {
        prevX = output[i - 1][0];
        prevY = output[i - 1][1];
        step++;

        switch(direction) {
            case 'down': {
                output[i] = [prevX, prevY + 1];
                if (step === turningStep) {
                    direction = 'up';
                    step = 0;
                    turningStep++;
                }
            }
            case 'left': {
                output[i] = [prevX - 1, prevY];
                if (step === turningStep) {
                    direction = 'down';
                    step = 0;
                }
            }
            case 'up': {
                output[i] = [prevX, prevY - 1];
                if (step === turningStep) {
                    direction = 'left';
                    step = 0;
                    turningStep++;
                }
            }
            case 'right': {
                output[i] = [prevX + 1, prevY];
                if (step === turningStep) {
                    direction = 'up';
                    step = 0;
                }
            }
        }
    }
    return output;
});

console.log(CANTOR_PAIRS_TILL_25);

const findClosestPathNodeToPixelCoordinates = (pixelX, pixelY) => {
    const startX = Math.round((pixelX - SCREEN_OFFSET) / gridUnitX);
    const startY = Math.round((pixelY - SCREEN_OFFSET) / gridUnitY);

    return CANTOR_PAIRS_TILL_25.reduce((pathNode, [relX, relY]) => {
        if (pathNode) return pathNode;
        const id = getPathNodeId(startX + relX, startY + relY);
        return pathNodes[id]; 
    }, null);
}

for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
        const id = getPathNodeId(x, y);

        const cur = mapData[y][x]; 
        const top = y === 0 ? null : mapData[y - 1][x]; 
        const bot = y === rows - 1 ? null : mapData[y + 1][x]; 
        const lft = x === 0 ? null : mapData[y][x - 1]; 
        const rgt = x === columns + 1 ? null : mapData[y][x + 1]; 
        
        if (!isPlayerPermiableTile(cur)) break;

        const canGoUp = isPlayerPermiableTile(top);
        const canGoBottom = isPlayerPermiableTile(bottom);
        const canGoLeft = isPlayerPermiableTile(left);
        const canGoRight = isPlayerPermiableTile(right);

        const horizontals = [canGoLeft, canGoRight];
        const verticals = [canGoUp, canGoDown];

        if (horizontals.includes(true) && verticals.includes(true)) {
            pathNodes[id] = {
                top: canGoUp,
                bottom: canGoBottom,
                left: canGoLeft,
                right: canGoRight,

                x: (gridUnitX * x) + SCREEN_OFFSET,
                y: (gridUnitY * y) + SCREEN_OFFSET
            };
        }
    }
}