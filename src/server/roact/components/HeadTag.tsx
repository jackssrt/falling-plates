import Roact from "@rbxts/roact";
import Hooks from "@rbxts/roact-hooks";
import { Rank } from "shared/ranks";
import { TEXT_COLOR } from "shared/roact/constants";
import { reverseArray } from "shared/utils";

interface Props {
	player: Player;
	ranks: Rank[];
}

const HeadTag: Hooks.FC<Props> = ({ ranks, player }, {}) => {
	const newRanks = reverseArray(ranks);
	return (
		<billboardgui
			Size={new UDim2(0, 1, 0, ranks.size() * 18 + 20)}
			ClipsDescendants={false}
			LightInfluence={0}
			SizeOffset={new Vector2(0, 0.5)}
			StudsOffset={new Vector3(0, 3, 0)}
		>
			{newRanks.map((rank, i) => (
				<textlabel
					Text={rank.name}
					BorderSizePixel={0}
					TextColor3={rank.color}
					// BackgroundColor3={new Color3()}
					BackgroundTransparency={1}
					TextStrokeColor3={new Color3()}
					TextStrokeTransparency={0}
					AutomaticSize={Enum.AutomaticSize.X}
					TextScaled={true}
					Font={Enum.Font.Cartoon}
					AnchorPoint={new Vector2(0.5, 1)}
					Size={new UDim2(0, 0, 0, 18)}
					Position={new UDim2(0.5, 0, 1, -(i * 18 + 20))}
				></textlabel>
			))}
			<textlabel
				Text={`@${player.Name}`}
				TextColor3={TEXT_COLOR}
				TextStrokeColor3={new Color3()}
				TextStrokeTransparency={0}
				BorderSizePixel={0}
				// BackgroundColor3={new Color3()}
				BackgroundTransparency={1}
				AutomaticSize={Enum.AutomaticSize.X}
				TextScaled={true}
				Font={Enum.Font.Cartoon}
				Size={new UDim2(0, 0, 0, 20)}
				AnchorPoint={new Vector2(0.5, 1)}
				Position={new UDim2(0.5, 0, 1, 0)}
			></textlabel>
		</billboardgui>
	);
};

export = new Hooks(Roact)(HeadTag);
