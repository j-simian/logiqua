export type Settings = {
	language: Language,
	colourGameSettings: { 
		difficultyPreset: gameDifficulty,
		gameMode: colourGameModes,
		colours: Colour[];
		gameLength: number;
	},
	keybinds: Keybinds[]
};
export type Keybinds = { [control: string]: string }
type Language = "en_uk" | "fr";
type gameDifficulty = "easy" | "medium" | "hard" | "custom";
type colourGameModes = "infinite" | "timed" | "instant death";
export type State = "start" | "playing" | "gameover";
export type Colour = { name: string, hex: string, enabled?: boolean };