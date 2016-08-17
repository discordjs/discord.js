<template>
  {{{ '```js\n' + example + '```' | marked }}}
</template>
<script>
export default {
  props: ['example'],
};
</script>