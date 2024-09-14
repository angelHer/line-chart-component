<template>
  <div>
    <ul class="chart-period-list">
      <li
        class="period-item"
        v-bind:class="{ 'period-item--active': timePeriod === 'daily' }"
        @click="selectPeriod('daily')"
      >
        Diario
      </li>
      <li
        class="period-item"
        v-bind:class="{ 'period-item--active': timePeriod === 'weekly' }"
        @click="selectPeriod('weekly')"
      >
        Semanal
      </li>
      <li
        class="period-item"
        v-bind:class="{ 'period-item--active': timePeriod === 'monthly' }"
        @click="selectPeriod('monthly')"
      >
        Mensual
      </li>
    </ul>
    <chart-component
      :height="200"
      :chart-data="chartData"
      :options="configChart"
    ></chart-component>
  </div>
</template>


<script>
import * as R from "ramda";
import moment from "moment";
import ChartComponent from "./ChartComponent.vue";

import { storeData } from "./data";

import "moment/locale/es";
moment.locale("es");

export default {
  components: {
    ChartComponent,
  },

  data() {
    return {
      storeData,
      themeColors: {
        accent: "#E0E0E0",
        background: "#efefef",
        text: "#495057",
      },
      chartConfig: {
        indicators: {
          visitor_total_visits: {
            axisId: "y-axis-1",
            fill: true,
            showLine: true,
            label: "Visitas",
          },
          visitor_total_tickets: {
            axisId: "y-axis-1",
            fill: true,
            showLine: true,
            label: "Tickets",
          },
          calculated_total_convertion: {
            axisId: "y-axis-2",
            fill: false,
            showLine: false,
            label: "Conversión de compra",
          },
        },
        scales: {
          axisLeft: {
            scale: "linear",
            filter: "getinNumberFormat",
            title: "Personas",
          },
          axisRight: {
            scale: "linear",
            filter: "getinPercentFormat",
            symbol: "%",
            title: "Conversión de compra",
          },
        },
        colors: {
          visitor_total_tickets: {
            stop1: "rgba(91, 237, 177, 0.8)",
            stop2: "rgba(27, 105, 74, 0.2)",
            linear: 600,
            line: "rgba(91, 237, 177, 7)",
            marginOfError: "rgba(91, 237, 177, 0.3)",
          },
          visitor_total_visits: {
            stop1: "rgba(61, 133, 119, 0.8)",
            stop2: "rgba(151, 242, 228, 0.1)",
            linear: 700,
            line: "rgba(61, 133, 119, 1)",
            marginOfError: "rgba(61, 133, 119, 0.3)",
          },
          calculated_total_convertion: {
            stop1: "rgba(151, 242, 228, 1)",
            stop2: "rgba(255, 255, 255, 0.5)",
            linear: 10,
            line: "rgba(151, 242, 228, 1)",
            marginOfError: "rgba(151, 242, 228, 0.3)",
          },
        },
      },
      sectionIndicators: [
        "visitor_total_visits",
        "visitor_total_tickets",
        "calculated_total_convertion",
      ],
      timePeriod: "daily",
    };
  },

  computed: {
    configChart() {
      return {
        responsive: true,
        hoverMode: "nearest",
        stacked: false,
        // tooltips: {
        //   custom: function (tooltip) {
        //     if (!tooltip) return;
        //     tooltip.displayColors = false;
        //   },
        //   callbacks: {
        //     title: (tooltipItem, data) => {
        //       const dataset = R.nth(tooltipItem[0].datasetIndex, data.datasets);
        //       const pointData = R.nth(tooltipItem[0].index, dataset.data);
        //       return pointData.x;
        //     },
        //     label: (tooltipItem, data) => {
        //       const dataset = data.datasets[tooltipItem.datasetIndex];
        //       if (dataset.hidden) {
        //         return "";
        //       }

        //       let label = dataset.label;
        //       if (
        //         data.datasets[tooltipItem.datasetIndex].yAxisID === "y-axis-2"
        //       ) {
        //         return `${label} ${this.$options.filters[
        //           this.chartConfig.scales.axisRight.filter
        //         ](tooltipItem.value)}`;
        //       } else {
        //         return `${label} ${this.$options.filters[
        //           this.chartConfig.scales.axisLeft.filter
        //         ](tooltipItem.value)}`;
        //       }
        //     },
        //   },
        // },
        legend: {
          display: true,
          position: "bottom",
          labels: {
            fontColor: this.themeColors.text,
            usePointStyle: true,
            // generateLabels: function (chart) {
            //   const data = chart.data;
            //   const allLabels = data.datasets.map((dataset, index) => ({
            //     text: dataset.label,
            //     datasetIndex: index,
            //     hidden: R.has(dataset.label, vm.hiddenDatasets)
            //       ? vm.hiddenDatasets[dataset.label]
            //       : !chart.isDatasetVisible(index),
            //     fillStyle: dataset.backgroundColor,
            //     strokeStyle: dataset.borderColor,
            //     lineWidth: dataset.borderWidth,
            //   }));

            //   // Filtrar etiquetas duplicadas
            //   const uniqueLabels = [];
            //   const uniqueTexts = new Set();

            //   allLabels.forEach((label) => {
            //     if (
            //       !label.text.endsWith("-marginOfError") &&
            //       !uniqueTexts.has(label.text)
            //     ) {
            //       uniqueLabels.push(label);
            //       uniqueTexts.add(label.text);
            //     }
            //   });

            //   return uniqueLabels;
            // },
          },
          //   onClick: function (e, legendItem) {
          //     const chart = this.chart;

          //     const label = legendItem.text;
          //     const errorLabel = `${label}-marginOfError`;
          //     const errorLabelPattern = new RegExp(`^${label}-marginOfError$`);

          //     // Alternar la visibilidad de todos los datasets con la misma etiqueta
          //     chart.data.datasets.forEach((dataset, i) => {
          //       if (
          //         dataset.label === label ||
          //         errorLabelPattern.test(dataset.label)
          //       ) {
          //         const meta = chart.getDatasetMeta(i);
          //         meta.hidden = !meta.hidden;
          //         vm.updateHiddenDatasets(dataset.label, meta.hidden);
          //       }
          //     });

          //     chart.update();
          //   },
        },
        title: {
          display: false,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                fontColor: this.themeColors.text,
                callback: (value) => {
                  let label =
                    this.$options.filters[
                      this.chartConfig.scales.axisLeft.filter
                    ](value);
                  return label;
                },
                min: 0,
                precision: 0,
              },
              offset: false,
              type: this.chartConfig.scales.axisLeft.scale,
              display: true,
              position: "left",
              id: "y-axis-1",
              gridLines: {
                drawBorder: true,
                color: "grey",
                borderDash: [5, 10],
                display: true,
              },
              scaleLabel: {
                display: true,
                labelString: this.chartConfig.scales.axisLeft.title,
                fontColor: this.themeColors.text,
              },
            },
            {
              ticks: {
                fontColor: this.themeColors.text,
                callback: (value, index, values) => {
                  return value + this.chartConfig.scales.axisRight.symbol;
                },
                min: 0,
                precision: 0,
              },
              type: this.chartConfig.scales.axisRight.scale,
              display: true,
              position: "right",
              id: "y-axis-2",
              gridLines: {
                color: "grey",
                borderDash: [5, 10],
                display: true,
              },
              scaleLabel: {
                display: true,
                labelString: this.chartConfig.scales.axisRight.title,
                fontColor: this.themeColors.text,
              },
            },
          ],
          xAxes: [
            {
              //   type: "category",
              ticks: {
                fontColor: this.themeColors.text,
              },
              gridLines: {
                display: false,
              },
            },
          ],
        },
      };
    },

    dailyData() {
      return this.processData("daily");
    },

    chartData() {
      return this.getChartData();
    },
  },

  methods: {
    getGradientFill(type) {
      let canvas = document.getElementById("gradientHelper");
      let context = canvas.getContext("2d");
      let gradientFill = context.createLinearGradient(
        0,
        0,
        0,
        this.chartConfig.colors[type].linear
      );
      gradientFill.addColorStop(0, this.chartConfig.colors[type].stop1);
      gradientFill.addColorStop(1, this.chartConfig.colors[type].stop2);

      return gradientFill;
    },

    selectPeriod(period) {
      this.timePeriod = period;
    },

    processData(period) {
      const data = R.map(
        (item) => ({
          date: moment(item.date, "YYYY-MM-DD"),
          visitor_total_visits: item.visitor_total_visits,
          visitor_total_tickets: item.visitor_total_tickets,
        }),
        this.storeData
      );

      // Ordenar los datos por fecha
      const sortedData = R.sortBy(R.prop("date"), data);

      if (period === "daily") {
        return R.map(
          (item) => ({
            date: item.date.format("ddd DD/MM/YYYY"),
            visitor_total_visits: item.visitor_total_visits,
            visitor_total_tickets: item.visitor_total_tickets,
            calculated_total_convertion: this.calculateConversion(
              item.visitor_total_visits,
              item.visitor_total_tickets
            ),
          }),
          sortedData
        );
      } else {
        const grouped = this.aggregateData(sortedData, period);
        return grouped;
      }
    },
    calculateConversion(visits, tickets) {
      return visits !== 0 ? (tickets * 100) / visits : 0;
    },
    getChartData() {
      let groupedData;
      if (this.timePeriod === "daily") {
        groupedData = this.dailyData;
      } else if (this.timePeriod === "weekly") {
        groupedData = this.weeklyData;
      } else if (this.timePeriod === "monthly") {
        groupedData = this.monthlyData;
      }

      const labels = R.map((item) => item.date, groupedData);
      const visitorTotalVisits = R.map(
        (item) => item.visitor_total_visits,
        groupedData
      );
      const visitorTotalTickets = R.map(
        (item) => item.visitor_total_tickets,
        groupedData
      );
      const calculatedTotalConvertion = R.map(
        (item) => item.calculated_total_convertion,
        groupedData
      );

      return {
        labels,
        datasets: [
          this.createDataset("visitor_total_visits", visitorTotalVisits),
          this.createDataset("visitor_total_tickets", visitorTotalTickets),
          this.createDataset(
            "calculated_total_convertion",
            calculatedTotalConvertion
          ),
        ],
      };
    },

    createDataset(key, data) {
      const chartConfig = R.prop("indicators", this.chartConfig);
      return {
        label: R.path([key, "label"], chartConfig),
        data: data,
        yAxisID: R.path([key, "axisId"], chartConfig),
        backgroundColor: this.getGradientFill(key),
        fill: R.path([key, "fill"], chartConfig),
        showLine: R.path([key, "showLine"], chartConfig),
        stepped: true,
        pointRadius: 4,
        pointHoverRadius: 5,
        borderColor: R.path([key, "line"], this.chartConfig.colors),
        borderWidth: 1.5,
      };
    },
  },
};
</script>

<style>
.chart-period-list {
  list-style: none;
  display: flex;
  gap: 10px;
}

.period-item {
  display: inline;
  padding: 5px 15px;
  cursor: pointer;
  font-size: 14px;
}

.period-item--active {
  color: white;
  background: #2cae79;
  border-radius: 15px;
  text-align: center;
}
</style>