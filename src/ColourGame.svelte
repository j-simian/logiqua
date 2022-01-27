<script lang="ts">
	import type { Colour, Settings, State } from "./Types";
	export var settings: Settings;

	var colours = settings.colourGameSettings.colours.filter((c: Colour) => (c.enabled));

	var state: State = "start";

	var topWord: Colour, bottomWord: Colour;
	var topColour: Colour, bottomColour: Colour; 

	$: affirmativeKey = settings.keybinds[0]["colourGame_affirmative"];
	$: negativeKey = settings.keybinds[0]["colourGame_negative"];

	var correct = false, incorrect = false;
	var score = 0;
	var right = 0, wrong = 0;
	const UI_TIMEOUT = 300;


	//average
	var time: number;
	var deltas: number[] = [];

	
	//Timer variableslic_
	$: gameLength = settings.colourGameSettings.gameLength;
	var gameTimer;
	var gameTimerInterval;

	let htpDiv: HTMLDivElement;
	function hideElems() {
		if(htpDiv.clientWidth < htpDiv.scrollWidth || htpDiv.clientHeight < htpDiv.scrollHeight) {
			htpDiv.style.display = "none";
		} else {
			htpDiv.style.display = "block";
		}
	}

	function startGame() {
		if(settings.colourGameSettings.gameMode == "timed") {
			gameTimer = gameLength;
			gameTimerInterval = setInterval(decrementTimer, 1000);
		} else {
			gameTimer = 0;
			gameTimerInterval = setInterval(incrementTimer, 1000);
		}
		score = 0;
		time = performance.now();
		setBoxes();
		state = "playing";
	}

	function decrementTimer() {
		if(gameTimer == 0) {
			endGame();
			return;
		}
		gameTimer--;
	}

	function incrementTimer() {
		gameTimer++;
	}

	function endGame() {
		if(state == "gameover") {
			return;
		}
		clearInterval(gameTimerInterval);
		state = "gameover";
	}

	function setBoxes() {
		let matching = Math.random() >= 0.5; // 50/50 chance of answer being yes or no.

		topWord = colours[Math.floor(Math.random() * colours.length)];
		topColour = colours[Math.floor(Math.random() * colours.length)];
		bottomWord = colours[Math.floor(Math.random() * colours.length)];
		bottomColour = topWord;
		if(!matching){
			while(bottomColour == topWord) {
				bottomColour = colours[Math.floor(Math.random() * colours.length)];
			}
		}
	}
	function resetGame() {
		state = "start";
		clearInterval(gameTimerInterval);
		gameTimer = 0;
	}

	function keyUpListener(e: KeyboardEvent) {
		switch(e.code) {
			case "Space":
				if(state == "start") startGame();
				break;
			case "KeyR":
				resetGame();
				break;
		}
		if(e.code == "Space" && state=="start") {
			startGame();
		}
	}

	function keyDownListener(e: KeyboardEvent) {
		switch(e.code) {
			case affirmativeKey:
				giveAnswer(true);
				break;
			case negativeKey:
				giveAnswer(false);
				break;
		}
	}

	function giveAnswer(answer: boolean) {
		if(state != "playing") {
			return;
		}
		deltas.push(Math.round(performance.now() - time)/1000);
		time = performance.now();
		if(answer) {
			if(topWord == bottomColour) {	
				correctAnswer();
			} else {
				incorrectAnswer();
			}
			setBoxes();
		} else {
			if(topWord != bottomColour) {
				correctAnswer();
			} else {
				incorrectAnswer();
			}
			setBoxes();
		}
	}

	function correctAnswer() {
		score++;
		right++;
		correct = true;
		incorrect = false;
		setTimeout(() => {correct = false;}, UI_TIMEOUT);
	}

	function incorrectAnswer() {
		score--;
		wrong++;
		incorrect = true;
		correct = false;
		if(settings.colourGameSettings.gameMode == "instant death") {
			endGame();
		}
		setTimeout(() => {incorrect = false;}, UI_TIMEOUT);
	}




</script>

