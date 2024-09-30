export const createLineChart = (chart, x, y, customAttrs) => {
    let line = chart
        .selectAll('.data-point')

    return data => line = line
        .data(d3.group(data, d => d.group))
        .join('path')
        .attr('class', 'data-point')
        .attr('fill', 'none')
        .call(line => customAttrs(line))
        .call(
            line => line
                .attr('d', d => d3
                    .line()
                    .x(d => x(d.date))
                    .y(d => y(d.value))
                    (d[1])
                )
        )
}

export const updateLineChart = (updateLines, currentData, updateAxis, x, y) => {
    updateLines(currentData)

    if (updateAxis !== undefined) {
        x.domain(d3.extent(currentData, d => d.date))
        y.domain([0, d3.max(currentData, d => d.value)].map(d => d * 1.05))
        updateAxis(currentData)
    }
}