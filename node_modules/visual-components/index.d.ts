type Theme = 'light' | 'dark' | 'darkGradient'

type Palette = {
    orange: string,
    skyBlue: string,
    bluishGreen: string,
    amber: string,
    blue: string,
    vermillion: string,
    reddishPurple: string,
    axis: string,
    contrasting: string
}

/*
*   COLOURS
*/
export const colours: {
    paletteLightBg: Palette,
    paletteDarkBg: Palette
}

export function getPalette(theme?: Theme): Palette


/*
*   PATTERNS
*/
export function addPattern(
    type: 'diagonal' | 'wave' | 'cross' | 'triangle' | 'scales',
    svg: Element,
    scale?: number,
    colour?: string
): string


/*
*   HTML
*/
export function handleInputChange(e: Event): null


/*
*   ANIMATIION
*/
// number.js
export function createNumber({ }: {
    svg: Element,
    x?: number,
    y?: number,
    textColour?: string,
    fontSize?: string,
    alignVertical?: 'auto' | 'middle'
}): Element

export function setNumberPosition(number: Element, x: number, y: number): null

export function numberChangeValue({ }: {
    number: Element,
    initial?: number,
    end: number,
    progress?: number,
    transitionDuration?: number,
    numberFormat?: Function
}): number

// text.js
export function createText({ }: {
    svg: Element,
    x?: number,
    y?: number,
    height: number,
    width: number,
    textColour?: string,
    fontSize?: string,
    alignVertical?: 'auto' | 'middle',
    alignHorizontal?: 'inherit' | 'middle',
    htmlText?: string
}): Element

export function hideText(textNode: Element, progress?: number): null

export function hideTextTransition(textNode: Element, duration?: number, transitionName?: string): Element

export function showText(textNode: Element, progress?: number): null

export function showTextTransition(textNode: Element, duration?: number, transitionName?: string): Element

export function changeText(textNode: Element, htmlText: string): null

export function changeTextTransition(textNode: Element, htmlText: string, duration?: number, transitionName?: string): null


/*
*   AXIS
*/
export function adjustColours(g: Element, colour: string, hideDomain?: boolean): null

export function addAxis({ }: {
    chart: Element, height: number, width: number, colour?: string, fontSize?: string,
    x?: Function, xLabel?: string, xFormat?: Function, xTickValues?: Array<any>, xNumTicks?: number, xNumTicksForceInitial?: boolean, hideXdomain?: boolean, xTickPadding?: number, xTicksRotate?: boolean,
    y?: Function, yLabel?: string, yFormat?: Function, yTickValues?: Array<any>, yNumTicks?: number, yNumTicksForceInitial?: boolean, hideYdomain?: boolean, yTickPadding?: number,
    yRight?: Function, yRightLabel?: string, yRightFormat?: Function, yRightTickValues?: Array<any>, yRightNumTicks?: number, yRightNumTicksForceInitial?: boolean, yRightTickPadding?: number
}): null

export function updateXaxis({ }: {
    chart: Element,
    x: Function,
    format?: Function,
    tickValues?: Array<any>,
    hideDomain?: boolean,
    transitionFix?: boolean,
    label?: string,
    rotate?: boolean
}): null

export function updateYaxis({ }: {
    chart: Element,
    y: Function,
    format?: Function,
    tickValues?: Array<any>,
    hideDomain?: boolean,
    transitionFix?: boolean,
    label?: string
}): null


/*
*   CHARTS
*/
// STATIC
type LineChart = ({ }: {
    chartProps: { chart: Object, width: number, height: number, margin: { left: number, right: number, top: number, bottom: number } },
    data: Array<Object>,
    theme?: 'light' | 'dark',
    colour?: string,
    xField: string,
    yField: string,
    x?: Function,
    y?: Function,
    axis?: Function,
    strokeWidth?: number,
    legend?: boolean,
    tooltip?: boolean
}) => { x: Function, y: Function }

export function plot(): {
    line: LineChart
}

// RACE
export function runRaceChart({ }: {
    type: 'line' | 'area',
    chart: Element,
    raceData: { keyframes: Array<Object>, prev: Map<Date, Object>, next: Map<Date, Object>, groups: Set<String> },
    x: Function,
    y: Function,
    updateChart: Function,
    addCustom?: Function
}): null

export function prepareRaceData({ }: {
    data: Array<Object>,
    dateField?: string,
    yearField?: string,
    isRankedData?: boolean,
    k?: number,
    n?: number
}): { keyframes: Array<Object>, prev: Map<Date, Object>, next: Map<Date, Object>, groups: Set<String> }

export function createAreaChart({ }: {
    chart: Element,
    x: Function,
    y: Function,
    customAttrs?: Function,
    isAddLine?: boolean
}): Function

