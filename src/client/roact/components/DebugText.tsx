import Roact from "@rbxts/roact";
import Hooks from "@rbxts/roact-hooks";
import { Players, RunService } from "@rbxts/services";
import { isDev } from "shared/env";
import { TEXT_COLOR } from "shared/roact/constants";

const DebugText: Hooks.FC = (_props, { useValue, useState, useEffect }) => {
	const [fps, setFps] = useState(0);
	const fpsList = useValue<number[]>([]);
	const parts: string[] = [`Falling Plates v${PKG_VERSION}`];
	isDev && parts.push("DEV");
	parts.push(`${math.round(fps)}fps`);
	parts.push(`${math.round(Players.LocalPlayer.GetNetworkPing() / 1000)}ms`);
	useEffect(() => {
		function refresh() {
			if (fpsList.value.size() === 0) return;
			setFps(fpsList.value.reduce((a, b) => a + b, 0) / fpsList.value.size());
		}

		RunService.BindToRenderStep("fps", Enum.RenderPriority.Last.Value, (dt) => {
			fpsList.value.push(1 / dt);
		});
		task.spawn(() => {
			while (true) {
				refresh();
				wait(1);
			}
		});
	}, []);

	return (
		<textlabel
			Text={parts.join(" ")}
			AutomaticSize={Enum.AutomaticSize.X}
			AnchorPoint={new Vector2(1, 1)}
			Position={new UDim2(1, 0, 1, 0)}
			Size={new UDim2(0, 0, 0, 16)}
			TextScaled={true}
			BorderSizePixel={0}
			BackgroundColor3={new Color3(0, 0, 0)}
			//BackgroundTransparency={0.5}
			Font={Enum.Font.Code}
			TextColor3={TEXT_COLOR}
			Transparency={0.5}
		></textlabel>
	);
};

export = new Hooks(Roact)(DebugText);
