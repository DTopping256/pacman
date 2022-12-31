// Screens
const title = document.getElementById('title');
const menu = document.getElementById('main-menu');
const scores = document.getElementById('scores');
const scoresList = document.getElementById('scores-list');
const scoresHeader = document.getElementById('scores-header');
const scoresModeButton = document.getElementById('scores-mode-button');
const controls = document.getElementById('controls');

const animateTitleElements = () => {
    title.classList.add('animated');
    menu.classList.add('animated');
}

const unAnimateTitleElements = () => {
    title.classList.remove('animated');
    menu.classList.remove('animated');
}

const animateScores = () => {
    scoresList.classList.add('animated');
}

const unAnimateScores = () => {
    scoresList.classList.remove('animated');
}

const hideTitleScreen = () => {
    title?.setAttribute('style', 'display: none');
    menu?.setAttribute('style', 'display: none');
}

const showTitleScreen = () => {
    title?.removeAttribute('style');
    menu?.removeAttribute('style');
}

const hideScoresScreen = () => {
    scores?.setAttribute('style', 'display: none');
}

const showScoresScreen = () => {
    const scoresData = populateScoresList(scoresMode);
	
	if (scoresData.length > 0) {
		animateScores();
	} else {
		unAnimateScores();
		const defaultScoreLi = createScoreLi("Player", 25000);
		scoresList.appendChild(defaultScoreLi);
	}
		
    scores?.removeAttribute('style');
}


const hideControlsScreen = () => {
    controls?.setAttribute('style', 'display: none');
}

const showControlsScreen = () => {
    controls?.removeAttribute('style');
}

// Events

// - Title events

const titleClickEventsByElementId = {
    'play-button': () => {
        hideTitleScreen();
        unbindTitleScreenEvents();
        startGame();
    },
    'scores-button': () => {
        hideTitleScreen();
        unbindTitleScreenEvents();
        bindScoresScreenEvents();
        showScoresScreen();
    },
    'controls-button': () => {
        hideTitleScreen();
        unbindTitleScreenEvents();
        bindControlsScreenEvents();
        showControlsScreen();
    }
};

const bindTitleScreenEvents = () => {
    Object.keys(titleClickEventsByElementId).forEach(id => {
        document.getElementById(id)?.addEventListener('click', titleClickEventsByElementId[id]); 
    });
};

const unbindTitleScreenEvents = () => {
    Object.keys(titleClickEventsByElementId).forEach(id => {
        document.getElementById(id)?.removeEventListener('click', titleClickEventsByElementId[id]); 
    });
}

// - Scores events

const scoresBackClickEventHandler = () => {
    hideScoresScreen();
    unbindScoresScreenEvents();
    bindTitleScreenEvents();
    unAnimateTitleElements();
    showTitleScreen();
};

let scoresMode = "today";
const switchScoresMode = () => {
	if (scoresMode === "today") {
		scoresMode = "all";
		scoresHeader.textContent="All time hi-scores";
		scoresModeButton.textContent="Show today's";
	} else {
		scoresMode = "today";
		scoresHeader.textContent="Today's hi-scores";
		scoresModeButton.textContent="Show all";
	}
	showScoresScreen();
}

const bindScoresScreenEvents = () => {
    document.getElementById('scores-back-button')?.addEventListener('click', scoresBackClickEventHandler); 
    scoresModeButton?.addEventListener('click', switchScoresMode); 
};

const unbindScoresScreenEvents = () => {
    document.getElementById('scores-back-button')?.removeEventListener('click', scoresBackClickEventHandler); 
    scoresModeButton?.removeEventListener('click', switchScoresMode); 
}

// - Controls events

const controlsBackClickEventHandler = () => {
    hideControlsScreen();
    unbindControlsScreenEvents();
    bindTitleScreenEvents();
    unAnimateTitleElements();
    showTitleScreen();
}

const bindControlsScreenEvents = () => {
    document.getElementById('controls-back-button')?.addEventListener('click', controlsBackClickEventHandler); 
};

const unbindControlsScreenEvents = () => {
    document.getElementById('controls-back-button')?.removeEventListener('click', controlsBackClickEventHandler); 
}


// Initial scene

drawMap(0, { progress: 'INTRO', tickChanged: 0, level: 1, player: {
    isMoving: true,
    direction: 'right',
    x: 13.5,
    y: 23,
}});

hideScoresScreen();
hideControlsScreen();
bindTitleScreenEvents();
animateTitleElements();