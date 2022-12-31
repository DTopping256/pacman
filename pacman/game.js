const startGame = () => {
    // Initial state
    const state = { progress: 'INTRO', tickChanged: 0, level: 1, player: {
        isMoving: true,
        direction: 'right',
        nextDirection: 'right',
        x: 13.5,
        y: 23,
        lives: 1,
    }};

    const TICK_SPEED = 1/100; // Ticks per second
    const PLAYER_SPEED = 0.16;
    //let start = undefined;
    let done = false;
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
        // if (start === undefined) {
        //     start = timestamp;
        // }
        //const totalElapsed = (timestamp ?? 0) - (start ?? 0);
        //const ticksElapsed = Math.round(totalElapsed / TICK_SPEED);
        
        drawMap(tick, state);
        requestDrawPlayer(tick, state);

        // const leftStep = player.x - PLAYER_SPEED;

        // if (player.direction === 'left' && player.x)
        
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
    setTimeout(() => { done = true }, 14000);
    addEventListener('keydown', gameControlsKeyboardEventHandler);
    zt.bind(canvas, 'swipe', gameControlsSwipeEventHandler);
};
