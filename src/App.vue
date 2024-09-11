<template>
  <div id="app">
    <tickets-conversion-chart />
  </div>
</template>

<script>
import TicketsConversionChart from "./components/ticketsConversionChart.vue";

export default {
  name: "App",
  components: {
    TicketsConversionChart,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
