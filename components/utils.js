// Based on: https://www.geeksforgeeks.org/calculate-the-width-of-the-text-in-javascript/
export const getTextWidth = (txt, fontSize = '1rem') => {
    const text = document.createElement('span');
    document.body.appendChild(text);

    text.style.font = 'ui-sans-serif';
    text.style.fontSize = fontSize;
    text.style.height = 'auto';
    text.style.width = 'auto';
    text.style.position = 'absolute';
    text.style.whiteSpace = 'no-wrap';
    text.innerHTML = txt;

    const width = Math.ceil(text.clientWidth);
    document.body.removeChild(text);

    return width
}

export const getTransformTranslate = transform =>
    transform.substring(transform.indexOf('(') + 1, transform.indexOf(')')).split(/[,]/).map(d => +d)

export const formatCurrency = (value, decimals = false) =>
    d3
        .formatLocale({
            thousands: ' ',
            grouping: [3],
            currency: ['$', '']
        })
        .format(decimals ? '$,.2f' : '$,.0f')
        (value)

export const formatDate = (value, year = true, month = true, day = false) => {
    let options = {
        year: "numeric",
        month: "long",
        day: "numeric"
    }

    if (year && month && !day) {
        options = {
            year: "numeric",
            month: "long"
        }
    }

    return new Intl.DateTimeFormat('en-AU', options).format(value)
}

export const getChart = (
    id,
    svgWidth,
    svgHeight,
    margin = {
        left: 64,
        right: 16,
        top: 8,
        bottom: 56
    }
) => {
    const width = svgWidth - margin.left - margin.right
    const height = svgHeight - margin.top - margin.bottom

    const chart = d3
        .select(`#${id}`)
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .append('g')
        .attr('id', `${id}-main-g`)
        .attr('transform', `translate(${[margin.left, margin.top]})`)

    return { chart, width, height, margin }
}