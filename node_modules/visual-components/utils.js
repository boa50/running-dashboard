// Based on: https://www.geeksforgeeks.org/calculate-the-width-of-the-text-in-javascript/
export const getTextWidth = (txt, fontSize = '1rem', fontWeight = 700) => {
    const text = document.createElement('span')
    document.body.appendChild(text)

    text.style.font = 'ui-sans-serif'
    text.style.fontSize = fontSize
    text.style.fontWeight = fontWeight
    text.style.height = 'auto'
    text.style.width = 'auto'
    text.style.position = 'absolute'
    text.style.whiteSpace = 'no-wrap'
    text.innerHTML = txt;

    const width = Math.ceil(text.clientWidth)
    document.body.removeChild(text)

    return width
}

export const convertSizeToIntPx = size => {
    const baseSize = 16
    const sizeNumber = parseFloat(size)
    const measure = size.replace(sizeNumber.toString(), '')

    switch (measure) {
        case 'px':
            return sizeNumber
        case 'rem':
            return sizeNumber * baseSize
        case 'em':
            return sizeNumber * baseSize
        case 'pt':
            return (sizeNumber / 12) * baseSize
        case '%':
            return (sizeNumber / 100) * baseSize
    }
}

export const getTransformTranslate = transform =>
    transform.substring(transform.indexOf('(') + 1, transform.indexOf(')')).split(/[,]/).map(d => +d)

export const formatCurrency = (value, decimals = false, significantDigits = 0) =>
    d3
        .formatLocale({
            thousands: ' ',
            grouping: [3],
            currency: ['$', '']
        })
        .format(
            decimals ? '$,.2f' :
                significantDigits > 0 ? `$,.${significantDigits}s` :
                    '$,.0f')
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

export const getMargin = ({
    left = 64,
    right = 16,
    top = 8,
    bottom = 56
}) => { return { left, right, top, bottom } }

const getSvgWidth = chartId =>
    document.getElementById(`${chartId}-container`).offsetWidth

const getSvgHeight = chartId => {
    const title = document.getElementById(`${chartId}-title`)
    const subtitle = document.getElementById(`${chartId}-subtitle`)

    return document.getElementById(`${chartId}-container`).offsetHeight
        - (title ? title.offsetHeight : 0) - (subtitle ? subtitle.offsetHeight : 0)
}

const getChartScale = chartId => {
    return getSvgWidth(chartId) / getSvgHeight(chartId)
}

export const getChartDimensions = ({
    chartId,
    sm = { width: 420, scale: undefined },
    md = { width: 700, scale: undefined },
    lg = { width: 700, scale: undefined },
    xl = { width: 622, scale: undefined },
    xl2 = { width: 875, scale: undefined }
}) => {
    let width, height, scale

    if (window.matchMedia("(min-width: 1536px)").matches) {
        width = xl2.width
        scale = xl2.scale
    } else if (window.matchMedia("(min-width: 1280px)").matches) {
        width = xl.width
        scale = xl.scale
    } else if (window.matchMedia("(min-width: 1024px)").matches) {
        width = lg.width
        scale = lg.scale
    } else if (window.matchMedia("(min-width: 768px)").matches) {
        width = md.width
        scale = md.scale
    } else {
        width = sm.width
        scale = sm.scale
    }

    if (scale === undefined) {
        scale = chartId !== undefined ? getChartScale(chartId) : (16 / 9)
    }

    height = width / scale

    return { width, height }
}

