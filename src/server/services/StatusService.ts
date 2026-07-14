import { Service } from "@flamework/core";
import { ReplicatedStorage } from "@rbxts/services";

@Service({})
export class StatusService {
	private status = ReplicatedStorage.WaitForChild("Status") as StringValue;
	private timer = ReplicatedStorage.WaitForChild("Timer") as NumberValue;
	public setStatus(name: string) {
		this.status.Value = name;
		this.timer.Value = -1;
	}
	public iterate(items: string[]) {
		for (let i = 0; i < items.size(); i++) {
			this.status.Value = items[i];
			this.timer.Value = items.size() - i;
			task.wait(1);
		}
	}
	public withPredicate(name: string, length: number, predicate: () => boolean) {
		for (let i = length; i >= 0; i--) {
			this.timer.Value = i;
			this.status.Value = name;
			if (!predicate()) break;
			task.wait(1);
		}
	}

	public countdown(name: string, length: number) {
		for (let i = length; i >= 0; i--) {
			this.timer.Value = i;
			this.status.Value = name;
			task.wait(1);
		}
	}
}
