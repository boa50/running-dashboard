import { getChart } from "./components/utils.js"
import { addChart as addHeatmap } from "./charts/heatmap.js"

const getData = () =>
    d3.csv('data/activities.csv')
        .then(d => d.map(v => {
            const localDate = new Date(v.local_time)
            return {
                yearMonth: `${localDate.getFullYear()} - ${localDate.toLocaleString('default', { month: 'long' })}`,
                day: localDate.getDate(),
                distance: +v.distance
            }
        }))

getData().then(data => {
    addHeatmap(
        getChart(
            'chart1',
            document.getElementById('chart1-container').offsetWidth,
            500,
            {
                left: 132,
                right: 16,
                top: 8,
                bottom: 56
            }
        ),
        data
    )
})