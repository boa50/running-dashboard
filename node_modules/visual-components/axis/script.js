import { getTextWidth, getTransformTranslate, convertSizeToIntPx } from "../utils.js"

export const adjustColours = (g, colour, hideDomain = false) => {
    if (hideDomain) g.select('.domain').attr('stroke', 'transparent')
    else g.select('.domain').attr('stroke', colour)

    g.selectAll('text').attr('fill', colour)
}

export const addAxis = ({
    chart, height, width, colour = 'black', fontSize = '0.8rem',
    x, xLabel = '', xFormat, xTickValues, xNumTicks, xNumTicksForceInitial = false, hideXdomain = false, xTickPadding = 10, xTicksRotate = false,
    y, yLabel = '', yFormat, yTickValues, yNumTicks, yNumTicksForceInitial = false, hideYdomain = false, yTickPadding = 10,
    yRight, yRightLabel = '', yRightFormat, yRightTickValues, yRightNumTicks, yRightNumTicksForceInitial = false, yRightTickPadding = 10
}) => {
    if (x !== undefined) {
        if ((xTickValues === undefined) && (xNumTicks !== undefined))
            xTickValues = getBeautifulTicks(xNumTicks, x, xNumTicksForceInitial)

        addSingleAxis({
            chart,
            width,
            height,
            colour,
            group: 'x',
            scale: x,
            position: 'bottom',
            format: xFormat,
            label: xLabel,
            hideDomain: hideXdomain,
            fontSize,
            tickValues: xTickValues,
            tickPadding: xTickPadding
        })

        if (xTicksRotate) rotateXticks(chart)
    }

    if (y !== undefined) {
        if ((yTickValues === undefined) && (yNumTicks !== undefined))
            yTickValues = getBeautifulTicks(yNumTicks, y, yNumTicksForceInitial)

        addSingleAxis({
            chart,
            width,
            height,
            colour,
            group: 'y',
            scale: y,
            position: 'left',
            format: yFormat,
            label: yLabel,
            hideDomain: hideYdomain,
            fontSize,
            tickValues: yTickValues,
            tickPadding: yTickPadding
        })
    }

    if (yRight !== undefined) {
        if ((yRightTickValues === undefined) && (yRightNumTicks !== undefined))
            yRightTickValues = getBeautifulTicks(yRightNumTicks, yRight, yRightNumTicksForceInitial)

        addSingleAxis({
            chart,
            width,
            height,
            colour,
            group: 'yRight',
            scale: yRight,
            position: 'right',
            format: yRightFormat,
            label: yRightLabel,
            hideDomain: hideYdomain,
            fontSize,
            tickValues: yRightTickValues,
            tickPadding: yRightTickPadding
        })
    }
}

export const updateXaxis = ({
    chart,
    x,
    format = undefined,
    tickValues = undefined,
    hideDomain = false,
    transitionFix = true,
    label = undefined,
    rotate = false
}) => {
    const axisClass = '.x-axis-group'
    const transitionDuration = 250
    const axis = chart.select(axisClass)
    const colour = axis.selectAll('text').attr('fill')

    axis
        .transition('x-axis-change')
        .duration(transitionFix ? transitionDuration : 0)
        .call(
            d3
                .axisBottom(x)
                .tickSize(0)
                .tickPadding(10)
                .tickFormat(format)
                .tickValues(tickValues)
        )
        .call(g => adjustColours(g, colour, hideDomain))
        .call(g => {
            if (transitionFix) {
                g
                    .on('start', () => {
                        axis
                            .selectAll('.tick')
                            .transition('x-axis-hide')
                            .duration(transitionDuration * 0.1)
                            .style('opacity', 0)
                    })
                    .end()
                    .then(() => { hideOverlappingTicks(axis, transitionDuration * 0.9) })
            }
        })
        .call(g => {
            if (label !== undefined)
                g
                    .select('.axis-label')
                    .transition('x-axis-label-change')
                    .duration(transitionDuration * 0.1)
                    .style('opacity', 0)
                    .transition('x-axis-label-change')
                    .duration(transitionDuration * 0.9)
                    .text(label)
                    .style('opacity', 1)
        })

    if (rotate) rotateXticks(chart)
}

export const updateYaxis = ({
    chart,
    y,
    format = undefined,
    tickValues = undefined,
    hideDomain = false,
    transitionFix = true,
    label = undefined
}) => {
    const axisClass = '.y-axis-group'
    const transitionDuration = 250
    const axis = chart.select(axisClass)
    const colour = axis.selectAll('text').attr('fill')

    chart
        .select('.y-axis-group')
        .transition('y-axis-change')
        .duration(transitionFix ? transitionDuration : 0)
        .call(
            d3
                .axisLeft(y)
                .tickSize(0)
                .tickPadding(10)
                .tickFormat(format)
                .tickValues(tickValues)
        )
        .call(g => adjustColours(g, colour, hideDomain))
        .call(g => {
            if (label !== undefined)
                g
                    .select('.axis-label')
                    .transition('y-axis-label-change')
                    .duration(transitionDuration * 0.1)
                    .style('opacity', 0)
                    .transition('y-axis-label-change')
                    .duration(transitionDuration * 0.9)
                    .text(label)
                    .style('opacity', 1)
        })
}

