import { BaseComponent, Component } from "@flamework/components";
import { OnInit, OnStart } from "@flamework/core";
import { Players, ServerStorage } from "@rbxts/services";

interface Attributes {
	active: boolean;
}

@Component({ tag: "Plate" })
export class Plate extends BaseComponent<Attributes, Part> implements OnStart, OnInit {
	private event = ServerStorage.WaitForChild("PlateEvent") as BindableEvent;
	private seed = ServerStorage.WaitForChild("PlateSeed") as NumberValue;
	private orgPos = this.instance.Position;
	private orgColor = this.instance.BrickColor;
	private fallen = false;
	private activate() {
		this.instance.CanCollide = true;
		const offset = this.seed.Value * 1000;
		this.instance.Color = Color3.fromHSV(
			math.clamp(
				math.noise(this.instance.Position.X / 64 + offset, this.instance.Position.Z / 64 + offset) + 0.4,
				0,
				1,
			),
			1,
			1,
		);
		this.fallen = false;
		this.setAttribute("active", true);
	}
	private deactivate() {
		this.setAttribute("active", false);
		this.instance.Position = this.orgPos;
		this.instance.BrickColor = this.orgColor;
	}
	private onHit(other: BasePart) {
		if (!this.attributes.active || this.fallen) return;
		const plr = Players.GetPlayerFromCharacter(other.Parent);
		if (!plr) return;
		this.fallen = true;
		task.wait(2.1);
		this.instance.CanCollide = false;
	}

	onInit() {
		this.deactivate();
	}

	onStart() {
		this.event.Event.Connect((v: boolean) => (v ? this.activate() : this.deactivate()));
		const hitbox = new Instance("Part");
		hitbox.Name = "Hitbox";
		hitbox.Size = this.instance.Size;
		hitbox.Anchored = true;
		hitbox.CanCollide = false;
		hitbox.Transparency = 1;
		hitbox.Position = this.instance.Position.add(new Vector3(0, 0.5, 0));
		hitbox.Touched.Connect((hit) => this.onHit(hit));
		hitbox.Parent = this.instance;
	}
}
