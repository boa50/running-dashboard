import { colours } from '../constant.js'
import { getTextWidth } from '../components/utils.js'
import { addLegend } from '../components/colour-legend/script.js'
import { addHighlightTooltip as addTooltip } from '../components/tooltip/script.js'

export const addChart = (chartProps, data) => {
    const { chart, width, height, margin } = chartProps

    const x = d3
        .scaleBand()
        .domain([...new Set(data.map(d => d.day))].sort((a, b) => a - b))
        .range([0, width])
        .padding(0.05)

    const y = d3
        .scaleBand()
        .domain([...new Set(data.map(d => d.yearMonth))].reverse())
        .range([height, 0])
        .padding(0.05)

    const years = [...new Set(data.map(d => d.yearMonth.substring(0, 4)))].reverse()

    const colour = d3
        .scaleLinear()
        .range(['white', colours.default])
        .domain([0, Math.trunc(d3.max(data, d => d.distance) / 1e3) * 1e3])

    chart
        .selectAll('.data-point')
        .data(data)
        .join('rect')
        .attr('class', 'data-point')
        .attr('x', d => x(d.day))
        .attr('y', d => y(d.yearMonth))
        .attr('width', x.bandwidth())
        .attr('height', y.bandwidth())
        .attr('rx', 4)
        .attr('ry', 4)
        .style('fill', d => colour(d.distance))

    chart
        .selectAll('.tooltip-point')
        .data(data)
        .join('rect')
        .attr('class', 'tooltip-point')
        .attr('x', d => x(d.day))
        .attr('y', d => y(d.yearMonth))
        .attr('width', x.bandwidth())
        .attr('height', y.bandwidth())
        .attr('rx', 4)
        .attr('ry', 4)
        .attr('stroke-width', 4)
        .attr('stroke', colours.heatmapTooltip)
        .attr('opacity', 0)
        .style('fill', 'transparent')

    chart
        .append('g')
        .attr('id', 'colour-legend')

    const colourLegendWidth = 100

    const colourLegendAxis = d3
        .scaleLinear()
        .domain(colour.domain())
        .range([0, colourLegendWidth])

    const formatKilometers = d => `${d3.format('.2s')(d).replace('.0', '').replace('k', 'km')}`

    addLegend({
        id: 'colour-legend',
        title: 'Distance',
        colourScale: colour,
        axis: colourLegendAxis,
        width: colourLegendWidth,
        xPos: -margin.left + 4,
        yPos: -margin.top + 8,
        textColour: colours.axis,
        axisTickFormat: formatKilometers
    })

    // Adding axes
    chart
        .append('g')
        .attr('class', 'x-axis-group')
        .style('font-size', '0.8rem')
        .call(
            d3
                .axisTop(x)
                .tickSize(0)
                .tickPadding(10)
        )
        .call(g => g
            .append('text')
            .attr('x', width / 2)
            .attr('y', -40)
            .attr('text-anchor', 'middle')
            .text('Day'))
        .call(g => {
            g.select('.domain').attr('stroke', 'transparent')
            g.selectAll('text').attr('fill', colours.axis)
        })

    chart
        .append('g')
        .attr('class', 'y-axis-group')
        .style('font-size', '0.8rem')
        .call(
            d3
                .axisLeft(y)
                .tickSize(0)
                .tickPadding(10)
                .tickFormat(d => d.substring(7))
        )
        .call(g => {
            g
                .selectAll('y-axis-macro-groups')
                .data(years)
                .join('text')
                .attr('x', -72)
                .attr('y', (d, i) => i * (height / years.length) + (height / years.length) / 2)
                .attr('dominant-baseline', 'middle')
                .text(d => d)
        })
        .call(g => {
            let maxTickWidth = 0
            g
                .selectAll('.tick>text')
                .each(d => {
                    const widthValue = getTextWidth(d, '0.8rem')
                    if (widthValue > maxTickWidth)
                        maxTickWidth = widthValue
                })
            maxTickWidth += 30

            g
                .append('text')
                .attr('x', -(height / 2))
                .attr('y', -maxTickWidth)
                .attr('transform', 'rotate(270)')
                .attr('text-anchor', 'middle')
                .text('Year - Month')
        })
        .call(g => {
            g.select('.domain').attr('stroke', 'transparent')
            g.selectAll('text').attr('fill', colours.axis)
        })

    addTooltip(
        `${chart.attr('id').split('-')[0]}-container`,
        d => `
        <strong>${d.yearMonth}</strong>
        <div style="display: flex; justify-content: space-between">
            <span>Distance:&emsp;</span>
            <span>${formatKilometers(d.distance)}</span>
        </div>
        `,
        chart.selectAll('.tooltip-point'),
        { initial: 0, highlighted: 1, faded: 0 },
        { width, height }
    )
}