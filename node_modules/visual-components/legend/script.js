import { getTextWidth, convertSizeToIntPx } from "../utils.js"

export const addLegend = ({
    chart,
    legends,
    colours = 'black',
    shapes = undefined,
    patternIds = undefined,
    xPosition = 0,
    yPosition = -10,
    fontSize = '0.875rem',
    fontWeight = 700,
    customId = ''
}) => {
    const legend = getLegendContainer(chart, xPosition, yPosition, 'horizontal', customId)
    const defaultSpacing = getTextWidth('&nbsp;', fontSize, fontWeight) * 3

    let xSpace = 0
    legends.forEach((legendText, idx) => {
        if (idx > 0 && patternIds === undefined) {
            legend
                .append('text')
                .attr('x', xSpace)
                .attr('y', 0)
                .attr('fill', '#a3a3a3')
                .attr('font-weight', 300)
                .attr('font-size', `${fontSize.replace('rem', '') * 1.25}rem`)
                .text('|')

            if (shapes !== undefined) {
                xSpace += 15
            } else {
                xSpace += defaultSpacing
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

            xSpace += defaultSpacing
        }

        if (patternIds !== undefined) {
            if (idx > 0) xSpace += defaultSpacing

            const fontSizePx = convertSizeToIntPx(fontSize) * 1.25
            const width = fontSizePx

            const addSquare = fill => {
                legend
                    .append('rect')
                    .attr('x', xSpace)
                    .attr('y', -fontSizePx * 0.8)
                    .attr('width', width)
                    .attr('height', fontSizePx)
                    .attr('fill', fill)
            }

            addSquare(colour)
            addSquare(`url(#${patternIds[idx]})`)

            xSpace += defaultSpacing + width - 5
        }

        legend
            .append('text')
            .attr('x', xSpace)
            .attr('y', 0)
            .attr('font-weight', fontWeight)
            .attr('font-size', fontSize)
            .attr('fill', colour)
            .text(legendText)

        xSpace += getTextWidth(legendText, fontSize, fontWeight) + defaultSpacing / 2
    })
}

export const addVerticalLegend = ({
    chart,
    legends,
    colours = 'black',
    shapes = undefined,
    xPosition = 0,
    yPosition = 0,
    fontSize = '0.875rem',
    fontWeight = 700,
    customId = ''
}) => {
    const legend = getLegendContainer(chart, xPosition, yPosition, 'vertical', customId)

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
            .attr('font-weight', fontWeight)
            .attr('font-size', fontSize)
            .attr('fill', colour)
            .text(legendText)

        ySpace += 26
    })
}

export const addColourLegend = ({
    chart,
    title,
    colourScale,
    colourScaleType = 'default',
    colourOpacity = 1,
    xPosition = 0,
    yPosition = 0,
    width = 50,
    axis,
    textColour = 'black',
    axisTickFormat,
    customId = ''

}) => {
    const n = Math.min(colourScale.domain().length, colourScale.range().length)
    const legend = getLegendContainer(chart, xPosition, yPosition, 'colour', customId)

    legend
        .append('text')
        .attr('x', 0)
        .attr('y', 9)
        .attr('text-anchor', 'start')
        .attr('fill', textColour)
        .attr('font-size', 12)
        .text(title)

    const interpolateInitialValue = colourScaleType === 'threshold' ? 1 / n : 0

    legend
        .append('image')
        .attr('x', 0)
        .attr('y', 12)
        .attr('width', width)
        .attr('height', 13)
        .attr('preserveAspectRatio', 'none')
        .attr('xlink:href', ramp(colourScale.copy().domain(d3.quantize(d3.interpolate(interpolateInitialValue, 1), n)), colourOpacity).toDataURL())

    const tickValues = colourScaleType === 'threshold' ? colourScale.domain().slice(0, n - 1) : colourScale.domain()

    legend
        .append('g')
        .attr('transform', 'translate(0, 25)')
        .call(
            d3
                .axisBottom(axis)
                .tickValues(tickValues)
                .tickSize(0)
                .tickPadding(5)
                .tickFormat(axisTickFormat)
        )
        .call(g => g.select('.domain').remove())
        .call(g => g.selectAll('text').attr('fill', textColour))
}

// Based on: https://d3-graph-gallery.com/graph/bubble_legend.html
export const addCircleLegend = ({
    chart,
    sizeScale,
    valuesToShow,
    xPosition = 0,
    yPosition = 0,
    colour = 'black',
    title = '',
    textFormat = d => d,
    customId = '',
    valuesFontSize = '0.67rem',
    titleFontSize = '0.925rem'
}) => {
    const legend = getLegendContainer(chart, 0, 0, 'circle', customId)

    const scaleMargin = sizeScale(Math.max(...valuesToShow))
    const xLabel = xPosition + scaleMargin + 20

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
    legend
        .append('text')
        .attr('x', xPosition)
        .attr('y', yPosition - scaleMargin * 2 - 10)
        .attr('font-size', titleFontSize)
        .attr('text-anchor', 'middle')
        .attr('fill', colour)
        .text(title)

    // Circles
    legend
        .selectAll('legend')
        .data(valuesToShow)
        .join('circle')
        .attr('cx', xPosition)
        .attr('cy', d => yPosition - sizeScale(d))
        .attr('r', d => sizeScale(d))
        .style('fill', 'none')
        .attr('stroke', colour)

    // Segments
    legend
        .selectAll('legend')
        .data(valuesToShow)
        .join('line')
        .attr('x1', (d, i) => xPosition - (getYpadding(i) / 8) + sizeScale(d))
        .attr('x2', xLabel)
        .attr('y1', (d, i) => yPosition + getYpadding(i) - sizeScale(d))
        .attr('y2', (d, i) => yPosition + getYpadding(i) - sizeScale(d))
        .attr('stroke', colour)
        .style('stroke-dasharray', ('2,2'))

    // Labels
    legend
        .selectAll('legend')
        .data(valuesToShow)
        .join('text')
        .attr('x', xLabel)
        .attr('y', (d, i) => yPosition + getYpadding(i) - sizeScale(d))
        .text(d => textFormat(d))
        .attr('font-size', valuesFontSize)
        .attr('fill', colour)
}


function getLegendContainer(chart, xPosition, yPosition, type = '', customId = '') {
    const legendId = customId !== '' ?
        customId :
        chart.attr('id') + '-legend' + type
    return chart
        .append('g')
        .attr('id', legendId)
        .attr('transform', `translate(${[xPosition, yPosition]})`)
}

// Based on: https://observablehq.com/@d3/color-legend
function ramp(colour, colourOpacity = 1, n = 256) {
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