// Based on: https://observablehq.com/@d3/color-legend
const ramp = (colour, colourOpacity = 1, n = 256) => {
    const canvas = document.createElement('canvas')
    canvas.width = n
    canvas.height = 1
    const context = canvas.getContext('2d')

    for (let i = 0; i < n; ++i) {
        context.fillStyle = colour(i / (n - 1))
        context.fillRect(i, 0, 1, 1)
        context.globalAlpha = colourOpacity
    }

    return canvas
}

export const addLegend = (
    {
        id,
        title,
        colourScale,
        colourOpacity = 1,
        xPos = 1,
        yPos = 15,
        width = 50,
        axis,
        textColour = 'black',
        axisTickFormat
    }
) => {
    const n = Math.min(colourScale.domain().length, colourScale.range().length)

    const legend = d3
        .select(`#${id}`)
        .attr('height', 37)
        .style('width', '100%')
        .append('g')
        .attr('transform', `translate(${[xPos, yPos]})`)

    legend
        .append('text')
        .attr('x', 0)
        .attr('y', 9)
        .attr('text-anchor', 'start')
        .attr('fill', textColour)
        .attr('font-size', 12)
        .text(title)

    legend
        .append('image')
        .attr('x', 0)
        .attr('y', 12)
        .attr('width', width)
        .attr('height', 13)
        .attr('preserveAspectRatio', 'none')
        .attr('xlink:href', ramp(colourScale.copy().domain(d3.quantize(d3.interpolate(0, 1), n)), colourOpacity).toDataURL())

    legend
        .append('g')
        .attr('transform', 'translate(0, 25)')
        .call(
            d3
                .axisBottom(axis)
                .tickValues(colourScale.domain())
                .tickSize(0)
                .tickPadding(5)
                .tickFormat(axisTickFormat)
        )
        .call(g => g.select('.domain').remove())
        .call(g => g.selectAll('text').attr('fill', textColour))
}