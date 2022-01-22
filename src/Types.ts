export type Settings = {
	language: Language,
	colourGameSettings: ColourSettings,
	keybinds: Keybinds[];
};
export type Keybinds = { [control: string]: string; };
export type ColourSettings = { 
		difficultyPreset: gameDifficulty,
		gameMode: colourGameModes,
		colours: Colour[];
		gameLength: number;
}
type Language = "en_uk" | "fr";
type gameDifficulty = "easy" | "medium" | "hard" | "custom";
type colourGameModes = "infinite" | "timed" | "instant death";
export type State = "start" | "playing" | "gameover";
export type Colour = { name: string, hex: string, enabled?: boolean };