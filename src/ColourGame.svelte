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

	function startGame() {
		gameTimer = gameLength;
		gameTimerInterval = setInterval(decrementTimer, 1000);
		score = 0;
		time = performance.now();
		setBoxes();
		state = "playing";
	}

	function endGame() {
		if(state == "gameover") {
			return;
		}
		state = "gameover";
		clearInterval(gameTimerInterval);
	}

	function setBoxes() {
		let matching = Math.random() >= 0.5;

		

		topWord = colours[Math.floor(Math.random() * colours.length)];
		topColour = colours[Math.floor(Math.random() * colours.length)];
		bottomWord = colours[Math.floor(Math.random() * colours.length)];

		bottomColour = topWord;
		if(!matching){
			bottomColour = colours[Math.floor(Math.random() * colours.length)];
		}
		
	}

	function keyUpListener(e: KeyboardEvent) {
		switch(e.code) {
			case "Space":
				if(state == "start") startGame();
				break;
			case "KeyR":
				state = "start";
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
				score++;
				right++;
				correct = true;
				incorrect = false;
				setTimeout(() => {correct = false;}, UI_TIMEOUT);
			} else {
				score--;
				wrong++;
				incorrect = true;
				correct = false;
				setTimeout(() => {incorrect = false;}, UI_TIMEOUT);
			}
			setBoxes();
		} else {
			if(topWord != bottomColour) {
				score++;
				right++;
				correct = true;
				incorrect = false;
				setTimeout(() => {correct = false;}, UI_TIMEOUT);
			} else {
				score--;
				wrong++;
				incorrect = true;
				correct = false;
				setTimeout(() => {incorrect = false;}, UI_TIMEOUT);
			}
			setBoxes();
		}
	}

	function decrementTimer() {
		if(gameTimer == 0) {
			endGame();
			return;
		}
		gameTimer--;
	}


</script>

<svelte:window on:keydown={keyDownListener} on:keyup={keyUpListener} />

	<div class="containerGame">
		{#if state=="start"}
			<div class="boxLine">
				<div class="box begin">Press space to begin, or S for settings.</div>
			</div>
		{:else if state=="playing"}
			<div class="boxLine">
				<div class="delta box">{gameTimer}s</div>
				<div class="score box">{score}</div>
			</div>
			<div class="boxLine">
				<div class="pointer">meaning</div>
				<div class="boxFirst wordBox box" style={"color: #" + topColour.hex}>{topWord.name}</div>
			</div>
			<div class="boxLine">
				<div class="pointer">colour</div>
				<div class="boxSecond wordBox box" style={"color: #" + bottomColour.hex}>{bottomWord.name}</div>
			</div>
			{#if correct}
				<div class="tick symbol">✅</div>
			{:else if incorrect}
				<div class="cross symbol">❌</div>
			{/if}
		{:else if state=="gameover"}
			<div class="boxLine">
				<div class="box begin">Stats</div>
			</div>
			<div class="boxLine">
				<div class="box begin">Answered correctly: {right}, incorrectly: {wrong}</div>
			</div>
			<div class="boxLine">
				<div class="box begin">Average time per response: {(deltas.reduce((a, b)=>a+b, 0)/deltas.length).toFixed(3)}s</div>
			</div>
		{/if}

	</div>

<style>
	.begin {
		color: black;
		text-align: center;
		width: 100%;
		font-size: 2em;
	}

	.containerGame {
		position: absolute;
		width: 50%;
		top: calc(10.8em + 4vh);
		bottom: 7.5%;
		left:0;
		right:0;
		margin: auto;
		padding: 12.5%;
		background-color: hsl(0, 0%, 20%);
		border: 1px solid hsl(0, 0%, 50%);
		border-radius: 2em;
		filter: drop-shadow(0.4em 0.4em 0px hsl(0, 0%, 0%));
	}

	.boxLine {
		display: flex;
		align-items: center;
		width: 100%;
		margin: auto;
		padding: 0;
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

	.tick {
		color: green;
	}

	.cross {
		color: red;
	}

	.symbol {
		margin: auto;
		font-size: 4em;
	}
</style>