const validateIsOutOfBounds = (state) => {
	if (state.player.x < 0 || state.player.x > columns || state.player.y < 0 || state.player.y > rows) {
	    console.error("Player out of bounds", [state.player.x, state.player.y]);
        return true;
    }
    return false;
}

let done;
const startGame = () => {
    // Initial state
    done = false;
    const state = { progress: 'INTRO', tickChanged: 0, level: 1, player: {
        isMoving: true,
        direction: 'right',
        nextDirection: 'right',
        x: 13.5,
        y: 23,
        lives: 1,
    }};
    
    resetGraphics();

    const TICK_SPEED = 1/100; // Ticks per second
    const PLAYER_SPEED = 0.04;
    let tick = 0;
    
    const canvas = document.getElementById('game');
    const zt = ZingTouch.Region(canvas);

    const gameControlsKeyboardEventHandler = (event) => {
        const pressedKey = event.key.toLowerCase();

        switch (pressedKey) {
            case 'a':
                state.player.nextDirection = 'left';
                return;
            case 'd':
                state.player.nextDirection = 'right';
                return;
            case 'w':
                state.player.nextDirection = 'top';
                return;
            case 's':
                state.player.nextDirection = 'bottom';
                return;
        };
    };
    
    const gameControlsSwipeEventHandler = (event) => {
        const swipeAngle = event.detail.data[0].currentDirection;
        console.log(`Swipe event ${swipeAngle}`, state);
        
        if (swipeAngle > 315 || swipeAngle <= 45) {
                state.player.nextDirection = 'right';
                return;
        }
        if (swipeAngle > 135 && swipeAngle <= 225) {
                state.player.nextDirection = 'left';
                return;
         }
         if (swipeAngle > 225 && swipeAngle < 315) {
                state.player.nextDirection = 'bottom';
                return;
         }
         state.player.nextDirection = 'top';
    };
    
    drawMap(tick, state);
    requestDrawPlayer(tick, state);

    const gameLoop = (timestamp) => {
        drawMap(tick, state);
        requestDrawPlayer(tick, state);
        
        const turningDirections = getPossibleNextDirections(state);
        const nearestPathNode = findClosestPathNode(state.player.x, state.player.y);
        const diff = nearestPathNode == null ? null : Math.sqrt(Math.pow(nearestPathNode.x - state.player.x, 2) + Math.pow(nearestPathNode.y - state.player.y, 2))
        
        console.log(state.player.x, state.player.y, nearestPathNode, turningDirections,  diff);
        
        if (state.player.nextDirection != state.player.direction &&
            turningDirections.includes(state.player.nextDirection) && (
            nearestPathNode == null ||
            areDirectionsParallel(state.player.nextDirection, state.player.direction) ||
            diff < PLAYER_SPEED
        )) {
        	console.log(turningDirections, nearestPathNode, diff);
        	state.player.direction = state.player.nextDirection;
            
            if (nearestPathNode != null && !areDirectionsParallel(state.player.nextDirection, state.player.direction)) {
                state.player.x = nearestPathNode.x;
                state.player.y = nearestPathNode.y;
            }
        }
        
        if (turningDirections.includes(state.player.direction) || diff == null || diff > PLAYER_SPEED) {
            switch(state.player.direction) {
            	case 'left': {
            	    state.player.x -= PLAYER_SPEED;
                    break;
                }
                case 'top': {
                    state.player.y -= PLAYER_SPEED;
                    break;
                }
                case 'right': {
            	    state.player.x += PLAYER_SPEED;
                    break;
                }
                case 'bottom': {
                    state.player.y += PLAYER_SPEED;
                    break;
                }
            }
        } else if (diff && diff < PLAYER_SPEED) {
        	state.player.x = nearestPathNode.x;
            state.player.y = nearestPathNode.y;
        }
        
        if (validateIsOutOfBounds(state)) {
        	done = true;
        }
        
        if (!done) {
            requestAnimationFrame(gameLoop);
            tick++;
        } else {
            removeEventListener('keydown', gameControlsKeyboardEventHandler);
            zt.unbind(canvas, 'swipe');
        }
    }

    setTimeout(gameLoop, 4000);
    setTimeout(() => { renderLives(state.player.lives); renderEatenItems([bonusItemSVGs.cherry]); }, 1000);
    
    addEventListener('keydown', gameControlsKeyboardEventHandler);
    zt.bind(canvas, 'swipe', gameControlsSwipeEventHandler);
};

const stopGame = () => { done = true; }
