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

const addUpdateBreakpoint = (data, chart, x, y, breakpoints, key) => {
    const maxValue = d3.max(data, d => d.value)
    
    if ((key === undefined) || (breakpoints[key].filteredData === undefined) || (maxValue >= breakpoints[key].filteredData.value)) {
        let id, cx, cy

        if (key !== undefined  && breakpoints[key].filteredData !== undefined) {
            id = `breakpoint-${key}`
            cx = x(breakpoints[key].filteredData.date)
            cy = y(breakpoints[key].filteredData.value)
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
                    id !== 'breakpoint-current' ? 
                    g
                        .append('circle')
                        .attr('r', 3)
                        .attr('fill', 'white')
                        .attr('stroke', palette.vermillion)
                        .attr('stroke-width', 1.5)
                        :null
                )
                .call(g =>
                    g
                        .append('text')
                        .attr('x', -8)
                        .attr('dominant-baseline', 'middle')
                        .attr('text-anchor', 'end')
                        .attr('fill', id !== 'breakpoint-current' ? palette.vermillion : palette.blue)
                        .attr('font-size', '0.75rem')
                        .text(key !== undefined ? breakpoints[key].label : null)
                )
        } else {
            updatePointPosition(chart, id, cx, cy)

            if (key === undefined) {
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

const addUpdateKmLineBreakpoint = (data, chart, x, y, breakpoints, key) => {
    const maxValue = d3.max(data, d => d.value)
    
    if ((key === undefined) || (breakpoints[key].filteredData === undefined) || (maxValue >= breakpoints[key].filteredData.value)) {
        let lineId, lineTextId, xPosition, yPosition

        if (key !== undefined  && breakpoints[key].filteredData !== undefined) {
            lineId = 'custom-line' + key
            lineTextId = 'custom-line-text' + key
            xPosition = x(breakpoints[key].filteredData.date)
            yPosition = y(breakpoints[key].filteredData.value)

            if (chart.select(`#${lineId}`).empty()) {
                chart
                    .append('line')
                    .attr('id', lineId)
                    .attr('stroke', d3.hsl(palette.axis).brighter(2.5))
                    .attr('stroke-width', 0.5)
            } else {
                chart
                    .select(`#${lineId}`)
                    .attr('x1', 0)
                    .attr('x2', xPosition)
                    .attr('y1', yPosition)
                    .attr('y2', yPosition)
            }

            if (chart.select(`#${lineTextId}`).empty()) {
                chart
                    .append('text')
                    .attr('id', lineTextId)
                    .attr('text-anchor', 'start')
                    .attr('fill', d3.hsl(palette.axis).brighter(2.5))
                    .attr('font-size', '0.75rem')
                    .text(breakpoints[key].label)
            } else {
                const xTextPosition = 0
                const yTextPosition = yPosition - 2
        
                chart
                    .select(`#${lineTextId}`)
                    .attr('transform', `translate(${[xTextPosition, yTextPosition]})`)
            }
        }
    }
}

export const addCustomPoints = ({ data, chart, x, y, height }) => {
    const eventBreakpoints = {
        'tokyo': {label: 'Tokyo Marathon', filteredData: data.filter(d => d.date >= new Date(2024, 2, 3))[0]},
        'bogota': {label: 'Bogota Half Marathon', filteredData: data.filter(d => d.date >= new Date(2024, 6, 28))[0]},
        'montreal': {label: 'Montreal Marathon', filteredData: data.filter(d => d.date >= new Date(2024, 8, 22))[0]},
    }

    Object.keys(eventBreakpoints).forEach(key => {
        addUpdateBreakpoint(data, chart, x, y, eventBreakpoints, key)
    })

    addUpdateBreakpoint(data, chart, x, y)

    // addUpdateCustomDateLine(chart, x, y, breakpoints, height)

    const kmBreakpoints = {
        '1000': {label: '1000 Km', filteredData: data.filter(d => d.value >= 1000)[0]},
        '2000': {label: '2000 Km', filteredData: data.filter(d => d.value >= 2000)[0]},
        '3000': {label: '3000 Km', filteredData: data.filter(d => d.value >= 3000)[0]},
    }

    Object.keys(kmBreakpoints).forEach(key => {
        addUpdateKmLineBreakpoint(data, chart, x, y, kmBreakpoints, key)
    })
}