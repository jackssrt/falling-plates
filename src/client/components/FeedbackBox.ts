import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { WindowController, WindowID } from "client/controllers/WindowController";

interface Attributes {}

@Component({ tag: "FeedbackBox" })
export class FeedbackBox extends BaseComponent<Attributes, Part> implements OnStart {
	public static event = new Instance("BindableEvent");
	private proximityPrompt = this.instance.WaitForChild("ProximityPrompt") as ProximityPrompt;
	constructor(private windowController: WindowController) {
		super();
	}
	onStart() {
		this.proximityPrompt.Triggered.Connect(() => this.windowController.openWindow(WindowID.Feedback));
	}
}
