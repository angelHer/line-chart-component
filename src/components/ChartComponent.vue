<script>
import { Line } from "vue-chartjs";
import chartjsPluginAnnotation from "chartjs-plugin-annotation";

export default {
  extends: Line,

  props: {
    options: {
      type: Object,
      required: true,
    },

    chartData: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      position: "relative",
    };
  },

  watch: {
    chartData() {
      this.updateChart();
    },

    options() {
      this.updateChart();
    },
  },

  mounted() {
    this.updateChart();
  },

  methods: {
    updateChart() {
      this.renderChart(this.chartData, this.options);
    },
  },
};
</script>
