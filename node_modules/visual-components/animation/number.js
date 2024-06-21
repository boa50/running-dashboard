function textTweenNumber(a, b, formatNumber) {
    const i = d3.interpolateNumber(a, b)
    return function (t) {
        this.textContent = formatNumber(i(t))
    }
}

export const createNumber = ({
    svg,
    x = 0,
    y = 0,
    textColour = 'black',
    fontSize = '7rem',
    alignVertical = 'auto'
}) => {
    return svg
        .append('g')
        .attr('transform', `translate(${[x, y]})`)
        .style('font-size', fontSize)
        .style('text-anchor', 'middle')
        .style('dominant-baseline', alignVertical)
        .style('fill', textColour)
        .call(g => g
            .append('text')
            .attr('class', 'el-number')
            .attr('alignment-baseline', 'central')
        )
}

export const setNumberPosition = (number, x, y) => {
    number.attr('transform', `translate(${[x, y]})`)
}

export const numberChangeValue = ({
    number,
    initial = 0,
    end,
    progress = 1,
    transitionDuration = 50,
    numberFormat = d3.format('.2f')
}) => {
    const numberElement = number.select('.el-number')
    const currentText = numberElement.text()
    const currentNumber = currentText.length > 0 ? parseFloat(currentText) : 0
    const nextNumber = initial + (end - initial) * progress

    numberElement
        .transition('numberChangeValue')
        .duration(transitionDuration)
        .tween('text', () => textTweenNumber(currentNumber, nextNumber, numberFormat))

    return nextNumber
}