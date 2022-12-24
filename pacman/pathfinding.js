const pathNodes = {};

const isPlayerPermiableTile = (char) => /[ep*PG]/.test(char);  

for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
        const id = `${x}-${y}`;

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
            };
        }
    }
}