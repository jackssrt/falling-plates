import { Controller, OnStart } from "@flamework/core";
import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import DebugText from "client/roact/components/DebugText";
import Feedback from "client/roact/components/Feedback";
import StatusDisplay from "client/roact/components/StatusDisplay";

@Controller({})
export class RoactController implements OnStart {
	public static openFeedbackEvent = new Instance("BindableEvent");

	onStart() {
		const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;
		const tree = (
			<screengui ResetOnSpawn={false} IgnoreGuiInset={true}>
				<StatusDisplay></StatusDisplay>
				<DebugText></DebugText>
				<Feedback></Feedback>
			</screengui>
		);

		Roact.mount(tree, playerGui, "UI");
	}
}
