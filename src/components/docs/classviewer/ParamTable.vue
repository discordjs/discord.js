<template>
  <table>
    <tbody>
      <tr>
        <th>Parameter</th>
        <th>Type</th>
        <th>Optional</th>
        <th>Description</th>
      </tr>
      <tr v-for="param in params">
        <td class="{{ param.optional ? 'optional' : '' }}">{{ param.name }}</td>
        <td>{{{ param.type.names[0] }}}</td>
        <td>{{ param.optional ? 'yes' : ''}}</td>
        <td>{{{ param.description | marked }}}</td>
      </tr>
    </tbody>
  </table>
</template>
<script>
export default {
  props: ['params'],
};
</script>
<style scoped lang="scss">

  tr {
    color: #222;
    font-size: 14px;
    background: #eee;
  }

  tr:nth-child(even) {
    background: #fcfcfc;
  }

  td, th {
    text-align: center;
  }

  td:first-child {
    font-family: 'Roboto Mono', monospace;
    font-weight: bold;
  }

  td:last-child {
    text-align: left;
  }

  td, th {
    padding: 0.5rem;
  }

  tr:first-child {
    text-transform: uppercase;
    font-size: 14px;
    color: white;
    background: darken(#2196F3, 10%);
  }

  td.optional {
    font-weight: 500;
  }

  table {
    border-collapse: collapse;
    box-shadow: 0 0 0.5rem #999;
  }
</style>