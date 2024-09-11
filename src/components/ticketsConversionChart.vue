<template>
  <div>
    <chart-component :chart-data="data" :options="options"></chart-component>
  </div>
</template>


<script>
import ChartComponent from "./ChartComponent.vue";

import { storeData } from "./data";
import { brandIndicators } from "./brandIndicators";

export default {
  components: {
    ChartComponent,
  },

  data() {
    return {
      storeData,
      brandIndicators,
      data: {
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [
          {
            label: "Data",
            backgroundColor: "#42A5F5",
            data: [40, 20, 30, 50, 80, 60],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  },
};
</script>