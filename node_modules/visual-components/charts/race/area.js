export const createAreaChart = ({
    chart,
    x,
    y,
    customAttrs = area => { area.attr('fill', 'black') },
    isAddLine = false
}) => {
    const areaGenerator = d3
        .area()
        .x(d => x(d.data[0]))
        .y0(d => y(d[0]))
        .y1(d => y(d[1]))

    const lineGenerator = d3
        .line()
        .x(d => x(d.data[0]))
        .y(d => y(d[1]))

    return stackedData => chart
        .call(area =>
            area
                .selectAll('.data-point')
                .data(stackedData)
                .join('path')
                .attr('class', 'data-point')
                .call(area => customAttrs(area))
                .call(
                    area => area.attr('d', areaGenerator)
                )
        )
        .call(area => {
            if (isAddLine) {
                let firstIdx = stackedData[0].findIndex(d => d[1] > 0)
                firstIdx = firstIdx > 0 ? firstIdx - 1 : firstIdx

                if (firstIdx >= 0) {
                    return area
                        .selectAll('.data-line')
                        .data([stackedData[0].slice(firstIdx)])
                        .join('path')
                        .attr('class', 'data-line')
                        .attr('fill', 'none')
                        .attr('stroke', area.select('.data-point').attr('fill'))
                        .attr('stroke-width', 1.5)
                        .attr('d', lineGenerator)
                }
            }
        })
}

export const updateAreaChart = ({ updateArea, stackedData, updateAxis, x, y }) => {
    updateArea(stackedData)

    const dates = new Set()
    stackedData.forEach(d => d.forEach(v => dates.add(v.data[0])))
    const maxValue = d3.max(d3.union(...stackedData.map(d => d.map(v => d3.max(v, v2 => Math.abs(v2))))), d => d)

    if (updateAxis !== undefined) {
        x.domain(d3.extent([...dates], d => d))
        y.domain([-maxValue, maxValue].map(d => d * 1.05))
        updateAxis(stackedData)
    }
}