function addSingleAxis({
    chart,
    width,
    height,
    colour,
    group,
    scale,
    position,
    format,
    label,
    hideDomain,
    fontSize = '0.8rem',
    tickValues,
    tickPadding = 10
}) {
    let d3Axis, labelXposition, labelYposition, labelRotation, groupTransform
    switch (position) {
        case 'bottom':
            d3Axis = d3.axisBottom(scale)
            labelXposition = width / 2
            labelYposition = () => 7 + (convertSizeToIntPx(fontSize) * 2) + 8
            labelRotation = 0
            groupTransform = `translate(0, ${height})`
            break;
        case 'left':
            d3Axis = d3.axisLeft(scale)
            labelXposition = -(height / 2)
            labelYposition = g => -(getTicksMaxWidth(g, format, fontSize) + 30)
            labelRotation = 270
            groupTransform = `translate(0, 0)`
            break;
        case 'right':
            d3Axis = d3.axisRight(scale)
            labelXposition = height / 2
            labelYposition = g => -(getTicksMaxWidth(g, format, fontSize) + 30)
            labelRotation = 90
            groupTransform = `translate(${width}, 0)`
            break;
    }

    chart
        .append('g')
        .attr('class', `${group}-axis-group`)
        .style('font-size', fontSize)
        .attr('transform', groupTransform)
        .call(
            d3Axis
                .tickSize(0)
                .tickPadding(tickPadding)
                .tickFormat(format)
                .tickValues(tickValues)
        )
        .call(g => {
            g
                .append('text')
                .attr('class', 'axis-label')
                .attr('x', labelXposition)
                .attr('y', labelYposition(g))
                .attr('transform', `rotate(${labelRotation})`)
                .attr('text-anchor', 'middle')
                .style('font-size', fontSize)
                .text(label)
        })
        .call(g => adjustColours(g, colour, hideDomain))
}

function getTicksMaxWidth(g, format, tickFontSize) {
    let maxTickWidth = 0
    g
        .selectAll('.tick>text')
        .each(d => {
            const widthValue = getTextWidth(format !== undefined ? format(d) : d, tickFontSize)
            if (widthValue > maxTickWidth)
                maxTickWidth = widthValue
        })

    return maxTickWidth
}

function getBeautifulTicks(nticks, scale, forceInitial) {
    let extremities = scale.domain()
    const numberLength = Math.trunc(extremities[1]).toString().length
    const extremityIncrement = numberLength > 4 ? Math.pow(10, numberLength - 2) : 1
    const incrementMultiple = numberLength < 4 ? 5 : 1

    const maxTruncated = Math.trunc(extremities[1] / extremityIncrement)
    const maxRounded = maxTruncated - (maxTruncated % 5)
    extremities[1] = maxRounded * extremityIncrement

    const minTruncated = Math.trunc(extremities[0] / extremityIncrement)
    const minRounded = minTruncated + (minTruncated % 5)
    extremities[0] = minRounded * extremityIncrement


    const getIncrement = () => (extremities[1] - extremities[0]) / (nticks - 1)

    let increment = getIncrement()

    for (let i = 0; i <= 10; i++) {
        if (Number.isInteger(increment / incrementMultiple)) {
            return [...Array(nticks).keys()].map(d => extremities[0] + increment * d)
        }

        if (forceInitial) {
            extremities[1] -= extremityIncrement
        } else {
            const extremityChange = i % 2
            if (extremityChange === 0) {
                extremities[extremityChange] += extremityIncrement
            } else {
                extremities[extremityChange] -= extremityIncrement
            }
        }

        increment = getIncrement()
    }

    return null
}

function hideOverlappingTicks(axis, transitionDuration) {
    const showTick = tick => {
        tick
            .transition('axis-show')
            .duration(transitionDuration)
            .style('opacity', 1)
    }

    axis.selectAll('.tick').each(function () {
        const previousTick = d3.select(this.previousElementSibling)
        if (previousTick.attr('class') === 'tick') {
            const previousTickTxtLength = getTextWidth(previousTick.select('text').text(), '0.9rem')
            const previousTickX = getTransformTranslate(previousTick.attr('transform'))[0]
            const tick = d3.select(this)
            const tickTxtLength = getTextWidth(tick.select('text').text(), '0.9rem')
            const tickX = getTransformTranslate(tick.attr('transform'))[0]

            const hideCondition = (previousTickX + (previousTickTxtLength / 2)) + 4 >= (tickX - (tickTxtLength / 2))

            if (hideCondition) tick.remove()
            else showTick(tick)
        } else {
            showTick(d3.select(this))
        }
    })
}

function rotateXticks(chart, angle = 45) {
    chart
        .selectAll('.x-axis-group .tick text')
        .attr('transform', `rotate(${angle})`)
        .attr('text-anchor', 'start')
        .attr('dx', '0.1rem')
        .attr('dy', '0.1rem')
}