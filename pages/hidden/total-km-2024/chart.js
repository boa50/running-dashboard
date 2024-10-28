import {
    colours,
    runRaceChart,
    addAxis,
    updateXaxis,
    prepareRaceData,
    createAreaChart,
    updateAreaChart
} from "../../../node_modules/visual-components/index.js"

const xFormat = d3.utcFormat("%B")
const yFormat = d => `${d} Km`

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

    const breakpoints = {
        '200': data.filter(d => d.value >= 200)[0],
        '1000': data.filter(d => d.value >= 1000)[0],
        '2000': data.filter(d => d.value >= 2000)[0],
        '3000': data.filter(d => d.value >= 2200)[0],
        'last': data[data.length - 1]
    }

    const addCustomPoints = ({ data, x, y }) => {
        const updatePointPosition = (id, cx, cy) => {
            chart
                .select(`#${id}`)
                .attr('transform', `translate(${[cx, cy]})`)
        }

        const addUpdateBreakpoint = point => {
            if (d3.max(data, d => d.value) >= point) {
                const id = `breakpoint-${point}`
                const cx = x(breakpoints[point].date)
                const cy = y(breakpoints[point].value)

                if (chart.select(`#${id}`).empty()) {
                    chart
                        .append('g')
                        .attr('id', id)
                        .attr('transform', `translate(${[cx, cy]})`)
                        .call(g =>
                            g
                                .append('circle')
                                .attr('r', 3)
                                .attr('fill', 'white')
                                .attr('stroke', palette.blue)
                                .attr('stroke-width', 2)
                        )
                        .call(g =>
                            g
                                .append('text')
                                .attr('x', -8)
                                .attr('dominant-baseline', 'middle')
                                .attr('text-anchor', 'end')
                                .attr('fill', palette.blue)
                                .attr('font-size', '0.75rem')
                                .text(yFormat(point))
                        )
                } else {
                    updatePointPosition(id, cx, cy)
                }
            }
        }

        addUpdateBreakpoint(200)
        addUpdateBreakpoint(1000)
        addUpdateBreakpoint(2000)
        addUpdateBreakpoint(3000)
    }

    const addCustomElements = ({ data, x, y }) => {
        addCustomPoints({ data, x, y })

        const updatePointPosition = (id, cx, cy) => {
            chart
                .select(`#${id}`)
                .attr('transform', `translate(${[cx, cy]})`)
        }

        const updatePointText = (id, value) => {
            chart
                .select(`#${id}`)
                .select('text')
                .text(yFormat(value))
        }

        const addUpdateBreakpoint = point => {
            const id = `breakpoint-${point}`
            const cx = x(d3.max(data, d => d.date))
            const maxValue = d3.max(data, d => d.value)
            const cy = y(maxValue)

            if (chart.select(`#${id}`).empty()) {
                chart
                    .append('g')
                    .attr('id', id)
                    .attr('transform', `translate(${[cx, cy]})`)
                    .call(g =>
                        g
                            .append('circle')
                            .attr('r', 3)
                            .attr('fill', 'white')
                            .attr('stroke', palette.blue)
                            .attr('stroke-width', 2)
                    )
                    .call(g =>
                        g
                            .append('text')
                            .attr('x', -8)
                            .attr('dominant-baseline', 'middle')
                            .attr('text-anchor', 'end')
                            .attr('fill', palette.blue)
                            .attr('font-size', '0.75rem')
                    )
            } else {
                updatePointPosition(id, cx, cy)
                updatePointText(id, maxValue)
            }
        }

        addUpdateBreakpoint('last')
    }

    const raceData = prepareRaceData({ data, dateField: 'dateKey', k: 3 })

    runRaceChart({
        type: 'area',
        chart,
        raceData,
        updateChart: (currentData) => updateAreaChart({
            updateAxis, x, y,
            updateArea: updateChartProps,
            stackedData: currentData
        }),
        x,
        y,
        addCustom: (data, x, y) => addCustomElements({ chart, data, x, y })
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