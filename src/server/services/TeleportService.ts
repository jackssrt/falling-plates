import { Service } from "@flamework/core";
import { Workspace } from "@rbxts/services";
import { randomIndex } from "shared/utils";

@Service({})
export class TeleportService {
	private spawnPoint = Workspace.WaitForChild("SpawnLocation") as SpawnLocation;
	private teleport(player: Player, location: CFrame) {
		const hrp = player.Character?.FindFirstChild("HumanoidRootPart") as BasePart;
		if (hrp) hrp.CFrame = location.add(new Vector3(0, 5, 0));
	}
	public teleports(players: Set<Player>, location: CFrame) {
		players.forEach((player) => this.teleport(player, location));
	}
	public lobby(players: Set<Player>) {
		this.teleports(players, this.spawnPoint.CFrame);
	}

	public round(plates: Part[], players: Set<Player>) {
		players.forEach((player) => this.teleport(player, new CFrame(randomIndex(plates).Position)));
	}
}
