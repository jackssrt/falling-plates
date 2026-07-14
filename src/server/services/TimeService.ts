import { OnStart, Service } from "@flamework/core";
import { Lighting } from "@rbxts/services";
import { isDev } from "shared/env";
import { tween } from "shared/utils";

@Service({})
export class TimeService implements OnStart {
	onStart() {
		Lighting.ClockTime = 10;
		while (true) {
			task.wait(isDev ? 10 : 60);
			tween(Lighting, { time: 5, easingStyle: Enum.EasingStyle.Linear }, { ClockTime: 0 });
			task.wait(isDev ? 5 : 30);
			tween(Lighting, { time: 5, easingStyle: Enum.EasingStyle.Linear }, { ClockTime: 10 });
		}
	}
}
