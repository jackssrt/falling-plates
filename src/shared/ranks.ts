export class Rank {
	public owners: Set<number>;
	constructor(public name: string, public color: Color3, owners: number[]) {
		this.owners = new Set(owners);
	}
}

const ranks: Rank[] = [
	new Rank("Owner", Color3.fromRGB(255, 0, 0), [103421762]),
	new Rank("Developer", Color3.fromRGB(128, 256, 256), [103421762]),
];

export function getRanksForUserId(userId: number): Rank[] {
	return ranks.filter((rank) => rank.owners.has(userId));
}
