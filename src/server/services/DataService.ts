import { OnStart, Service } from "@flamework/core";
import ProfileService from "@rbxts/profileservice";
import { Profile } from "@rbxts/profileservice/globals";
import { Players } from "@rbxts/services";

const profileTemplate = {
	wins: 0,
} as const;

type MyProfile = Writable<typeof profileTemplate>;

@Service({})
export class DataService implements OnStart {
	private profileStore = ProfileService.GetProfileStore("PlayerData", profileTemplate);
	private profiles = new Map<Player, Profile<MyProfile>>();

	private loadedPlayerData(player: Player, profile: Profile<MyProfile>) {
		const lead = new Instance("Folder");
		lead.Name = "leaderstats";
		lead.Parent = player;
		const wins = new Instance("NumberValue");
		wins.Name = "Wins";
		wins.Value = profile.Data.wins;
		wins.Parent = lead;
	}
	private updateLeaderstats(player: Player, profile: Profile<MyProfile>) {
		const lead = player.FindFirstChild("leaderstats");
		const wins = lead?.FindFirstChild("Wins") as NumberValue | undefined;
		if (!wins) return;
		wins.Value = profile.Data.wins;
	}

	public addWin(player: Player) {
		const profile = this.profiles.get(player);
		if (!profile) return;
		profile.Data.wins++;
		this.updateLeaderstats(player, profile);
	}

	private playerAdded(player: Player) {
		const profile = this.profileStore.LoadProfileAsync(`Player_${player.UserId}`);
		if (!profile) return player.Kick();
		profile.AddUserId(player.UserId); // GDPR compliance
		profile.Reconcile(); // Fill in missing variables from ProfileTemplate (optional)
		profile.ListenToRelease(() => {
			this.profiles.delete(player);
			// The profile could've been loaded on another Roblox server:
			player.Kick();
		});
		if (player.IsDescendantOf(Players)) {
			this.profiles.set(player, profile);
			// A profile has been successfully loaded:
			this.loadedPlayerData(player, profile);
		}
		// Player left before the profile loaded:
		else profile.Release();
	}

	onStart() {
		Players.GetPlayers().forEach((plr) => task.spawn(() => this.playerAdded(plr)));
		Players.PlayerAdded.Connect((plr) => this.playerAdded(plr));
		Players.PlayerRemoving.Connect((plr) => {
			this.profiles.get(plr)?.Release();
		});
	}
}
