import {
  Pie,
  mixins
} from 'vue-chartjs'
const {
  reactiveProp
} = mixins

export default {
  extends: Pie,
  mixins: [reactiveProp],
  props: ['options'],
  computed: {
    data() {
      return this.chartData;
    }
  },
  mounted() {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.data, this.options)
  },
  methods: {
    render() {
      console.log(this.data)
      this.renderChart(this.data, this.options)
    }
  },
  watch: {
    chartData() {
      console.log('?????')
      this._chart.destroy();
      this.render();
    }
  }
}
