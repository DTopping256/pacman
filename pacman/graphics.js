// Color Pallette
const COLOR_WHITE = 'white';
const COLOR_OFF_WHITE = '#FFFFCC';
const COLOR_YELLOW = 'yellow';
const COLOR_BLUE = 'blue';

const COLOR_SHADOW_RED = 'red';  
const COLOR_PINKY_PINK = '#FFCDD5'  
const COLOR_INKY_BLUE = 'aqua';  
const COLOR_CLYDE_ORANGE = '#FF9D5C';  

const WALL_COLOR_PRIMARY = COLOR_BLUE;
const WALL_COLOR_SECONDARY = COLOR_OFF_WHITE;

// Graphics constants
const SCREEN_SCALE = 5;
const SCREEN_OFFSET = 50;
const POINT_RADIUS = 10;
const FLASHY_POINT_RADIUS = 20;
const FLASHY_POINT_DISPLAY_INTERVAL_TICKS = 100;
const WALL_COLOR_CHANGE_INTERVAL_TICKS = 25;

const PLAYER_RADIUS = 40;
const PLAYER_ANIMATION_START_FRAME = 6;
const PLAYER_MOUTH_OPENING_ANGLE_OVER_TIME_PI_RADIANS = [0, .05, .1, .15, .2, .3, .45, .5, 0.65];
const PLAYER_MOUTH_SPEED = 1;

// Canvas graphics setup
const gameCanvas = document.getElementById('game');
const context = gameCanvas.getContext('2d');

const {width, height} = gameCanvas.getBoundingClientRect();
gameCanvas.width = height * SCREEN_SCALE;
gameCanvas.height = height * SCREEN_SCALE;

const gridUnitX = (gameCanvas.width - SCREEN_OFFSET) / columns;
const gridUnitY = (gameCanvas.height - SCREEN_OFFSET) / rows;

const halfGridUnitX = Math.round(gridUnitX / 2);
const halfGridUnitY = Math.round(gridUnitY / 2);

// Canvas context manipulation
const drawPoint = ({x, y}) => {
    context.fillStyle = 'white';
    context.beginPath();
    context.arc(x, y, POINT_RADIUS, 0, 2*Math.PI);
    context.fill();    
}

const fruitLevels = ['cherry'];

const drawFruit = ({x, y, level}) => {
	const mapMidpointX = columns / 2 * gridUnitX;
	
    var img = new Image(); 
    img.onload = function() {
        context.drawImage(img, mapMidpointX - halfGridUnitX, y - halfGridUnitY, gridUnitX, gridUnitY);
    }
    img.src = bonusItemSVGs[fruitLevels[level-1]];
}

const clearFlashyPoint = ({x, y}) => {
    context.clearRect(x - FLASHY_POINT_RADIUS, y - FLASHY_POINT_RADIUS, FLASHY_POINT_RADIUS * 2, FLASHY_POINT_RADIUS * 2);
}

const drawFlashyPoint = ({x, y}) => {
    context.fillStyle = 'white';
    context.beginPath();
    context.arc(x, y, FLASHY_POINT_RADIUS, 0, 2*Math.PI);
    context.fill();
}

const drawWall = ({x, y, position, color}) => {
    context.strokeStyle = color;
    context.lineWidth = '10';

    context.beginPath();
    if (position === 'top') {
        context.moveTo(x - halfGridUnitX, y - halfGridUnitY);
        context.lineTo(x + halfGridUnitX, y - halfGridUnitY);
    }
    else if (position === 'bottom') {
        context.moveTo(x - halfGridUnitX, y + halfGridUnitY);
        context.lineTo(x + halfGridUnitX, y + halfGridUnitY);
    }
    else if (position === 'left') {
        context.moveTo(x - halfGridUnitX, y - halfGridUnitY);
        context.lineTo(x - halfGridUnitX, y + halfGridUnitY);
    }
    else if (position === 'right') {
        context.moveTo(x + halfGridUnitX, y - halfGridUnitY);
        context.lineTo(x + halfGridUnitX, y + halfGridUnitY);
    }
    context.stroke();
}

