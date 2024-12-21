import {
    colours,
    runRaceChart,
    addAxis,
    updateXaxis,
    prepareRaceData,
    createAreaChart,
    updateAreaChart
} from "../../../node_modules/visual-components/index.js"

import { addCustomPoints } from "./custom-elements.js"

const xFormat = d3.utcFormat("%B")

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

    addAxis({
        chart,
        height,
        width,
        colour: palette.axis,
        x,
        xFormat,
        hideXdomain: true,
        xTicksRotate: true
    })

    const xTicks = [...Array(12).keys()].map(month => new Date(2024, month, 1))

    const updateAxis = stackedData => {
        const maxValue = d3.max(d3.union(...stackedData.map(d => d.map(v => d3.max(v, v2 => Math.abs(v2))))), d => d)
        y.domain([0, maxValue].map(d => d * 1.05))

        updateXaxis({
            chart,
            x,
            format: xFormat,
            hideDomain: true,
            transitionFix: false,
            tickValues: xTicks,
            rotate: true
        })
    }

    const updateChartProps = createAreaChart({
        chart, x, y,
        isAddLine: true,
        customAttrs: area => {
            area
                .attr('fill', palette.blue)
                .attr('opacity', 0.25)
        }
    })

    runRaceChart({
        type: 'area',
        chart,
        raceData: buildRaceData({ data }),
        updateChart: (currentData) => updateAreaChart({
            updateAxis, x, y,
            updateArea: updateChartProps,
            stackedData: currentData
        }),
        x,
        y,
        addCustom: (data, x, y) => addCustomPoints({ chart, data, x, y, height })
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

function buildRaceData({ data }) {
    const slowestPoint = d3.max(data, d => d.value)

    const speeds = [3, 5, 7]
    const breakpoints = [slowestPoint - 200, slowestPoint - 100, slowestPoint]


    const data1 = data.filter(d => d.value < breakpoints[0])
    const data2 = data.filter(d => (d.value >= breakpoints[0]) && ((d.value < breakpoints[1])))
    const data3 = data.filter(d => (d.value >= breakpoints[1]))

    const raceData = prepareRaceData({ data: data1, dateField: 'dateKey', k: speeds[0] })
    raceData.keyframes.push(...prepareRaceData({ data: data2, dateField: 'dateKey', k: speeds[1] }).keyframes)
    raceData.keyframes.push(...prepareRaceData({ data: data3, dateField: 'dateKey', k: speeds[2] }).keyframes)

    return raceData

    // return prepareRaceData({ data: data, dateField: 'dateKey', k: 1 })
}