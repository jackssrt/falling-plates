import { Controller, OnStart } from "@flamework/core";

@Controller({})
export class SoundController implements OnStart {
	public static MUSIC = {} as const satisfies Record<string, string[]>;
	public static SFX = {
		explosion: ["5801257793"],
		three: ["29445358"],
		two: ["29445339"],
		one: ["29445305"],
		victory: ["12222253"],
	} as const satisfies Record<string, string[]>;

	private oldMusic: Sound;
	private asfd;
	onStart() {}
	changeMusic() {}
}