<svelte:window on:load={hideElems} on:resize={hideElems} on:keydown={keyDownListener} on:keyup={keyUpListener} />

	<div class="containerGame">
		{#if state=="start"}
			<div class="box begin">Press <code class="keybind">{affirmativeKey}</code> to begin, or <code class="keybind">S</code> for settings.</div>
			<div class="tutorial" bind:this={htpDiv} >
				<div class="box boxHeader boxCentered">
					how to play
				</div>	
				<div class="boxLine tutorialText">
					<div class="box boxInfo boxCentered">
						<span class="infoLine">
							press <code class="keybind">{affirmativeKey}</code> if the <i>meaning</i> of the top word matches with the <i>colour</i> of the bottom word.
							if they don't match, press <code class="keybind">{negativeKey}</code>.
						</span>
						<span class="infoLine">
							you will need to try and ignore the meaning of the bottom word and the colour of the top word.
						</span>
						<span class="infoLine">
							this can be quite difficult to get used to ! 
						</span>
					</div>	
				</div>
			</div>
		{:else if state=="playing"}
			<div class="boxLine">
				<div class="delta box">{gameTimer}s</div>
				<div class="score box">Score: {score}</div>
			</div>
			<div class="gameBoxes">
				<div class="boxLine">
					<div class="pointer">meaning</div>
					<div class="boxFirst wordBox box" style={"color: #" + topColour.hex}>{topWord.name}</div>
				</div>
				<div class="boxLine">
					<div class="pointer">colour</div>
					<div class="boxSecond wordBox box" style={"color: #" + bottomColour.hex}>{bottomWord.name}</div>
				</div>
			</div>
			{#if correct}
				<div class="tick symbol">✅</div>
			{:else if incorrect}
				<div class="cross symbol">❌</div>
			{/if}
		{:else if state=="gameover"}
			<div class="boxLine">
				<div class="box begin">press <code class="keybind">R</code> to restart.</div>
			</div>
			<div class="stats">
				<div class="boxLine">
					<div class="box boxCentered boxHeader">stats</div>
				</div>
				<div class="box boxInfo boxCentered">Answered correctly: <code class="keybind">{right}</code>, incorrectly: <code class="keybind">{wrong}</code></div>
				<div class="box boxInfo boxCentered">Average time per response: {(deltas.reduce((a, b)=>a+b, 0)/deltas.length).toFixed(3)}s</div>
			</div>
		{/if}

	</div>

<style>
	.begin {
		color: black;
		width: 100%;
		font-size: 2em;
	}

	.boxCentered {
		width: max-content;
		margin: auto;
	}

	.boxHeader {
		font-size: 2em;
		font-weight: 900;
		color: black;
		margin-bottom: 0.5em;
	}

	.boxInfo {
		font-size: 1.5em;
		margin-bottom: 0.5em;
	}

	.infoLine {
		display: block;
		margin: 0.3em;
	}

	.keybind {
		padding: 5px;
		border: 1px hsl(0, 0%, 50%) solid;
		border-radius: 0.3em;
		background-color: hsla(0, 0%, 0%, 10%);
	}

	.tutorial {
		position: relative;
		margin-top: 2em;
		height: 100%;
		flex-flow: column wrap;
		overflow: hidden;
	}

	.stats {
		position: relative;
		top: 25%;
	}


	.containerGame {
		position: absolute;
		display: flex;
		flex-direction: column;
		width: 50%;
		top: calc(10.8em + 4vh);
		bottom: 7.5%;
		left:0;
		right:0;
		margin: auto;
		padding-left: 12.5%;
		padding-right: 12.5%;
		padding-top: 3%;
		background-color: hsl(0, 0%, 20%);
		border: 1px solid hsl(0, 0%, 50%);
		border-radius: 2em;
		filter: drop-shadow(0.4em 0.4em 0px hsl(0, 0%, 0%));
	}

	.boxLine {
		display: flex;
		width: 100%;
		margin: auto;
		padding: 0;
	}

	.gameBoxes {
		position: relative;
		top: 50%;
		transform: translateY(-50%);
		margin: auto;
	}

	.pointer {
		display: inline;
		font-size: 1.2em;
		padding: 10px;
		position: relative;
		width: max-content;
		left: -18px;
		height: fit-content;
		border-radius: 0.2em;
		background-color: hsl(0, 0%, 5%);
	}
	
	.pointer:after {
		content: " ";
		height: 0;
		position: absolute;
		width: 0;
		right: -18px;
		top: 9px;
		border: 10px solid transparent;
		border-left-color: hsl(0, 0%, 5%);
	}

	.delta {
		position: absolute;
		padding: 0.4em;
		top: 1em;
		left: 1em;
		color: black;
		font-size: 2em;
	}

	.score {
		position: absolute;
		padding: 0.4em;
		top: 1em;
		right: 1em;
		color: black;
		font-size: 2em;
	}

	.wordBox {
		display: inline;
		position: relative;
		flex-grow: 1;
		margin-bottom: 2.5%;
		font-weight: 900;
		font-size: 3.5em;
	}


	.symbol {
		margin: auto;
		position: relative;
		top: 3em;
		font-size: 4em;
	}
</style>