const drawGate = ({x,y}) => {
	context.strokeStyle = "white";
	context.lineWidth = '20';
	
	context.beginPath();
	context.moveTo(x - halfGridUnitX, y);
    context.lineTo(x + halfGridUnitX, y);
    context.stroke();
}

const playerAnimation = [...PLAYER_MOUTH_OPENING_ANGLE_OVER_TIME_PI_RADIANS, ...PLAYER_MOUTH_OPENING_ANGLE_OVER_TIME_PI_RADIANS.slice(1, PLAYER_MOUTH_OPENING_ANGLE_OVER_TIME_PI_RADIANS.length - 2).reverse()];
const getPlayerAnimationFrame = (t) => playerAnimation[Math.round(t / PLAYER_MOUTH_SPEED + PLAYER_ANIMATION_START_FRAME) % playerAnimation.length];

const drawPlayer = ({x, y, t, direction, isMoving}) => {
    let mouthOpenAngle = 0;
    if (isMoving) {
        mouthOpenAngle = getPlayerAnimationFrame(t);
    }

    let rotation;
    let extraEndAngle = 0;
    switch(direction) {
        case 'top': {
            rotation = 3/2 * Math.PI;
            extraEndAngle = Math.PI;
            break;
        }
        case 'left': {
            rotation = Math.PI;
            break;
        }
        case 'bottom': { 
            rotation = 1/2 * Math.PI;
            extraEndAngle = Math.PI;
            break;
        }
        default: { 
            rotation = 0;
            break;
        }
    }

    const startAngle = mouthOpenAngle / 2 * Math.PI + rotation;
    const endAngle = 2 * Math.PI - (startAngle + 0.05) + extraEndAngle;

    context.fillStyle = COLOR_YELLOW;
    context.beginPath();
    context.arc(x, y, PLAYER_RADIUS, startAngle, endAngle);
    context.lineTo(x, y);
    context.fill();
}

const clearPlayer = ({x, y}) => {
    context.clearRect(x - PLAYER_RADIUS, y - PLAYER_RADIUS, PLAYER_RADIUS * 2, PLAYER_RADIUS * 2);
}


// Logic

const shouldClearFlashyPoint = (t) => Math.round(t / FLASHY_POINT_DISPLAY_INTERVAL_TICKS) % 2 === 0;

const shouldChangeWallColor = (t) => Math.round(t / WALL_COLOR_CHANGE_INTERVAL_TICKS) % 2 === 0;

const resetGraphics = () => {
	context.clearRect(0, 0, gameCanvas.width, gameCanvas.height); 
    renderedEntities = { points: [], fruit: undefined, flashyPoints: {}, walls: {} };
}

let renderedEntities;
resetGraphics();

// Will draw the given thing, if it has not been drawn or needs re-drawing.
const requestDrawMapEntity = (entityType, gridX, gridY, t, state) => {
    const x = Math.round(gridUnitX * gridX + SCREEN_OFFSET);
    const y = Math.round(gridUnitY * gridY + SCREEN_OFFSET);
    const id = `${entityType}-${x}-${y}`;

    let wallColor = WALL_COLOR_PRIMARY;
    if (state.progress === 'LEVEL_COMPLETE' && shouldChangeWallColor(t - state.tickChanged)) {
        wallColor = WALL_COLOR_SECONDARY;
    }

    switch(entityType) {
        case 'point': {
            if (renderedEntities.points.includes(id)) return;
            drawPoint({ x, y });
            renderedEntities.points.push(id);
            return;
        }
        case 'fruit': {
            if (renderedEntities.fruits || renderedEntities.fruits === null) return;
            drawFruit({ x, y, level: state.level });
            renderedEntities.fruits = { isVisible: true };
            return;
        }
        case 'flashy-point': {
            if (shouldClearFlashyPoint(t)) {
                if (renderedEntities.flashyPoints[id]?.isVisible === false) return;
                clearFlashyPoint({ x, y });
                renderedEntities.flashyPoints[id] = { isVisible: false };
                return; 
            }

            if (renderedEntities.flashyPoints[id]?.isVisible === true) return;
            drawFlashyPoint({ x, y });
            renderedEntities.flashyPoints[id] = { isVisible: true };
            return;
        }
        case 'wall-top': {
            if (renderedEntities.walls[id]?.color === wallColor) return;
            drawWall({ x, y, position: 'top', color: wallColor });
            renderedEntities.walls[id] = { color: wallColor };
            return;
        }
        case 'wall-bottom': {
            if (renderedEntities.walls[id]?.color === wallColor) return;
            drawWall({ x, y, position: 'bottom', color: wallColor });
            renderedEntities.walls[id] = { color: wallColor };
            return;
        }
        case 'wall-left': {
            if (renderedEntities.walls[id]?.color === wallColor) return;
            drawWall({ x, y, position: 'left', color: wallColor });
            renderedEntities.walls[id] = { color: wallColor };
            return;
        }
        case 'wall-right': {
            if (renderedEntities.walls[id]?.color === wallColor) return;
            drawWall({ x, y, position: 'right', color: wallColor });
            renderedEntities.walls[id] = { color: wallColor };
            return;
        }
        case 'gate': {
        	drawGate({ x, y });
            return;
        }
    }
}

