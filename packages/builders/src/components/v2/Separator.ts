import type { SeparatorSpacingSize, APISeparatorComponent } from 'discord-api-types/v10';
import { ComponentType } from 'discord-api-types/v10';
import { ComponentBuilder } from '../Component';
import { dividerPredicate, spacingPredicate } from './Assertions';

export class SeparatorBuilder extends ComponentBuilder<APISeparatorComponent> {
	public constructor(data: Partial<APISeparatorComponent> = {}) {
		super({
			type: ComponentType.Separator,
			...data,
		});
	}

	/**
	 * Sets whether this separator should show a divider line.
	 *
	 * @param divider - Whether to show a divider line
	 */
	public setDivider(divider: boolean) {
		this.data.divider = dividerPredicate.parse(divider);
		return this;
	}

	/**
	 * Sets the spacing of this separator.
	 *
	 * @param spacing - The spacing to use
	 */
	public setSpacing(spacing: SeparatorSpacingSize) {
		this.data.spacing = spacingPredicate.parse(spacing);
		return this;
	}

	/**
	 * Clears the spacing of this separator.
	 */
	public clearSpacing() {
		this.data.spacing = undefined;
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public override toJSON(): APISeparatorComponent {
		return { ...this.data } as APISeparatorComponent;
	}
}
