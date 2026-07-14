import { OnStart, Service } from "@flamework/core";
import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import HeadTag from "server/roact/components/HeadTag";
import { getRanksForUserId } from "shared/ranks";
import { reverseArray } from "shared/utils";

@Service({})
export class HeadTagService implements OnStart {
	private handleCharacter(character: Model, player: Player) {
		const hrp = character.WaitForChild("HumanoidRootPart") as Part;

		const element = <HeadTag player={player} ranks={reverseArray(getRanksForUserId(player.UserId))}></HeadTag>;
		Roact.mount(element, hrp);
		const hum = character.WaitForChild("Humanoid") as Humanoid;
		hum.DisplayDistanceType = Enum.HumanoidDisplayDistanceType.None;
	}

	private handlePlayer(player: Player) {
		player.CharacterAdded.Connect((character) => this.handleCharacter(character, player));

		if (player.Character) this.handleCharacter(player.Character, player);
	}
	onStart() {
		Players.GetPlayers().forEach((player) => this.handlePlayer(player));
		Players.PlayerAdded.Connect((player) => this.handlePlayer(player));
	}
}
