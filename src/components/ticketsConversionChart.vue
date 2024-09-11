<template>
  <div>
    <chart-component
      :chart-data="data"
      :options="configChart"
    ></chart-component>
  </div>
</template>


<script>
import * as R from "ramda";
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
      themeColors: {
        accent: "#E0E0E0",
        background: "#efefef",
        text: "#495057",
      },
      chartPredictionConfig: {
        indicators: {
          visitors: {
            axisId: "y-axis-1",
            fill: true,
            showLine: true,
          },
          tickets: {
            axisId: "y-axis-1",
            fill: true,
            showLine: true,
          },
          ticketsConversion: {
            axisId: "y-axis-2",
            fill: false,
            showLine: false,
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
          tickets: {
            stop1: "rgba(91, 237, 177, 0.8)",
            stop2: "rgba(27, 105, 74, 0.2)",
            linear: 600,
            line: "rgba(91, 237, 177, 7)",
            marginOfError: "rgba(91, 237, 177, 0.3)",
          },
          visitors: {
            stop1: "rgba(61, 133, 119, 0.8)",
            stop2: "rgba(151, 242, 228, 0.1)",
            linear: 700,
            line: "rgba(61, 133, 119, 1)",
            marginOfError: "rgba(61, 133, 119, 0.3)",
          },
          ticketsConversion: {
            stop1: "rgba(151, 242, 228, 1)",
            stop2: "rgba(255, 255, 255, 0.5)",
            linear: 10,
            line: "rgba(151, 242, 228, 1)",
            marginOfError: "rgba(151, 242, 228, 0.3)",
          },
        },
      },
    };
  },

  computed: {
    data() {
      return {
        labels: ["January", "February", "March", "April", "May", "June"],
        datasets: [
          {
            label: "Test",
            data: [10, 20, 30, 40, 50, 60],
            yAxisID: R.path(
              ["indicators", "tickets", "axisId"],
              this.chartPredictionConfig
            ),
            backgroundColor: this.getGradientFill("tickets"),
            fill: true,
            showLine: true,
            stepped: true,
            pointRadius: 4,
            pointHoverRadius: 5,
            borderColor: R.path(
              ["tickets", "line"],
              this.chartPredictionConfig.colors
            ),
            borderWidth: 1.5,
          },
        ],
      };
    },
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
        //           this.chartPredictionConfig.scales.axisRight.filter
        //         ](tooltipItem.value)}`;
        //       } else {
        //         return `${label} ${this.$options.filters[
        //           this.chartPredictionConfig.scales.axisLeft.filter
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
                      this.chartPredictionConfig.scales.axisLeft.filter
                    ](value);
                  return label;
                },
                min: 0,
                precision: 0,
              },
              offset: false,
              type: this.chartPredictionConfig.scales.axisLeft.scale,
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
                labelString: this.chartPredictionConfig.scales.axisLeft.title,
                fontColor: this.themeColors.text,
              },
            },
            {
              ticks: {
                fontColor: this.themeColors.text,
                callback: (value, index, values) => {
                  return (
                    value + this.chartPredictionConfig.scales.axisRight.symbol
                  );
                },
                min: 0,
                precision: 0,
              },
              type: this.chartPredictionConfig.scales.axisRight.scale,
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
                labelString: this.chartPredictionConfig.scales.axisRight.title,
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
  },

  // beforeCreate () {
  //   const div = document.createElement('canvas')
  //   div.setAttribute('id', 'gradientHelper')
  //   div.style.display = 'none'
  //   document.getElementById('__nuxt').appendChild(div);
  // },

  methods: {
    getGradientFill(type) {
      let canvas = document.getElementById("gradientHelper");
      let context = canvas.getContext("2d");
      let gradientFill = context.createLinearGradient(
        0,
        0,
        0,
        this.chartPredictionConfig.colors[type].linear
      );
      gradientFill.addColorStop(
        0,
        this.chartPredictionConfig.colors[type].stop1
      );
      gradientFill.addColorStop(
        1,
        this.chartPredictionConfig.colors[type].stop2
      );

      return gradientFill;
    },
  },
};
</script>