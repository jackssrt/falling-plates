import { OnStart, Service } from "@flamework/core";
import { Players, ServerStorage, Workspace } from "@rbxts/services";
import { Events } from "server/network";
import { isDev } from "shared/env";
import { naturalList } from "shared/utils";
import { DataService } from "./DataService";
import { StatusService } from "./StatusService";
import { TeleportService } from "./TeleportService";

const config = {
	intermissionLength: isDev ? 10 : 30,
	roundLength: 60,
	minPlayers: isDev ? 1 : 2,
} as const;

@Service({})
export class RoundService implements OnStart {
	constructor(
		private statusService: StatusService,
		private teleportService: TeleportService,
		private dataService: DataService,
	) {}
	private contestants = new Set<Player>();
	private plates = Workspace.WaitForChild("Plates").GetChildren() as Part[];
	private plateEvent = ServerStorage.WaitForChild("PlateEvent") as BindableEvent;
	private seedValue = ServerStorage.WaitForChild("PlateSeed") as NumberValue;
	private waitForPlayers(numPlayers: number) {
		while (true) {
			Players.GetPlayers().forEach((player) => {
				if (this.contestants.has(player)) return;
				this.contestants.add(player);
			});
			if (this.contestants.size() >= numPlayers) break;
			this.statusService.setStatus(`Waiting for players ${this.contestants.size()}/${numPlayers}`);
			task.wait(1);
		}
	}
	private disqualifyPlayer(player: Player) {
		this.contestants.delete(player);
	}
	private freezePlayers(players: Set<Player>, freeze = true) {
		players.forEach((player) => {
			const hrp = player.Character?.FindFirstChild("HumanoidRootPart") as BasePart;
			const hum = player.Character?.FindFirstChild("Humanoid") as Humanoid;
			if (!hrp || !hum) return;

			hrp.Anchored = freeze;
		});
	}
	private roundCountdown() {
		this.statusService.iterate(["Ready", "Set", "Go!"]);
	}
	private gameLoop() {
		this.waitForPlayers(config.minPlayers);
		this.statusService.countdown("Intermission", config.intermissionLength);
		this.waitForPlayers(config.minPlayers);
		this.freezePlayers(this.contestants);

		this.teleportService.round(this.plates, this.contestants);
		// Activate blocks
		this.seedValue.Value = math.random();
		this.plateEvent.Fire(true);
		this.roundCountdown();
		this.freezePlayers(this.contestants, false);

		this.statusService.withPredicate(
			"Round in progress",
			config.roundLength,
			() => this.contestants.size() >= (isDev ? 1 : 2),
		);
		// Deactivate blocks
		this.plateEvent.Fire(false);
		Events.platesReset(Players.GetPlayers());
		this.teleportService.lobby(this.contestants);
		if (this.contestants.size() > 0) {
			this.contestants.forEach((p) => this.dataService.addWin(p));
			this.statusService.countdown(
				`Round over - ${naturalList([...this.contestants].map((v) => `@${v.Name}`))} won!`,
				3,
			);
		} else {
			this.statusService.countdown("Round over!", 3);
		}
	}

	onStart() {
		Players.PlayerAdded.Connect((plr) => plr.CharacterAdded.Connect(() => this.disqualifyPlayer(plr)));
		Players.PlayerRemoving.Connect((plr) => this.disqualifyPlayer(plr));
		while (true) this.gameLoop();
	}
}
