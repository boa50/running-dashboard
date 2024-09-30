export const runRaceChart = ({
    type,
    chart,
    raceData,
    x,
    y,
    updateChart,
    addCustom = () => { }
}) => {
    const { keyframes } = raceData

    const runChart = async () => {
        for (let i = 1; i < keyframes.length; i++) {
            const { keyframeData, currentData } = prepareKeyframeData(raceData, i, type)

            const transition = chart
                .transition('raceChart')
                .duration(0)
                .ease(d3.easeLinear)

            updateChart(currentData)

            addCustom(keyframeData, x, y)

            await transition.end()
        }
    }

    runChart()
}

function prepareKeyframeData(raceData, i, type) {
    const { keyframes, groups } = raceData

    const keyframeData = []
    keyframes.slice(0, i)
        .forEach(d => d[1].forEach(v => { keyframeData.push({ date: d[0], group: v.group, value: v.value }) }))

    let currentData = keyframeData
    switch (type) {
        case 'area':
            currentData = d3
                .stack()
                .offset(d3.stackOffsetDiverging)
                .keys(groups)
                .value(([, group], key) => group.get(key).value)
                (d3.index(keyframeData, d => d.date, d => d.group))
            break
    }

    return { keyframeData, currentData }
}