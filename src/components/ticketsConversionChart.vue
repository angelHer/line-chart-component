<template>
  <div>
    <div class="chart-header">
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
      <div v-if="datesOff.length > 0">
        <input
          type="checkbox"
          name="showOffDays"
          v-model="showOffDays"
          class="dates-off_check"
        />
        <label for="showOffDays">Mostrar dias apagados</label>
      </div>
    </div>
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
      showOffDays: false,
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
          },
          visitor_total_visits: {
            stop1: "rgba(61, 133, 119, 0.8)",
            stop2: "rgba(151, 242, 228, 0.1)",
            linear: 700,
            line: "rgba(61, 133, 119, 1)",
          },
          calculated_total_convertion: {
            stop1: "rgba(63, 249, 172, 0.8)",
            stop2: "rgba(63, 249, 172, 0.2)",
            linear: 10,
            line: "rgba(6, 22, 15, 1)",
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
    storeDataValidated() {
      return R.map(
        (data) => ({
          ...data,
          uptimeValidated: this.isRejectedDate(data) ? 0 : data.uptime_total,
        }),
        this.storeData
      );
    },

    datesOff() {
      return R.pluck(
        "date",
        R.filter((data) => data.uptimeValidated === 0, this.storeDataValidated)
      );
    },

    configChart() {
      return {
        responsive: true,
        hoverMode: "nearest",
        stacked: false,
        tooltips: {
          custom: function (tooltip) {
            if (!tooltip) return;
            tooltip.displayColors = false;
          },
          callbacks: {
            label: (tooltipItem, data) => {
              const dataset = data.datasets[tooltipItem.datasetIndex];
              if (dataset.hidden) {
                return "";
              }

              let label = dataset.label;
              if (
                data.datasets[tooltipItem.datasetIndex].yAxisID === "y-axis-2"
              ) {
                return `${label} ${this.$options.filters[
                  this.chartConfig.scales.axisRight.filter
                ](tooltipItem.value)}`;
              } else {
                return `${label} ${this.$options.filters[
                  this.chartConfig.scales.axisLeft.filter
                ](tooltipItem.value)}`;
              }
            },
          },
        },
        legend: {
          display: true,
          position: "bottom",
          labels: {
            fontColor: this.themeColors.text,
            usePointStyle: true,
          },
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
      const processedData = R.pipe(
        R.map((item) => {
          const dateMoment = moment(item.date, "YYYY-MM-DD");
          const isOffDay = this.isRejectedDate(item);

          let indicators = R.pick(this.sectionIndicators, item);
          if (!this.showOffDays && isOffDay) {
            indicators = R.map(() => 0, indicators);
          }

          indicators[this.conversionIndicator.indicator] =
            this.calculateConversion(
              indicators[this.conversionIndicator.firstIndicator],
              indicators[this.conversionIndicator.secondIndicator]
            );

          const formattedDate =
            period === "daily"
              ? dateMoment.format("ddd DD/MM/YYYY")
              : dateMoment;

          return {
            date: formattedDate,
            ...indicators,
            isOffDay,
            dateMoment,
          };
        }),
        R.sortBy(R.prop("dateMoment"))
      )(this.storeData);

      if (period === "daily") {
        return processedData;
      } else {
        // Para períodos semanales o mensuales, agrupamos y agregamos los datos
        const grouped = this.aggregateData(processedData, period);
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
        const hasOffDay = group.items.some((item) => item.isOffDay);

        return {
          date: label,
          ...totals,
          hasOffDay,
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
          const values = R.map((item) => {
            return !this.showOffDays && item.isOffDay ? 0 : item[indicator];
          }, items);
          acc[indicator] = R.sum(values);
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
        const offDayFlags = R.map(
          (item) =>
            this.timePeriod === "daily" ? item.isOffDay : item.hasOffDay,
          groupedData
        );
        return this.createDataset(indicator, data, offDayFlags);
      });

      return {
        labels,
        datasets,
      };
    },

    createDataset(key, data, offDayFlags) {
      const chartConfig = R.prop("indicators", this.chartConfig);
      const pointBackgroundColors = R.map(
        (isOffDay) => (isOffDay && !this.showOffDays ? "#c2313f" : undefined),
        offDayFlags
      );

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
        pointBackgroundColor: pointBackgroundColors,
        pointBorderColor: pointBackgroundColors,
      };
    },

    isRejectedDate({
      visitor_total_peasents = 0,
      visitor_total_viewer = 0,
      visitor_total_visits = 0,
      uptime_total,
    }) {
      const totalActivity =
        visitor_total_peasents + visitor_total_viewer + visitor_total_visits;
      return totalActivity === 0 || uptime_total == 0;
    },
  },
};
</script>

<style>
.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

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