import { colours } from '../constant.js'
import { addAxis } from '../components/axis/script.js'

export const addChart = (chartProps, data) => {
    const { chart, width, height } = chartProps

    const x = d3
        .scaleBand()
        .domain([...new Set(data.map(d => d.day))])
        .range([0, width])
        .padding(0.05)

    const y = d3
        .scaleBand()
        .domain([...new Set(data.map(d => d.yearMonth))])
        .range([height, 0])
        .padding(0.05)

    const colour = d3
        .scaleLinear()
        .range(['white', colours.default])
        .domain([0, d3.max(data, d => d.distance)])

    chart
        .selectAll()
        .data(data)
        .join('rect')
        .attr('x', d => x(d.day))
        .attr('y', d => y(d.yearMonth))
        .attr('width', x.bandwidth())
        .attr('height', y.bandwidth())
        .attr('rx', 4)
        .attr('ry', 4)
        .style('fill', d => colour(d.distance))

    addAxis({
        chart,
        height,
        width,
        x,
        y,
        xLabel: 'Day',
        yLabel: 'Year - Month',
        hideXdomain: true,
        hideYdomain: true,
        colour: colours.axis
    })
}