const ID_TODAY = `scores_${(new Date()).getYear()}-${(new Date()).getMonth()}-${(new Date()).getDate()}`;

const getTodaysScores = () => JSON.parse(localStorage.getItem(ID_TODAY)) ?? [];

const getAllScores = () => Object.keys(localStorage).filter(key => /^scores_(\d+\-){2}\d+$/.test(key)).reduce((scores, key) => ({
    ...scores, ...JSON.parse(localStorage.getItem(key)),
}), []);

const sortScores = (scores) => scores.sort((a, b) => (b.score - a.score === 0) ? b.time - a.time : b.score - a.score);

const storeNewScore = (name, score) => {
	const todaysScores = getTodaysScores();
	const time = (new Date()).getTime();
	todaysScores.push({name, score, time});
	localStorage.setItem(ID_TODAY, JSON.stringify(todaysScores));
}

const createScoreLi = (name, score) => {
	const liElement = document.createElement('li');
        
    const nameText = document.createTextNode(name);
    liElement.appendChild(nameText);
        
    const spanElement = document.createElement('span');
    spanElement.textContent = score;
    liElement.appendChild(spanElement);
    return liElement;
}

const populateScoresList = (mode="today") => {
	const listElement = document.getElementById('scores-list');
	listElement.replaceChildren();
    const scores = mode === "today" ? getTodaysScores() : getAllScores();
    const sortedScores = sortScores(scores);
    
    sortedScores.forEach(({name, score}) => {
        listElement.appendChild(createScoreLi(name, score));
    });
    
    return sortedScores;
}