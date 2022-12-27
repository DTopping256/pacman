const startGame = () => {
    // Initial state
    const state = { progress: 'INTRO', tickChanged: 0, level: 1, player: {
        isMoving: true,
        direction: 'right',
        x: 13.5,
        y: 23,
    }};

    const TICK_SPEED = 1/100; // Ticks per second
    const PLAYER_SPEED = 0.16;
    //let start = undefined;
    let done = false;
    let tick = 0;

    const gameControlsEventHandler = (event) => {
        console.log('controls EH', event);
        
        if (event.key.toLowerCase() === 'a') {
            state.player.direction = 'left';
        } 
        if (event.key.toLowerCase() === 'd') {
            state.player.direction = 'right';
        } 
        if (event.key.toLowerCase() === 'w') {
            state.player.direction = 'top';
        } 
        if (event.key.toLowerCase() === 's') {
            state.player.direction = 'bottom';
        } 
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
            removeEventListener('keydown', gameControlsEventHandler);
        }
    }

    setTimeout(gameLoop, 4000);
    setTimeout(() => { done = true }, 14000);
    addEventListener('keydown', gameControlsEventHandler);
};
