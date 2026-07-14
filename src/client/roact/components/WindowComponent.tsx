import Maid from "@rbxts/maid";
import Roact from "@rbxts/roact";
import Hooks from "@rbxts/roact-hooks";
import { tween } from "shared/utils";
import { TEXT_COLOR, WIDGET_BG, WINDOW_BG } from "../../../shared/roact/constants";

interface Props {
	title: string;
	size: UDim2;
	openEvent: BindableEvent;
	closeEvent: BindableEvent;
}

const WindowComponent: Hooks.FC<Props> = (
	{ title, size, openEvent, closeEvent, [Roact.Children]: children },
	{ useValue, useEffect },
) => {
	const ref = useValue(Roact.createRef<Frame>());

	function close() {
		const val = ref.value.getValue();
		if (!val) return;
		tween(val, {}, { Position: new UDim2(0.5, 0, 0, -val.AbsoluteSize.X), AnchorPoint: new Vector2(0.5, 1) });
	}

	function open() {
		const val = ref.value.getValue();
		if (!val) return;
		tween(val, {}, { Position: new UDim2(0.5, 0, 0.5, 0), AnchorPoint: new Vector2(0.5, 0.5) });
	}

	useEffect(() => {
		const maid = new Maid();
		maid.GiveTask(
			openEvent.Event.Connect(() => {
				open();
			}),
		);
		maid.GiveTask(
			closeEvent.Event.Connect(() => {
				close();
			}),
		);
		return () => maid.DoCleaning();
	}, []);

	const titlepadding = 8;
	useEffect(() => {
		const val = ref.value.getValue();
		if (!val) return;
		val.Position = new UDim2(0.5, 0, 0, -val.AbsolutePosition.X);
	}, []);
	return (
		<frame
			Key="Window"
			Size={size.add(new UDim2(0, 0, 0, 32).add(new UDim2(0, titlepadding * 2, 0, titlepadding * 4)))}
			AnchorPoint={new Vector2(0.5, 1)}
			Position={new UDim2(0.5, 0, 0, 0)}
			BackgroundColor3={WINDOW_BG}
			Ref={ref.value}
			ClipsDescendants={true}
		>
			<frame
				Key="TitleContainer"
				Size={new UDim2(1, 0, 0, 32 + titlepadding * 2)}
				BackgroundColor3={WIDGET_BG}
				BorderSizePixel={0}
			>
				<frame
					Size={new UDim2(1, 0, 0.5, 0)}
					Position={new UDim2(0, 0, 0.5, 0)}
					BorderSizePixel={0}
					BackgroundColor3={WIDGET_BG}
				></frame>
				<textlabel
					Key="Title"
					Text={title}
					Font={Enum.Font.Roboto}
					TextXAlignment={Enum.TextXAlignment.Left}
					TextColor3={TEXT_COLOR}
					TextStrokeTransparency={1}
					TextScaled={true}
					Size={new UDim2(1, 64, 0, 32)}
					AnchorPoint={new Vector2(0, 0.5)}
					Position={new UDim2(0, 4, 0.5, 0)}
					BackgroundTransparency={1}
				></textlabel>
				<textbutton
					Key="CloseButton"
					Text="X"
					BackgroundColor3={new Color3(1, 0, 0)}
					TextColor3={TEXT_COLOR}
					TextStrokeTransparency={1}
					FontSize={Enum.FontSize.Size32}
					Size={new UDim2(0, 32, 0, 32)}
					Position={new UDim2(1, -titlepadding, 0.5, 0)}
					AnchorPoint={new Vector2(1, 0.5)}
					Event={{
						Activated: () => closeEvent.Fire(),
					}}
					Font={Enum.Font.RobotoMono}
				>
					<uicorner></uicorner>
				</textbutton>
				<uicorner></uicorner>
			</frame>
			<frame
				Key="Content"
				Size={size}
				Position={new UDim2(0.5, 0, 1, -titlepadding)}
				AnchorPoint={new Vector2(0.5, 1)}
				BackgroundTransparency={1}
			>
				{children}
				<uicorner></uicorner>
			</frame>
			<uicorner></uicorner>
		</frame>
	);
};

export = new Hooks(Roact)(WindowComponent);
