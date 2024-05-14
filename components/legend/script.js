import { getTextWidth } from "../utils.js"

export const addLegend = ({
    id,
    legends,
    colours = 'black',
    shapes = undefined,
    xPadding = 0,
    xPos = 1,
    yPos = 15
}) => {
    const legend = d3
        .select(`#${id}`)
        .attr('height', 20)
        .style('width', '100%')
        .append('g')
        .attr('transform', `translate(${[xPos, yPos]})`)

    let xSpace = 0
    legends.forEach((legendText, idx) => {
        if (idx > 0) {
            legend
                .append('text')
                .attr('x', xSpace + xPadding)
                .attr('y', 0)
                .attr('fill', '#a3a3a3')
                .text('|')

            if (shapes !== undefined) {
                xSpace += 15 + xPadding
            } else {
                xSpace += 10 + xPadding
            }
        }

        const colour = Array.isArray(colours) === true ? colours[idx] : colours

        if (shapes !== undefined) {
            if (xSpace == 0) xSpace += 5

            legend
                .append('path')
                .attr('d', shapes[idx])
                .attr('transform', `translate(${xSpace}, -4)`)
                .attr('fill', colour)

            xSpace += 10 + xPadding
        }

        legend
            .append('text')
            .attr('x', xSpace)
            .attr('y', 0)
            .attr('font-weight', 700)
            .attr('font-size', 14)
            .attr('fill', colour)
            .text(legendText)

        xSpace += getTextWidth(legendText, '0.875rem') + 10
    })
}

export const addLegendV2 = ({
    chart,
    legends,
    colours = 'black',
    shapes = undefined,
    xPos = 0,
    yPos = 0
}) => {
    const legendId = chart.attr('id') + '-legend'
    chart
        .append('g')
        .attr('id', legendId)
        .attr('transform', `translate(${[xPos, yPos]})`)

    addLegend({
        id: legendId,
        legends: legends,
        colours: colours,
        shapes: shapes
    })
}

export const addVerticalLegend = ({
    chart,
    legends,
    colours = 'black',
    shapes = undefined,
    xPosition = 0,
    yPosition = 0
}) => {
    const legendId = chart.attr('id') + '-legend'
    const legend = chart
        .append('g')
        .attr('id', legendId)
        .attr('transform', `translate(${[xPosition, yPosition]})`)

    let ySpace = 0
    legends.forEach((legendText, idx) => {
        const colour = Array.isArray(colours) === true ? colours[idx] : colours

        if (shapes !== undefined) {
            legend
                .append('path')
                .attr('d', shapes[idx])
                .attr('transform', `translate(0, ${ySpace - 4})`)
                .attr('fill', colour)
        }

        legend
            .append('text')
            .attr('x', shapes !== undefined ? 7 : 0)
            .attr('y', ySpace)
            .attr('font-weight', 700)
            .attr('font-size', '0.875rem')
            .attr('fill', colour)
            .text(legendText)

        ySpace += 26
    })
}