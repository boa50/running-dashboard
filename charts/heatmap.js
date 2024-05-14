import { colours } from '../constant.js'
import { getTextWidth } from '../components/utils.js'
import { addLegend } from '../components/colour-legend/script.js'
import { addHighlightTooltip as addTooltip } from '../components/tooltip/script.js'

export const addChart = (chartProps, data) => {
    const { chart, width, height, margin } = chartProps

    const dataGrouped = d3
        .flatGroup(data, d => d.date.toISOString().split('T')[0])
        .map(d => {
            return {
                yearMonth: d[1][0].yearMonth,
                date: d[1][0].date,
                day: d[1][0].day,
                distance: d[1].reduce((total, current) => total + current.distance, 0)
            }
        })

    const x = d3
        .scaleBand()
        .domain([...new Set(data.map(d => d.day))].sort((a, b) => a - b))
        .range([0, width])
        .padding(0.05)

    const yearsMonths = [...new Set(data.map(d => d.yearMonth))]

    const y = d3
        .scaleBand()
        .domain([...yearsMonths].reverse())
        .range([height, 0])
        .padding(0.05)

    const years = d3
        .flatGroup(yearsMonths.map(d => {
            return {
                year: d.substring(0, 4),
                month: d.substring(7)
            }
        }), d => d.year)
        .map(d => {
            return {
                year: d[0],
                qtdMonths: d[1].length
            }
        })

    const colour = d3
        .scaleLinear()
        .range(['white', colours.default])
        .domain([0, Math.trunc(d3.max(dataGrouped, d => d.distance) / 1e3) * 1e3])

    chart
        .selectAll('.data-point')
        .data(dataGrouped)
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
        .data(dataGrouped)
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

    const colourLegendWidth = 128

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
        xPos: width - colourLegendWidth - 16,
        yPos: -margin.top,
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
            const yearMonthHeight = height / yearsMonths.length
            const getGap = i => i == 0 ?
                0 :
                yearMonthHeight * years.slice(0, i).reduce((total, d) => total + d.qtdMonths, 0)

            g
                .selectAll('y-axis-macro-groups')
                .data(years)
                .join('text')
                .attr('x', -86)
                .attr('y', (d, i) => getGap(i) + (yearMonthHeight * d.qtdMonths / 2))
                .attr('dominant-baseline', 'middle')
                .text(d => d.year)

            g
                .selectAll('y-axis-macro-groups-line')
                .data(years)
                .join('line')
                .attr('x1', -10)
                .attr('x2', -120)
                .attr('y1', (d, i) => getGap(i))
                .attr('y2', (d, i) => getGap(i))
                .attr('stroke-width', 1)
                .attr('stroke', (d, i) => i > 0 ? colours.axis : 'transparent')
                .attr('opacity', 0.5)
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
        <strong>${d.date.toLocaleString('en-AU', {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })}</strong>
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