export function updateAreaChart({ }: {
    updateArea: Function,
    stackedData: Array<Object>,
    updateAxis: Function,
    x: Function,
    y: Function
}): null


/*
*   LEGEND
*/
export function addLegend({ }: {
    chart: Element,
    legends: Array<string>,
    colours?: Array<string> | string,
    shapes?: Array<string>,
    patternIds?: Array<string>,
    xPosition?: number,
    yPosition?: number,
    fontSize?: string,
    fontWeight?: number,
    customId?: string
}): null

export function addVerticalLegend({ }: {
    chart: Element,
    legends: Array<string>,
    colours?: Array<string> | string,
    shapes?: Array<string>,
    xPosition?: number,
    yPosition?: number,
    fontSize?: string,
    fontWeight?: number,
    customId?: string
}): null

export function addColourLegend({ }: {
    chart: Element,
    title: string,
    colourScale: Element,
    colourScaleType: 'default' | 'threshold',
    colourOpacity?: number,
    xPosition?: number,
    yPosition?: number,
    width?: number,
    axis: Function,
    textColour?: string,
    axisTickFormat?: Function,
    customId?: string
}): null

export function addCircleLegend({ }: {
    chart: Element,
    sizeScale: Function,
    valuesToShow: Array<number>,
    xPosition?: number,
    yPosition?: number,
    colour?: string,
    title?: string,
    textFormat?: Function,
    customId?: string,
    valuesFontSize?: string,
    titleFontSize?: string
}): null


/*
*   TOOLTIP
*/
export function addTooltip(
    id: string,
    htmlText: Function,
    options?: { chartWidth: number, chartHeight: number }
): { mouseover: Function, mousemove: Function, mouseleave: Function }

export function addLineTooltip({ }: {
    id?: string,
    htmlText: Function,
    colour: string,
    chart?: Element,
    data?: Array<Object>,
    cx?: Function,
    cy?: Function,
    radius?: number,
    chartWidth?: number,
    chartHeight?: number
}): { mouseover: Function, mousemove: Function, mouseleave: Function }

export function removeLineTooltip(chart: Element): null

export function addHighlightTooltip({ }: {
    id?: string,
    chart?: Element,
    htmlText: Function,
    elements: Array<Element>,
    initialOpacity?: number,
    highlightedOpacity?: number,
    fadedOpacity?: number,
    chartWidth?: number,
    chartHeight?: number,
    fadeHighlightElements?: Array<Element>,
    highlightFunction?: Function
}): null

export function addVerticalTooltip({ }: {
    id?: string,
    htmlText: Function,
    chart: Element,
    chartWidth: number,
    chartHeight: number,
    x: Function,
    y: Function,
    colour: string,
    data: Array<Object>,
    xVariable: string,
    tooltipData: Object,
    keyFunction: Function
}): null

export function removeVerticalTooltip(chart: Element): null


/*
*   UTILS
*/
export function getTextWidth(txt: string, fontSize?: number | string, fontWeight?: number): number

export function convertSizeToIntPx(size: string): number

export function getTransformTranslate(transform: string): [x: number, y: number]

export function formatCurrency(value: number, decimals?: boolean, significantDigits?: number): string

export function formatDate(value: Date, year?: boolean, month?: boolean, day?: boolean): string

export function getMargin({ }: {
    left?: number,
    right?: number,
    top?: number,
    bottom?: number
}): { left: number, right: number, top: number, bottom: number }

export function getChartDimensions({ }: {
    chartId?: string,
    sm?: { width: number, scale: number },
    md?: { width: number, scale: number },
    lg?: { width: number, scale: number },
    xl?: { width: number, scale: number },
    xl2?: { width: number, scale: number },
}): { width: number, height: number }

export function getChart({ }: {
    id: string,
    svgWidth?: number,
    svgHeight?: number,
    chartDimensions?: { width: number, height: number },
    margin?: { left: number, right: number, top: number, bottom: number }
}): {
    chart: Element,
    width: number,
    height: number,
    margin: { left: number, right: number, top: number, bottom: number }
}

export function appendChartContainer({ }: {
    idNum?: number,
    chartTitle?: string,
    chartSubtitle?: string,
    outerContainerClass?: string,
    innerContainerClass?: string,
    titleClass?: string,
    subtitleClass?: string,
    chartsContainerId?: string,
    theme?: Theme,
    containerPadding?: string,
    containerAspectRatio?: string,
    titleSize?: string,
    titleColour?: string,
    titleWeight?: string,
    subtitleSize?: string,
    subtitleColour?: string,
    subtitleWeight?: string
}): string


export function getDateObject(
    d: any,
    isFullDateField: boolean
): Date

export function getBeginingYearDate(
    year: number
): Date

export function getYearFromTime(
    time: number
): Date