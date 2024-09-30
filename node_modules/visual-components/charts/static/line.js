import { colours, addLegend } from '../../index.js'

export const line = ({
    chartProps,
    data,
    theme = 'light',
    colour = 'blue',
    xField,
    yField,
    x,
    y,
    axis,
    strokeWidth = 1,
    legend = true,
    tooltip = true
}) => {
    const { chart, width, height, margin } = chartProps
    const palette = theme === 'light' ? colours.paletteLightBg : colours.paletteDarkBg

    const axes = defineAxes(data, width, height, x, y, xField, yField)
    x = axes.x
    y = axes.y

    plotLine(chart, data, x, y, xField, yField, palette, colour, strokeWidth)
    plotAxes(axis, chart, width, height, x, y, palette)
    if (legend) plotLegend(chart, yField, colour, margin)
    if (tooltip) plotTooltip(chart, data, xField, yField, colour, x, y, width, height)

    return { x, y }
}

function defineAxes(data, width, height, x, y, xField, yField) {
    x = x !== undefined ? x : d3
        .scaleUtc()
        .domain(d3.extent(data, d => d[xField]))
        .range([0, width])

    y = y !== undefined ? y : d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d[yField]) * 1.05])
        .range([height, 0])

    return { x, y }
}

function plotLine(chart, data, x, y, xField, yField, palette, colour, strokeWidth) {
    const line = d3
        .line()
        .x(d => x(d[xField]))
        .y(d => y(d[yField]))

    chart
        .selectAll('.data-line')
        .data([data])
        .join('path')
        .attr('fill', 'none')
        .attr('stroke', palette[colour])
        .attr('stroke-width', strokeWidth)
        .attr('d', line)
}

function plotAxes(axis, chart, width, height, x, y, palette) {
    if (axis !== undefined) {
        axis()
    } else {
        addAxis({
            chart,
            width,
            height,
            colour: palette.axis,
            x,
            y
        })
    }
}

function plotLegend(chart, yField, colour, margin) {
    addLegend({
        chart,
        legends: [yField].map(d => d.charAt(0).toUpperCase() + d.slice(1)),
        colours: [colour],
        xPosition: -margin.left,
        yPosition: -12
    })
}

function plotTooltip(chart, data, xField, yField, colour, x, y, width, height) {
    addLineTooltip({
        chart,
        htmlText: d => `
        <strong>${d[xField]}</strong>
        <div style="display: flex; justify-content: space-between">
            <span>Value:&emsp;</span>
            <span>${d[yField]}</span>
        </div>
        `,
        colour,
        data,
        cx: d => x(d[xField]),
        cy: d => y(d[yField]),
        chartWidth: width,
        chartHeight: height
    })
}
