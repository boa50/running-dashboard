export const plotChart = async () => {
    const data = await prepareData()

    console.log(data);
    console.log(d3.max(data, d => d.distance / 1000))
}

async function prepareData() {
    const distances = await d3.csv('/data/activities.csv')
        .then(dt => dt
            .filter(d => new Date(d.local_time).getFullYear() === 2024)
            .map(d => {
                const localDate = new Date(d.local_time)
                return {
                    dateKey: d.local_time.substring(0, 10),
                    date: localDate,
                    distance: +d.distance
                }
            }).sort((a, b) => a.date - b.date))

    const data = []

    const currentDate = new Date('2024-01-01T00:00:00Z')
    for (let i = 0; i < 366; i++) {
        const dateKey = currentDate.toISOString().substring(0, 10)

        const distanceData = distances.filter(d => d.dateKey === dateKey)
        const distanceDay = distanceData.length > 0 ? distanceData[0].distance : 0
        const distance = data.length > 0 ? data[data.length - 1].distance + distanceDay : distanceDay

        data.push({
            dateKey,
            date: new Date(currentDate.getTime()),
            distanceDay,
            distance
        })

        currentDate.setDate(currentDate.getDate() + 1)
    }

    return data
}