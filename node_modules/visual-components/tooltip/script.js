import { getTransformTranslate } from "../utils.js"

export const addTooltip = (id, htmlText, options = { chartWidth: 500, chartHeight: 500 }) => {
    const tooltip = d3.select(`#${id}`)
        .append('div')
        .style('opacity', 0)
        .attr('class', 'tooltip')
        .style('background-color', 'black')
        .style('border-radius', '5px')
        .style('padding', '10px')
        .style('color', 'white')
        .style('position', 'fixed')


    const getPosition = (event, axis) => {
        const tooltipPadding = 15
        const pointerPosition = d3.pointer(event)[axis === 'y' ? 1 : 0]
        const transformPosition = d3.select(event.target).attr('transform') !== null ?
            getTransformTranslate(d3.select(event.target).attr('transform'))[axis === 'y' ? 1 : 0] :
            0
        const eventPosition = Math.max(pointerPosition, transformPosition)

        if (eventPosition >= (options[axis === 'y' ? 'chartHeight' : 'chartWidth'] / 2)) {
            return event[axis] - tooltip.node().getBoundingClientRect()[axis === 'y' ? 'height' : 'width'] - tooltipPadding
        } else {
            return event[axis] + tooltipPadding
        }
    }

    const xPosition = event => `${getPosition(event, 'x')}px`
    const yPosition = event => `${getPosition(event, 'y')}px`

    const mouseover = (event, d) => {
        tooltip
            .interrupt('mouseleave')
            .transition('mouseover')
            .duration(200)
        tooltip
            .html(htmlText(d))
            .style('left', xPosition(event))
            .style('top', yPosition(event))
            .style('opacity', 1)
    }
    const mousemove = (event, d) => {
        tooltip
            .style('left', xPosition(event))
            .style('top', yPosition(event))

        if (d !== undefined) tooltip.html(htmlText(d))
    }
    const mouseleave = () => {
        tooltip
            .interrupt('mouseover')
            .style('left', '-1000px')
            .style('top', '-1000px')
            .transition('mouseleave')
            .duration(200)
            .style('opacity', 0)
    }

    return { mouseover, mousemove, mouseleave }
}

export const addLineTooltip = ({
    id,
    htmlText,
    colour,
    chart,
    data,
    cx,
    cy,
    radius = 4,
    chartWidth = 500,
    chartHeight = 500
}) => {
    if ((id === undefined) && (chart !== undefined))
        id = `${chart.attr('id').split('-')[0]}-container`

    const { mouseover, mousemove, mouseleave } = addTooltip(
        id,
        htmlText,
        { chartWidth, chartHeight }
    )

    const customMouseOver = function (event, d) {
        d3.select(this).attr('fill', colour)
        mouseover(event, d)
    }
    const customMouseLeave = function (event, d) {
        d3.select(this).attr('fill', 'transparent')
        mouseleave(event, d)
    }

    if (chart !== undefined) {
        chart
            .append('g')
            .attr('class', 'line-tooltip')
            .selectAll('.dot')
            .data(data)
            .join('circle')
            .attr('cx', cx)
            .attr('cy', cy)
            .attr('r', radius)
            .attr('stroke', 'transparent')
            .attr('stroke-width', 12)
            .attr('fill', 'transparent')
            .on('mouseover', customMouseOver)
            .on('mousemove', mousemove)
            .on('mouseleave', customMouseLeave)
    }

    return { mouseover: customMouseOver, mousemove, mouseleave: customMouseLeave }
}

export const removeLineTooltip = chart => {
    chart.select('.line-tooltip').remove()
}

export const addHighlightTooltip = ({
    id,
    chart,
    htmlText,
    elements,
    initialOpacity = 0.75,
    highlightedOpacity = 1,
    fadedOpacity = 0.25,
    chartWidth = 500,
    chartHeight = 500,
    fadeHighlightElements = undefined,
    highlightFunction = ({ chart, element, highlightedOpacity }) => element.style('opacity', highlightedOpacity)
}) => {
    if ((id === undefined) && (chart !== undefined))
        id = `${chart.attr('id').split('-')[0]}-container`

    if (fadeHighlightElements === undefined)
        fadeHighlightElements = elements

    const { mouseover, mousemove, mouseleave } = addTooltip(
        id,
        htmlText,
        { chartWidth, chartHeight }
    )

    const customMouseOver = function (event, d) {
        fadeHighlightElements.style('opacity', fadedOpacity)
        highlightFunction({ chart, element: d3.select(this), highlightedOpacity })
        mouseover(event, d)
    }
    const customMouseLeave = function (event, d) {
        fadeHighlightElements.style('opacity', initialOpacity)
        mouseleave(event, d)
    }

    elements
        .on('mouseover', customMouseOver)
        .on('mousemove', mousemove)
        .on('mouseleave', customMouseLeave)
}

export const addVerticalTooltip = ({
    id,
    htmlText,
    chart,
    chartWidth,
    chartHeight,
    x,
    y,
    colour,
    data,
    xVariable,
    tooltipData = {},
    keyFunction = d => d
}) => {
    if ((id === undefined) && (chart !== undefined))
        id = `${chart.attr('id').split('-')[0]}-container`

    const getTooltipDataPoint = event => {
        const x_val = x.invert(d3.pointer(event)[0])
        const idx = d3.bisector(d => d[xVariable]).center(data, x_val)
        const key = keyFunction(data[idx][xVariable])

        return [tooltipData[key], key]
    }

    const tooltips = chart
        .append('g')
        .attr('class', 'vertical-tooltip')

    const { mouseover, mousemove, mouseleave } = addTooltip(
        id,
        htmlText,
        { chartWidth, chartHeight }
    )

    const clearTooltips = () => {
        tooltips.selectAll('line').attr('stroke', 'transparent')
        tooltips.selectAll('circle').attr('fill', 'transparent').attr('stroke', 'transparent')
    }
    const fillTooltips = key => {
        tooltips.selectAll(`.tooltip-line-${key}`).attr('stroke', colour)
        tooltips.selectAll(`.tooltip-circle-${key}`).attr('fill', colour).attr('stroke', 'white')
    }

    const customMouseOver = function (event) {
        mouseover(event, "")
    }
    const customMouseMove = function (event) {
        const [tooltipData, key] = getTooltipDataPoint(event)
        clearTooltips()
        fillTooltips(key)
        mousemove(event, tooltipData)
    }
    const customMouseLeave = function (event, d) {
        clearTooltips()
        mouseleave(event, d)
    }

    for (let tooltip of Object.entries(tooltipData)) {
        tooltips
            .append('line')
            .attr('class', `tooltip-line-${tooltip[0]}`)
            .attr('x1', x(tooltip[1].x))
            .attr('x2', x(tooltip[1].x))
            .attr('y1', 0)
            .attr('y2', chartHeight)
            .attr('stroke', 'transparent')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', [7, 5])

        for (let yPosition of tooltip[1]['ys']) {
            tooltips
                .append('circle')
                .attr('class', `tooltip-circle-${tooltip[0]}`)
                .attr('cx', x(tooltip[1].x))
                .attr('cy', y(yPosition))
                .attr('r', 3)
                .attr('fill', 'transparent')
        }
    }

    tooltips
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('height', chartHeight)
        .attr('width', chartWidth)
        .attr('fill', 'transparent')
        .on('mouseover', customMouseOver)
        .on('mousemove', customMouseMove)
        .on('mouseleave', customMouseLeave)
}

export const removeVerticalTooltip = chart => {
    chart.select('.vertical-tooltip').remove()
}