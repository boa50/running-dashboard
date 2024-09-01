import { colours, runRaceChart, addAxis } from "../../../node_modules/visual-components/index.js"

export const plotChart = async (chartProps) => {
    const data = await prepareData(2024)
    console.log(d3.max(data, d => d.distance));

    const { chart, width, height } = chartProps
    const palette = colours.paletteLightBg

    const x = d3
        .scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, width])

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.value) * 1.05])
        .range([height, 0])

    addAxis({
        chart,
        height,
        width,
        colour: palette.axis,
        x,
        y,
        xFormat: d3.utcFormat("%B"),
        yFormat: d => `${d} Km`
    })

    chart
        .selectAll('.x-axis-group .tick text')
        .attr('transform', 'rotate(45)')
        .attr('text-anchor', 'start')
        .attr('dx', '0.1rem')
        .attr('dy', '0.1rem')

    runRaceChart({
        type: 'area',
        chart,
        data,
        dateField: 'dateKey',
        x,
        y,
        splitsPerStep: 3,
        customAttrs: (area) => {
            area
                .attr('fill', palette.blue)
                .attr('opacity', 0.25)
        }
    })
}

async function prepareData(year = 2024) {
    const distances = await d3.csv('/data/activities.csv')
        .then(dt => dt
            .filter(d => new Date(d.local_time).getFullYear() === year)
            .map(d => {
                const localDate = new Date(d.local_time)
                return {
                    dateKey: d.local_time.substring(0, 10),
                    date: localDate,
                    distance: +d.distance
                }
            }).sort((a, b) => a.date - b.date))

    const data = []

    const currentDate = new Date(`${year}-01-01T00:00:00Z`)
    for (let i = 0; i < 366; i++) {
        const dateKey = currentDate.toISOString().substring(0, 10)

        const distanceData = distances.filter(d => d.dateKey === dateKey)
        const distanceDay = (distanceData.length > 0 ? distanceData[0].distance : 0) / 1000
        const distance = data.length > 0 ? data[data.length - 1].distance + distanceDay : distanceDay

        data.push({
            dateKey,
            date: new Date(currentDate.getTime()),
            group: '',
            distanceDay,
            distance,
            value: distance
        })

        currentDate.setDate(currentDate.getDate() + 1)
    }

    return data
}