import { Controller } from "@flamework/core";

export const enum WindowID {
	"Feedback",
}

export class Window {
	public isOpen = false;

	constructor(public id: WindowID, public closeEvent: BindableEvent, public openEvent: BindableEvent) {
		this.closeEvent.Event.Connect(() => {
			this.isOpen = false;
		});
		this.openEvent.Event.Connect(() => {
			this.isOpen = true;
		});
	}

	public open() {
		if (this.isOpen) return;
		this.openEvent.Fire();
	}
	public close() {
		if (!this.isOpen) return;
		this.closeEvent.Fire();
	}
}

@Controller({})
export class WindowController {
	private windows: Map<WindowID, Window> = new Map();

	public registerWindow(window: Window) {
		this.windows.set(window.id, window);
	}

	public openWindow(id: WindowID) {
		this.windows.forEach((v) => {
			if (v.id === id) v.open();
			else v.close();
		});
	}
}
