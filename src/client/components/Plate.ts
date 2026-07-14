import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";
import { Events } from "client/network";
import { tween } from "shared/utils";

interface Attributes {
	active: boolean;
}

@Component({ tag: "Plate" })
export class Plate extends BaseComponent<Attributes, Part> implements OnStart {
	private fallen = false;
	private orgPos: Vector3 = this.instance.Position;
	private orgMaterial = this.instance.Material;
	private orgSize = this.instance.Size;
	private tween: Tween | undefined;
	onHit(other: BasePart) {
		if (!this.attributes.active || this.fallen) return;
		const plr = Players.GetPlayerFromCharacter(other.Parent);
		if (!plr) return;
		this.fallen = true;
		this.instance.Material = Enum.Material.Neon;

		this.tween = tween(
			this.instance,
			{
				time: 2,
				easingStyle: Enum.EasingStyle.Sine,
			},
			{ Position: new Vector3(this.orgPos.X, -5, this.orgPos.Z), Size: new Vector3(0, 0, 0), Transparency: 1 },
		);
		this.tween.Completed.Wait();
		this.instance.CanCollide = false;
	}

	onStart() {
		const hitbox = this.instance.WaitForChild("Hitbox") as BasePart;
		hitbox.Touched.Connect((hit) => this.onHit(hit));
		this.maid.GiveTask(
			Events.platesReset.connect(() => {
				this.tween?.Cancel();
				this.fallen = false;
				this.instance.Position = this.orgPos;
				this.instance.Material = this.orgMaterial;
				this.instance.CanCollide = true;
				this.instance.Transparency = 0;
				this.instance.Size = this.orgSize;
			}),
		);
	}
}