export const getChart = ({
    id,
    svgWidth,
    svgHeight,
    chartDimensions,
    margin = getMargin({})
}) => {
    if (chartDimensions === undefined) chartDimensions = getChartDimensions({ chartId: id })

    svgWidth = svgWidth !== undefined ? svgWidth : getSvgWidth(id)
    svgHeight = svgHeight !== undefined ? svgHeight : getSvgHeight(id)

    const viewBoxWidth = chartDimensions.width !== undefined ? chartDimensions.width : svgWidth
    const viewBoxHeight = chartDimensions.height !== undefined ? chartDimensions.height : svgHeight

    const width = viewBoxWidth - margin.left - margin.right
    const height = viewBoxHeight - margin.top - margin.bottom

    const chart = d3
        .select(`#${id}`)
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .attr('viewBox', `0 0  ${viewBoxWidth} ${viewBoxHeight}`)
        .attr('preserveAspectRatio', 'xMinYMid meet')
        .append('g')
        .attr('id', `${id}-main-g`)
        .attr('transform', `translate(${[margin.left, margin.top]})`)

    return { chart, width, height, margin }
}

export const appendChartContainer = ({
    idNum = 0,
    chartTitle,
    chartSubtitle,
    outerContainerClass,
    innerContainerClass,
    titleClass,
    subtitleClass,
    chartsContainerId = 'charts',
    theme = 'light',
    containerPadding = 'px-4 py-2',
    containerAspectRatio = 'aspect-[4/3] md:aspect-video',
    titleSize = 'text-sm md:text-base',
    titleColour,
    titleWeight = 'font-medium',
    subtitleSize = 'text-xs md:text-sm',
    subtitleColour,
    subtitleWeight = ''
}) => {
    const chartId = `chart${idNum}`
    let containerBackground = 'bg-neutral-50'

    switch (theme) {
        case 'light':
            titleColour = getValueIfUndefined(titleColour, 'text-gray-700')
            subtitleColour = getValueIfUndefined(subtitleColour, 'text-gray-500')
            break
        case 'dark':
            containerBackground = 'bg-neutral-900'
            titleColour = getValueIfUndefined(titleColour, 'text-neutral-200')
            subtitleColour = getValueIfUndefined(subtitleColour, 'text-neutral-400')
            break
        case 'darkGradient':
            containerBackground = 'bg-gradient-to-b from-gray-800 to-gray-950'
            titleColour = getValueIfUndefined(titleColour, 'text-neutral-200')
            subtitleColour = getValueIfUndefined(subtitleColour, 'text-neutral-400')
            break
    }

    outerContainerClass = getValueIfUndefined(outerContainerClass, `${containerBackground} ${containerPadding} rounded`)
    innerContainerClass = getValueIfUndefined(innerContainerClass, containerAspectRatio)
    titleClass = getValueIfUndefined(titleClass, `${titleSize} ${titleColour} ${titleWeight}`)
    subtitleClass = getValueIfUndefined(subtitleClass, `${subtitleSize} ${subtitleColour} ${subtitleWeight}`)

    d3
        .select(`#${chartsContainerId}`)
        .append('div')
        .attr('class', outerContainerClass)
        .append('div')
        .attr('id', `${chartId}-container`)
        .attr('class', innerContainerClass)
        .call(g =>
            chartTitle !== undefined ?
                g
                    .append('h3')
                    .attr('id', `${chartId}-title`)
                    .attr('class', titleClass)
                    .html(chartTitle)
                : g
        )
        .call(g =>
            chartSubtitle !== undefined ?
                g
                    .append('h4')
                    .attr('id', `${chartId}-subtitle`)
                    .attr('class', subtitleClass)
                    .html(chartSubtitle)
                : g
        )
        .call(g =>
            g
                .append('svg')
                .attr('id', chartId)
        )

    return chartId
}

function getValueIfUndefined(variable, value) {
    return variable === undefined ? value : variable
}

export const getDateObject = (d, isFullDateField) =>
    isFullDateField ?
        new Date(`${d + 'T00:00:00'}`) :
        new Date(d, 0, 1, 0, 0, 0, 0)

export const getBeginingYearDate = year =>
    new Date(year, 0, 1, 0, 0, 0, 0).getTime()

export const getYearFromTime = time =>
    new Date(time).getFullYear()