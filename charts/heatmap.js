import { colours } from '../constant.js'
import { getTextWidth } from '../components/utils.js'

export const addChart = (chartProps, data) => {
    const { chart, width, height } = chartProps

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
                .selectAll('whatever')
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
}