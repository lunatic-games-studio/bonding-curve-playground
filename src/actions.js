import { SET_CURVE_PARAMETERS, 
    ADD_TRADER, 
    TOGGLE_SHOW_CHARTS, 
    SET_CURVE_DATA
} from './constants';

export function setCurveParameters(curveParameters) {
    return {
        type: SET_CURVE_PARAMETERS,
        curveParameters,
    }
}

export function setCurveData(data) {
    return {
        type: SET_CURVE_DATA,
        data,
    }
}

export function addTrader() {
    return {
        type: ADD_TRADER
    }
}

export function toggleShowCharts() {
    return {
        type: TOGGLE_SHOW_CHARTS
    }
}