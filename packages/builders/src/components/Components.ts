import { APIMessageComponent, ComponentType } from 'discord-api-types/v9';
import { ActionRow, ButtonComponent, Component, SelectMenuComponent } from '../index';
import type { MessageComponent } from './ActionRow';

export interface MappedComponentTypes {
	[ComponentType.ActionRow]: ActionRow;
	[ComponentType.Button]: ButtonComponent;
	[ComponentType.SelectMenu]: SelectMenuComponent;
}

/**
 * Factory for creating components from API data
 * @param data The api data to transform to a component class
 */
export function createComponent<T extends keyof MappedComponentTypes>(
	data: APIMessageComponent & { type: T },
): MappedComponentTypes[T];
export function createComponent<C extends MessageComponent>(data: C): C;
export function createComponent(data: APIMessageComponent | MessageComponent): Component {
	switch (data.type) {
		case ComponentType.ActionRow:
			return (data instanceof ActionRow ? data : new ActionRow(data)) as Component;
		case ComponentType.Button:
			return (data instanceof ButtonComponent ? data : new ButtonComponent(data)) as Component;
		case ComponentType.SelectMenu:
			return (data instanceof SelectMenuComponent ? data : new SelectMenuComponent(data)) as Component;
		default:
			// @ts-expect-error
			throw new Error(`Cannot serialize component type: ${data.type as number}`);
	}
}

export function buildComponent<T>(source: Component) {
	const target: Record<string, unknown> = {};
	const props = [
		...Object.getOwnPropertyNames(Object.getPrototypeOf(source)),
		...Object.getOwnPropertyNames(source),
	].filter((prop) => typeof source[prop as keyof typeof source] !== 'function' || prop === 'toJSON');
	props.forEach((x) => {
		target[x] = source[x as keyof typeof source];
	});
	return target as T;
}
