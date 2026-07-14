import Maid from "@rbxts/maid";
import Roact from "@rbxts/roact";
import Hooks from "@rbxts/roact-hooks";
import { ReplicatedStorage } from "@rbxts/services";
import { TEXT_COLOR } from "shared/roact/constants";

const StatusDisplay: Hooks.FC = (_props, { useState, useEffect }) => {
	const [status, setStatus] = useState("");
	const [timer, setTimer] = useState(0);
	useEffect(() => {
		const maid = new Maid();
		const statusVal = ReplicatedStorage.WaitForChild("Status") as StringValue;
		const timerVal = ReplicatedStorage.WaitForChild("Timer") as NumberValue;

		maid.GiveTask(
			statusVal.GetPropertyChangedSignal("Value").Connect(() => {
				setStatus(statusVal.Value);
			}),
		);
		maid.GiveTask(
			timerVal.GetPropertyChangedSignal("Value").Connect(() => {
				setTimer(timerVal.Value);
			}),
		);
		return () => maid.DoCleaning();
	}, []);

	return (
		<frame Size={new UDim2(1, 0, 0, 64)} BackgroundTransparency={1}>
			<textlabel
				Size={new UDim2(1, 0, (1 / 10) * 6, 0)}
				Text={status}
				TextScaled={true}
				BackgroundTransparency={1}
				TextColor3={TEXT_COLOR}
				TextStrokeColor3={new Color3(0, 0, 0)}
				TextStrokeTransparency={0.5}
				Font={Enum.Font.Cartoon}
			></textlabel>
			<textlabel
				Position={new UDim2(0, 0, 1, 0)}
				AnchorPoint={new Vector2(0, 1)}
				Size={new UDim2(1, 0, (1 / 10) * 5, 0)}
				Text={timer >= 60 ? "%02i:%02i".format(timer / 60, timer % 60) : tostring(timer)}
				BackgroundTransparency={1}
				Font={Enum.Font.PermanentMarker}
				TextColor3={TEXT_COLOR}
				TextStrokeColor3={new Color3(0, 0, 0)}
				TextStrokeTransparency={0.5}
				TextScaled={true}
			></textlabel>
		</frame>
	);
};

export = new Hooks(Roact)(StatusDisplay);
