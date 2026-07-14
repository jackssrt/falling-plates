import { TweenService } from "@rbxts/services";

export function randomIndex<T extends Array<unknown>>(array: T): T[number] {
	if (array.size() === 0) error("Tried to call randomIndex on an empty array");
	return array[new Random().NextInteger(0, array.size() - 1)];
}
export function naturalList(items: string[]): string {
	return items.reduce((acc, x, i) => {
		if (i === 0) return acc + x;
		if (i === items.size() - 1) return acc + " and " + x;
		return acc + ", " + x;
	}, "");
}
interface TweenInfo {
	time: number;
	easingStyle: Enum.EasingStyle;
	easingDirection: Enum.EasingDirection;
	repeatCount: number;
	reverses: boolean;
	delayTime: number;
}
export function tween<T extends Instance>(
	instance: T,
	tweenInfo: Partial<TweenInfo>,
	props: Partial<ExtractMembers<T, Tweenable>>,
): Tween {
	const tween = TweenService.Create(
		instance,
		new TweenInfo(
			tweenInfo.time ?? 0.25,
			tweenInfo.easingStyle ?? Enum.EasingStyle.Quad,
			tweenInfo.easingDirection ?? Enum.EasingDirection.InOut,
			tweenInfo.repeatCount ?? 0,
			tweenInfo.reverses ?? false,
			tweenInfo.delayTime ?? 0,
		),
		props,
	);
	tween.Play();
	return tween;
}

export function reverseArray<T extends defined>(array: T[]): T[] {
	const newArray: T[] = [];
	for (let i = array.size() - 1; i >= 0; i--) {
		newArray.push(array[i] as T);
	}
	return newArray;
}
