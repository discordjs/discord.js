'use strict';

class Components extends null {
  /**
   * Transforms json data into api-compatible json data.
   * @param {MessageComponentData|APIMessageComponent} data The data to transform.
   * @returns {APIMessageComponentData}
   */
  static transformJSON(data) {
    return {
      type: data?.type,
      custom_id: data?.customId ?? data?.custom_id,
      disabled: data?.disabled,
      style: data?.style,
      label: data?.label,
      emoji: data?.emoji,
      url: data?.url,
      options: data?.options,
      placeholder: data?.placeholder,
      min_values: data?.minValues ?? data?.min_values,
      max_values: data?.maxValues ?? data?.max_values,
      components: data?.components?.map(c => Components.transformJSON(c)),
    };
  }
}

module.exports = Components;
