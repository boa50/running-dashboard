import { appendChartContainer, getChart } from "../../../node_modules/visual-components/index.js"
import { plotChart } from "./chart.js"

const totalKmId = appendChartContainer({ idNum: 1, chartTitle: 'Total Km 2024' })
await new Promise(r => setTimeout(r, 1));

plotChart(getChart({ id: totalKmId }))