import { colours } from "./constant.js"
import { getChart, getChartDimensions } from "./node_modules/visual-components/index.js"
import { addChart as addHeatmap } from "./charts/heatmap.js"

const getData = () =>
    d3.csv('data/activities.csv')
        .then(d => d.map(v => {
            const localDate = new Date(v.local_time)
            return {
                yearMonth: `${localDate.getFullYear()} - ${localDate.toLocaleString('default', { month: 'long' })}`,
                date: localDate,
                day: localDate.getDate(),
                distance: +v.distance
            }
        }).sort((a, b) => a.date - b.date))

getData().then(data => {
    const totalKm = Math.trunc(data.reduce((total, d) => total + d.distance, 0) / 1e6) * 1e3

    d3
        .select('#chart1-title')
        .html(`All my tracked activities, which contributed to covering more than 
        <span class="font-extrabold" style="color: ${colours.annotationPoint};">${totalKm}km</span>`)

    addHeatmap(
        getChart({
            id: 'chart1',
            chartDimensions: getChartDimensions({ chartId: 'chart1', xl2: { width: 1500 } }),
            margin: {
                left: 148,
                right: 384,
                top: 72,
                bottom: 32
            }
        }),
        data
    )
})