// Draws all of the map graphics for this frame and for the given game state.
const drawMap = (t, state) => {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            
            const drawEntity = (entityType) => requestDrawMapEntity(entityType, x, y, t, state);

            const cur = mapData[y][x];
            const top = (y === 0) ? null : mapData[y - 1][x];
            const bot = (y === rows - 1) ? null : mapData[y + 1][x];
            const lft = (x === 0) ? null : mapData[y][x - 1];
            const rht = (x === columns - 1) ? null : mapData[y][x + 1];

            if (cur === 'p') {
                drawEntity('point');
            }

            if (cur === '*') {
                drawEntity('flashy-point');
            }

            if ((cur !== '-' && cur !== '|') && top === '-') {
                drawEntity('wall-top');
            }

            if ((cur !== '-' && cur !== '|') && bot === '-') {
                drawEntity('wall-bottom');
            }

            if ((cur !== '-' && cur !== '|') && lft === '-') {
                drawEntity('wall-left');
            }

            if ((cur !== '-' && cur !== '|') && rht === '-') {
                drawEntity('wall-right');
            }
            
            if (cur === 'F') {
            	drawEntity('fruit');
            }
            
            if (cur === '~') {
            	drawEntity('gate');
            }
        }
    }
}

let previousPlayerPosition;
let previousPlayerIsMoving;
const requestDrawPlayer = (t, state) => {
    const { x: gridX, y: gridY, direction, isMoving } = state.player;
    
    if (!previousPlayerIsMoving && !isMoving) return;
    
    const x = Math.round(gridUnitX * gridX + SCREEN_OFFSET);
    const y = Math.round(gridUnitY * gridY + SCREEN_OFFSET);

    if (previousPlayerPosition) {
        const { x: prevX, y: prevY } = previousPlayerPosition;
        clearPlayer({x: prevX, y: prevY});
    }

    drawPlayer({x, y, t, direction, isMoving});
    previousPlayerPosition = { x, y };
}

const renderLives = (amount) => {
	const livesContainer = document.getElementById('lives');
	livesContainer.replaceChildren();
    for (let i = 0; i < amount; i++) {
        const lifeImg = document.createElement('img');
		lifeImg.setAttribute('src', './icon.svg');
		lifeImg.setAttribute('style', 'height: 30px; width: 30px;');
        livesContainer.appendChild(lifeImg);
	}
}

const bonusItemSVGs = {
    cherry: './fruits/cherry.svg',
}

const renderEatenItems = (items) => {
	const fruitsContainer = document.getElementById('fruits');
	fruitsContainer.replaceChildren();
    for (let fruitSrc of items) {
        const fruitImg = document.createElement('img');
		fruitImg.setAttribute('src', fruitSrc);
		fruitImg.setAttribute('style', 'height: 30px; width: 30px;');
        fruitsContainer.appendChild(fruitImg);
	}
}