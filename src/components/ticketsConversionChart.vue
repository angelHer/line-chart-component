<template>
  <div>
    <ul class="chart-period-list">
      <li
        v-for="period in periods"
        :key="period.key"
        class="period-item"
        v-bind:class="{ 'period-item--active': timePeriod === period.key }"
        @click="selectPeriod(period.key)"
      >
        {{ period.label }}
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
      conversionIndicator: {
        indicator: "calculated_total_convertion",
        firstIndicator: "visitor_total_visits",
        secondIndicator: "visitor_total_tickets",
      },
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

    weeklyData() {
      return this.processData("weekly");
    },

    monthlyData() {
      return this.processData("monthly");
    },

    hasValidWeeks() {
      return this.weeklyData.length > 0;
    },

    hasValidMonths() {
      return this.monthlyData.length > 0;
    },

    periods() {
      const periods = [
        { key: "daily", label: "Diario", condition: true },
        { key: "weekly", label: "Semanal", condition: this.hasValidWeeks },
        { key: "monthly", label: "Mensual", condition: this.hasValidMonths },
      ];

      return R.filter((period) => period.condition, periods);
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
          ...R.pick(this.sectionIndicators, item),
        }),
        this.storeData
      );

      // Ordenar los datos por fecha
      const sortedData = R.sortBy(R.prop("date"), data);
      if (period === "daily") {
        return R.map(
          (item) => ({
            ...item,
            date: item.date.format("ddd DD/MM/YYYY"),
            [this.conversionIndicator.indicator]: this.calculateConversion(
              item[this.conversionIndicator.firstIndicator],
              item[this.conversionIndicator.secondIndicator]
            ),
          }),
          sortedData
        );
      } else {
        const grouped = this.aggregateData(sortedData, period);
        return grouped;
      }
    },
    calculateConversion(prop1, prop2) {
      return prop1 !== 0 ? (prop2 * 100) / prop1 : 0;
    },
    /**
     * Agrega los datos agrupados y calcula los totales según el período.
     * @param {Array} data - Datos ordenados a procesar.
     * @param {String} period - Período de agrupación ('weekly' o 'monthly').
     * @returns {Array} - Datos agrupados y agregados.
     */
    aggregateData(data, period) {
      const groupByFn = this.getGroupByFunction(period);
      const groupedData = this.groupDataByPeriod(data, groupByFn);
      const completeGroups = this.filterCompletePeriods(groupedData, period);
      const aggregatedData = this.calculateAggregatedTotals(
        completeGroups,
        period
      );
      return aggregatedData;
    },

    /**
     * Obtiene la función de agrupación basada en el período.
     * @param {String} period - Período de agrupación ('weekly' o 'monthly').
     * @returns {Function} - Función para agrupar los datos.
     */
    getGroupByFunction(period) {
      if (period === "weekly") {
        return (item) =>
          `Semana_${item.date.isoWeek()}_${item.date.isoWeekYear()}`;
      } else if (period === "monthly") {
        return (item) => item.date.format("YYYY-MM");
      }
    },

    /**
     * Agrupa los datos por el período especificado.
     * @param {Array} data - Datos a agrupar.
     * @param {Function} groupByFn - Función de agrupación.
     * @returns {Object} - Datos agrupados.
     */
    groupDataByPeriod(data, groupByFn) {
      return R.groupBy(groupByFn, data);
    },

    /**
     * Filtra los períodos incompletos basados en el período de agrupación.
     * @param {Object} groupedData - Datos agrupados.
     * @param {String} period - Período de agrupación.
     * @returns {Array} - Array de grupos completos.
     */
    filterCompletePeriods(groupedData, period) {
      return R.pipe(
        R.toPairs,
        R.map(([key, items]) => ({
          key,
          items,
          isComplete: this.isPeriodComplete(items, period),
        })),
        R.filter(R.prop("isComplete"))
      )(groupedData);
    },

    /**
     * Calcula los totales agregados para cada grupo.
     * @param {Array} groups - Grupos de datos completos.
     * @param {String} period - Período de agrupación.
     * @returns {Array} - Datos con totales agregados y etiquetas formateadas.
     */
    calculateAggregatedTotals(groups, period) {
      return R.map((group) => {
        const totals = this.calculateTotalsForGroup(group.items);
        totals[this.conversionIndicator.indicator] = this.calculateConversion(
          totals[this.conversionIndicator.firstIndicator],
          totals[this.conversionIndicator.secondIndicator]
        );
        const label = this.getGroupLabel(group.key, period);
        return {
          date: label,
          ...totals,
        };
      }, groups);
    },

    /**
     * Calcula los totales para un grupo de elementos.
     * @param {Array} items - Elementos del grupo.
     * @returns {Object} - Totales calculados para el grupo.
     */
    calculateTotalsForGroup(items) {
      return R.reduce(
        (acc, indicator) => {
          acc[indicator] = R.sum(R.pluck(indicator, items));
          return acc;
        },
        {},
        this.sectionIndicators
      );
    },

    /**
     * Obtiene la etiqueta formateada para un grupo.
     * @param {String} groupKey - Clave del grupo.
     * @param {String} period - Período de agrupación.
     * @returns {String} - Etiqueta formateada.
     */
    getGroupLabel(groupKey, period) {
      if (period === "weekly") {
        return groupKey.replace(/_/g, " ");
      } else if (period === "monthly") {
        return moment(groupKey, "YYYY-MM").format("MMMM YYYY");
      } else {
        return groupKey;
      }
    },
    isPeriodComplete(items, periodType) {
      if (periodType === "weekly") {
        return items.length === 7;
      } else if (periodType === "monthly") {
        const date = items[0].date;
        const daysInMonth = date.daysInMonth();
        return items.length === daysInMonth;
      }
      return true;
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
      const datasets = this.sectionIndicators.map((indicator) => {
        const data = R.map((item) => item[indicator], groupedData);
        return this.createDataset(indicator, data);
      });

      return {
        labels,
        datasets,
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