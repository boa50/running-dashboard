import { getChart } from "./components/utils.js"
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
    addHeatmap(
        getChart(
            'chart1',
            document.getElementById('chart1-container').offsetWidth,
            document.getElementById('chart1-container').offsetHeight,
            {
                left: 148,
                right: 384,
                top: 72,
                bottom: 16
            }
        ),
        data
    )
})