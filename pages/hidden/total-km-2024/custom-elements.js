import { colours } from "../../../node_modules/visual-components/index.js"

const palette = colours.paletteLightBg
const yFormat = d => `${Math.trunc(d)} Km`

const updatePointPosition = (chart, id, cx, cy) => {
    chart
        .select(`#${id}`)
        .attr('transform', `translate(${[cx, cy]})`)
}

const updatePointText = (chart, id, value) => {
    chart
        .select(`#${id}`)
        .select('text')
        .text(yFormat(value))
}

const addUpdateBreakpoint = (data, chart, x, y, breakpoints, point) => {
    const maxValue = d3.max(data, d => d.value)

    if ((point === undefined) || (maxValue >= point)) {
        let id, cx, cy

        if (point !== undefined) {
            id = `breakpoint-${point}`
            cx = x(breakpoints[point].date)
            cy = y(breakpoints[point].value)
        } else {
            id = `breakpoint-current`
            cx = x(d3.max(data, d => d.date))
            cy = y(maxValue)
        }

        if (chart.select(`#${id}`).empty()) {
            chart
                .append('g')
                .attr('id', id)
                .attr('transform', `translate(${[cx, cy]})`)
                .call(g =>
                    g
                        .append('circle')
                        .attr('r', 3)
                        .attr('fill', 'white')
                        .attr('stroke', palette.blue)
                        .attr('stroke-width', 2)
                )
                .call(g =>
                    g
                        .append('text')
                        .attr('x', -8)
                        .attr('dominant-baseline', 'middle')
                        .attr('text-anchor', 'end')
                        .attr('fill', palette.blue)
                        .attr('font-size', '0.75rem')
                        .text(point !== undefined ? yFormat(point) : null)
                )
        } else {
            updatePointPosition(chart, id, cx, cy)

            if (point === undefined) {
                updatePointText(chart, id, maxValue)
            }
        }
    }
}

const addUpdateCustomDateLine = (chart, x, y, breakpoints, height) => {
    const lineTime = breakpoints[1000]

    if (lineTime === undefined) return

    const lineId = 'custom-line'
    const lineTextId = 'custom-line-text'

    if (chart.select(`#${lineId}`).empty()) {
        chart
            .append('line')
            .attr('id', lineId)
            .attr('stroke', palette.axis)
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '4')
    } else {
        chart
            .select(`#${lineId}`)
            .attr('x1', x(lineTime.date))
            .attr('x2', x(lineTime.date))
            .attr('y1', y(0))
            .attr('y2', y(lineTime.value))
    }

    if (chart.select(`#${lineTextId}`).empty()) {
        chart
            .append('text')
            .attr('id', lineTextId)
            .attr('text-anchor', 'middle')
            .attr('fill', palette.axis)
            .attr('font-size', '0.75rem')
            .text(lineTime.date.toLocaleDateString('en-AU'))
    } else {
        const xPosition = x(lineTime.date) + 8
        const yPosition = y(lineTime.value) + ((height - y(lineTime.value)) / 2)

        chart
            .select(`#${lineTextId}`)
            .attr('transform', `translate(${[xPosition, yPosition]}) rotate(90)`)
    }
}

export const addCustomPoints = ({ data, chart, x, y, height }) => {
    const breakpoints = {
        '1000': data.filter(d => d.value >= 1000)[0],
        '2000': data.filter(d => d.value >= 2000)[0],
        '3000': data.filter(d => d.value >= 3000)[0]
    }

    Object.keys(breakpoints).forEach(point => {
        addUpdateBreakpoint(data, chart, x, y, breakpoints, point)
    })

    addUpdateBreakpoint(data, chart, x, y)

    addUpdateCustomDateLine(chart, x, y, breakpoints, height)
}