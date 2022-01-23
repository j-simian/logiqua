<script lang="ts">
	import ColourGame from "./ColourGame.svelte";
	import SettingsMenu from "./SettingsMenu.svelte";

	import type { Settings, Colour, Keybinds } from "./Types";
	var settings: Settings = {
		language: "en_uk",
		colourGameSettings: {
			difficultyPreset: "medium",
			gameMode: "timed",
			colours: [
				{ name: "black", hex: "000000", enabled: true } as Colour,
				{ name: "red", hex: "ff0022", enabled: true } as Colour,
				{ name: "orange", hex: "ff8800", enabled: true } as Colour,
				{ name: "yellow", hex: "ffdd00", enabled: true } as Colour,
				{ name: "green", hex: "00dd44", enabled: true } as Colour,
				{ name: "blue", hex: "0088ff", enabled: true } as Colour,
				{ name: "purple", hex: "8800ff", enabled: true } as Colour,
			],
			gameLength: 30
		},
		keybinds: [
			{ ["colourGame_affirmative"]: "Space",
			  ["colourGame_negative"]: "ShiftLeft" } as Keybinds,
		]
	};

	type Game = { name: string }; 
	var currentGame: Game = { name: "colour match" };
	
	
	var settingsVisible: boolean = false;


	function mainKeyHandler(e: KeyboardEvent) {
		console.log("Keydown event: " + e.code);
		switch(e.code) {
			case "KeyS":
				settingsVisible = !settingsVisible;
				break;
		}

	}
</script>

<svelte:window on:keydown={mainKeyHandler}/>

<main>
	<div class="banner">
		LOGIQUA
	</div>
	{#if settingsVisible}
		<SettingsMenu bind:settings={settings}/>
	{:else}
		<div class="gameHeader">{currentGame.name}</div>
		<ColourGame settings={settings}/>
	{/if}
</main>

<style>
	main {
		text-align: center;
		padding: 0;
		margin: 0;
		background-color: hsl(0, 0%, 7%);
		height: 100vh;
		overflow: hidden;
	}

	.banner {
		width: 100%;
		background-color: red;
		background: rgb(255,70,0);
		background: linear-gradient(110deg, rgb(255, 17, 0) 0%, rgb(255, 102, 0) 100%);
		text-align: left;
		font-family: "Monoton";
		font-size: 4vh;
		color: white;
		padding: 0.5em;
		padding-left: 1em;
	}

	.gameHeader {
		width: max-content;
		margin: auto;
		margin-top: 0.5em;
		margin-bottom: 0.5em;
		padding: 0.2em;
		padding-left: 2em;
		padding-right: 2em;
		background-color: hsl(0, 0%, 20%);
		border: 1px solid hsl(0, 0%, 50%);
		border-radius: 2em;
		filter: drop-shadow(0.1em 0.1em 0px hsl(0, 0%, 0%));
		font-family: "Helvetica", sans-serif;
		font-size: 3em;
		font-weight: 900;
		color: white;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>