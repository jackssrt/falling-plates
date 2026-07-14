import { Dependency } from "@flamework/core";
import Roact from "@rbxts/roact";
import Hooks from "@rbxts/roact-hooks";
import { Window, WindowController, WindowID } from "client/controllers/WindowController";
import { ACCENT_COLOR, TEXT_COLOR, WIDGET_BG } from "../../../shared/roact/constants";
import WindowComponent from "./WindowComponent";

const Feedback: Hooks.FC = (_props, { useEffect, useValue }) => {
	const closeEvent = useValue<BindableEvent>(new Instance("BindableEvent"));
	const openEvent = useValue<BindableEvent>(new Instance("BindableEvent"));
	useEffect(() => {
		const windowController = Dependency<WindowController>();
		windowController.registerWindow(new Window(WindowID.Feedback, closeEvent.value, openEvent.value));
	}, []);
	return (
		<WindowComponent
			title="Feedback"
			size={new UDim2(0, 512, 0, 512)}
			openEvent={openEvent.value}
			closeEvent={closeEvent.value}
		>
			<textbox
				Font={Enum.Font.Roboto}
				FontSize={Enum.FontSize.Size32}
				Size={new UDim2(1, 0, 1, -32 - 8)}
				BackgroundColor3={WIDGET_BG}
				TextColor3={TEXT_COLOR}
				MultiLine={true}
				ClearTextOnFocus={false}
				PlaceholderText="Write some feedback..."
				TextYAlignment={Enum.TextYAlignment.Top}
				TextXAlignment={Enum.TextXAlignment.Left}
			>
				<uicorner></uicorner>
			</textbox>
			<textbutton
				AnchorPoint={new Vector2(1, 1)}
				Position={new UDim2(1, 0, 1, 0)}
				Size={new UDim2(0, 64, 0, 32)}
				Text="Send"
				TextColor3={TEXT_COLOR}
				Font={Enum.Font.Roboto}
				FontSize={Enum.FontSize.Size24}
				RichText={true}
				BackgroundColor3={ACCENT_COLOR}
			>
				<uicorner></uicorner>
			</textbutton>
		</WindowComponent>
	);
};

export = new Hooks(Roact)(Feedback);
