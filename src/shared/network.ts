import { Networking } from "@flamework/networking";
// Client -> Server events
interface ServerEvents {}
// Server -> Client events
interface ClientEvents {
	platesReset(): void;
}

interface ServerFunctions {}

interface ClientFunctions {}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();
