// Pallete based on https://jfly.uni-koeln.de/color/
export const colours = {
    paletteLightBg: {
        orange: '#E69F00',
        skyBlue: '#56B4E9',
        bluishGreen: '#009E73',
        amber: '#F5C710',
        blue: '#0072B2',
        vermillion: '#D55E00',
        reddishPurple: '#CC79A7',
        axis: '#525252',
        contrasting: '#f5f5f5'
    },
    paletteDarkBg: {
        orange: '#d89a0e',
        skyBlue: '#5bb3e4',
        bluishGreen: '#239f7d',
        amber: '#d9b62c',
        blue: '#4098c9',
        vermillion: '#bd6118',
        reddishPurple: '#c688aa',
        axis: '#d4d4d4',
        contrasting: '#262626'
    }
}

export const getPalette = (theme = 'light') => {
    switch (theme) {
        case 'light':
            return colours.paletteLightBg
        case 'dark':
            return colours.paletteDarkBg
        case 'darkGradient':
            return colours.paletteDarkBg
        default:
            return colours.paletteLightBg
    }
}