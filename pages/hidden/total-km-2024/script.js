import { appendChartContainer, getChart, getMargin, getChartDimensions } from "../../../node_modules/visual-components/index.js"
import { plotChart } from "./chart.js"

const totalKmId = appendChartContainer({
    idNum: 1,
    chartTitle: 'My road to +3000km running in 2024',
    containerAspectRatio: 'aspect-square',
    titleSize: 'text-xl'
})
await new Promise(r => setTimeout(r, 1));

plotChart(getChart({
    id: totalKmId,
    margin: getMargin({ left: 16, bottom: 64 }),
    chartDimensions: getChartDimensions({ chartId: totalKmId, xl2: { width: 750 }, xl: { width: 500 } })
}))