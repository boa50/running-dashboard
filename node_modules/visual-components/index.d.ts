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

export function showText(textNode: Element, progress?: number): null

export function changeText(textNode: Element, htmlText: string): null


/*
*   AXIS
*/
export function adjustColours(g: Element, colour: string, hideDomain?: boolean): null

export function addAxis({ }: {
    chart: Element, height: number, width: number, colour?: string, fontSize?: string,
    x?: Function, xLabel?: string, xFormat?: Function, xTickValues?: Array<any>, xNumTicks?: number, xNumTicksForceInitial?: boolean, hideXdomain?: boolean, xTickPadding?: number,
    y?: Function, yLabel?: string, yFormat?: Function, yTickValues?: Array<any>, yNumTicks?: number, yNumTicksForceInitial?: boolean, hideYdomain?: boolean, yTickPadding?: number,
    yRight?: Function, yRightLabel?: string, yRightFormat?: Function, yRightTickValues?: Array<any>, yRightNumTicks?: number, yRightNumTicksForceInitial?: boolean, yRightTickPadding?: number
}): null

export function updateXaxis({ }: {
    chart: Element,
    x: Function,
    format?: Function,
    tickValues?: Array<any>,
    hideDomain?: boolean
}): null

export function updateYaxis({ }: {
    chart: Element,
    y: Function,
    format?: Function,
    tickValues?: Array<any>,
    hideDomain?: boolean
}): null


/*
*   LEGEND
*/
export function addLegend({ }: {
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
    chartHeight?: number
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

export function formatCurrency(value: number, decimals?: boolean): string

export function formatDate(value: Date, year?: boolean, month?: boolean, day?: boolean): string

export function getMargin({ }: {
    left?: number,
    right?: number,
    top?: number,
    bottom?: number
}): { left: number, right: number, top: number, bottom: number }

export function getChart({ }: {
    id: string,
    svgWidth?: number,
    svgHeight?: number,
    margin?: { left: number, right: number, top: number, bottom: number }
}): {
    chart: Element,
    width: number,
    height: number,
    margin: { left: number, right: number, top: number, bottom: number }
}