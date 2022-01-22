<script lang="ts">
	import type { Colour, Settings } from "./Types";
	export var settings: Settings;

	var listeningForKeybind: string = "";
	function setKeybind(control: string) {
		listeningForKeybind = control;
	}
	function keyListener(e: KeyboardEvent) {
		if(listeningForKeybind != "") {
			settings.keybinds[0][listeningForKeybind] = e.code;
		}
		listeningForKeybind = "";
		console.log(settings.keybinds);
	}

	function setDifficultyPreset() {
		switch(settings.colourGameSettings.difficultyPreset) {
			case "easy":
				settings.colourGameSettings.colours = [
					{ name: "black", hex: "000000", enabled: true } as Colour,
					{ name: "red", hex: "ff0022", enabled: true } as Colour,
					{ name: "orange", hex: "ff8800", enabled: false } as Colour,
					{ name: "yellow", hex: "ffdd00", enabled: false } as Colour,
					{ name: "green", hex: "00dd44", enabled: false } as Colour,
					{ name: "blue", hex: "0088ff", enabled: true } as Colour,
					{ name: "purple", hex: "8800ff", enabled: false } as Colour,
				];
				settings.colourGameSettings.gameMode = "infinite";
				break;
			case "medium":
				settings.colourGameSettings.colours = [
					{ name: "black", hex: "000000", enabled: true } as Colour,
					{ name: "red", hex: "ff0022", enabled: true } as Colour,
					{ name: "orange", hex: "ff8800", enabled: false } as Colour,
					{ name: "yellow", hex: "ffdd00", enabled: true } as Colour,
					{ name: "green", hex: "00dd44", enabled: true } as Colour,
					{ name: "blue", hex: "0088ff", enabled: true } as Colour,
					{ name: "purple", hex: "8800ff", enabled: false } as Colour,
				];
				settings.colourGameSettings.gameMode = "timed";
				break;
			case "hard":
				settings.colourGameSettings.colours = [
					{ name: "black", hex: "000000", enabled: true } as Colour,
					{ name: "red", hex: "ff0022", enabled: true } as Colour,
					{ name: "orange", hex: "ff8800", enabled: true } as Colour,
					{ name: "yellow", hex: "ffdd00", enabled: true } as Colour,
					{ name: "green", hex: "00dd44", enabled: true } as Colour,
					{ name: "blue", hex: "0088ff", enabled: true } as Colour,
					{ name: "purple", hex: "8800ff", enabled: true } as Colour,
				];
				settings.colourGameSettings.gameMode = "instant death";
				break;
		}
	}
</script>

<svelte:window on:keydown={keyListener} />

<div class="settingsContainer box">
	<div class="settingsHeader">general settings</div>
	<span class="settingsLine">
		<label for="language" class="settingsLabel">language</label>
		<select name="language" id="language" bind:value={settings.language}>
			<option value="en_uk">english</option>
		</select>
	</span>
	<br/>
	<div class="settingsHeader">game settings</div>
	<div class="settingsLine">
		<label class="settingsLabel" for="difficulty">difficulty presets</label>
		<select name="difficulty" id="difficulty" bind:value={settings.colourGameSettings.difficultyPreset} on:change={setDifficultyPreset}>
			<option value="easy">easy</option>
			<option value="medium">medium</option>
			<option value="hard">hard</option>
		</select>
	</div>
	<div class="settingsLine">
		<label for="" class="settingsLabel">gamemode</label>
		<select name="gamemode" id="gamemode" bind:value={settings.colourGameSettings.gameMode}>
			<option value="infinite">infinite</option>
			<option value="timed">timed</option>
			<option value="instant death">instant death</option>
		</select>
	</div>
	<div class="settingsLine keybindsLine">
		<label for="affirmativeKey" class="settingsLabel">Key for Yes: </label>
		<button class="keybindSelector" on:click={() => setKeybind("colourGame_affirmative")}>{settings.keybinds[0]["colourGame_affirmative"]}</button>	
		<label for="negativeKey" class="settingsLabel">Key for No: </label>
		<button class="keybindSelector" on:click={() => setKeybind("colourGame_negative")}>{settings.keybinds[0]["colourGame_negative"]}</button>	
	</div>
	<div class="settingsLine">
		<label for="colours" class="settingsLabel checkboxHeader">colours:</label>
	</div>
	{#each settings.colourGameSettings.colours as colour, i}
		<div class="settingsLine">
			<label for={colour.name} class="settingsLabel checkboxLabel">{colour.name}</label>
			<input type="checkbox" name={colour.name} id={"cbox"+colour.name} bind:checked={colour.enabled} />
		</div>
	{/each}
	<div class="settingsLine">
		<label for="gamelength" class="settingsLabel">game length</label>
		<input type="number" name="gamelength" id="gamelength" bind:value={settings.colourGameSettings.gameLength} />
	</div>
</div>

<style>
	.settingsContainer {
		width: max-content;
		margin: auto;
		padding: 2em;
		padding-left: 5em;
		padding-right: 5em;
		margin-top: 2em;
		background-color: hsl(0, 0%, 20%);
	}

	.settingsHeader {
		color: white;
		font-family: "Helvetica", sans-serif;
		font-size: 2.5em;
		font-weight: 900;
		margin-bottom: 0.5em;
	}

	.settingsLine {
		position: relative;
	}

	.keybindsLine {
		padding: 1em;
	}
	
	.checkboxHeader {
		position: absolute;
		margin-top: 0.5em;
		left: 0;
		font-size: 1.5em;
	}

	.settingsLabel {
		color: white;
	}
</style>