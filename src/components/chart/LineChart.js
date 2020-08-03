import { Line, mixins } from "vue-chartjs";
import zoom from 'chartjs-plugin-zoom';
const { reactiveProp } = mixins;

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ["options"],
  mounted() {
    this.addPlugin(zoom);
    this.renderChart(this.chartData, this.options);
  },
  updated() {
    this.renderChart(this.chartData, this.options);
  }
};
