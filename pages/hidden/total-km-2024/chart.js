import { colours, runRaceChart } from "../../../node_modules/visual-components/index.js"

export const plotChart = async (chartProps) => {
    const data = await prepareData(2024)
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

    runRaceChart({
        type: 'area',
        chart,
        data,
        dateField: 'dateKey',
        x,
        y,
        customAttrs: (area) => {
            area
                .attr('fill', palette.blue)
                .attr('opacity', 0.25)
        }
    })



    // const area = d3
    //     .area()
    //     .x(d => x(d.date))
    //     .y0(y(0))
    //     .y1(d => y(d.distance))

    // chart
    //     .selectAll('.area-path')
    //     .data([data])
    //     .join('path')
    //     .attr('class', 'area-path')
    //     .attr('fill', palette.blue)
    //     .attr('opacity', 0.25)
    //     .attr('d', area)

    // const line = d3
    //     .line()
    //     .x(d => x(d.date))
    //     .y(d => y(d.distance))

    // chart
    //     .selectAll('.line-path')
    //     .data([data])
    //     .join('path')
    //     .attr('class', 'line-path')
    //     .attr('fill', 'none')
    //     .attr('stroke', palette.blue)
    //     .attr('stroke-width', 1)
    //     .attr('d', line)

    // console.log(data);
    // console.log(d3.max(data, d => d.distance / 1000))
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
        const distanceDay = distanceData.length > 0 ? distanceData[0].distance : 0
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