// Based on: https://d3-graph-gallery.com/graph/bubble_legend.html
export const addLegend = ({
    id,
    sizeScale,
    valuesToShow,
    position = [0, 0],
    colour = 'black',
    title = '',
    textFormat = d => d
}) => {
    const svg = d3.select(`#${id}`)
        .append('g')


    const scaleMargin = sizeScale(Math.max(...valuesToShow))
    const xLabel = position[0] + scaleMargin + 20

    const getYpadding = i => {
        let min = 0
        let max = 1

        if (valuesToShow.length === 3) {
            max = 2
        }

        const margin = 2 * (scaleMargin / 10)
        switch (i) {
            case min:
                return margin
            case max:
                return -margin
            default:
                return 0
        }
    }

    // Title
    svg
        .append('text')
        .attr('x', position[0])
        .attr('y', position[1] - scaleMargin * 2 - 10)
        .attr('font-size', 15)
        .attr('text-anchor', 'middle')
        .attr('fill', colour)
        .text(title)

    // Circles
    svg
        .selectAll('legend')
        .data(valuesToShow)
        .join('circle')
        .attr('cx', position[0])
        .attr('cy', d => position[1] - sizeScale(d))
        .attr('r', d => sizeScale(d))
        .style('fill', 'none')
        .attr('stroke', colour)

    // Segments
    svg
        .selectAll('legend')
        .data(valuesToShow)
        .join('line')
        .attr('x1', (d, i) => position[0] - (getYpadding(i) / 8) + sizeScale(d))
        .attr('x2', xLabel)
        .attr('y1', (d, i) => position[1] + getYpadding(i) - sizeScale(d))
        .attr('y2', (d, i) => position[1] + getYpadding(i) - sizeScale(d))
        .attr('stroke', colour)
        .style('stroke-dasharray', ('2,2'))

    // Labels
    svg
        .selectAll('legend')
        .data(valuesToShow)
        .join('text')
        .attr('x', xLabel)
        .attr('y', (d, i) => position[1] + getYpadding(i) - sizeScale(d))
        .text(d => textFormat(d))
        .attr('font-size', 10.5)
        .attr('fill', colour)
}
