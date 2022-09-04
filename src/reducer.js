import { TOGGLE_SHOW_CHARTS, SET_CURVE_DATA } from './constants';

const initialState = {
    showCharts: false,
    supplyDataset: [],
    bondingCurve: [],
    collateralCurve: [],
    marketCapCurve: [],
    impliedValuationCurve: [],
    costOfBuying5Curve: [],
    costOfBuying10Curve: [],
    costOfSelling5Curve: [],
    costOfSelling10Curve: [],
}

export function bondingPlaygroundReducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_SHOW_CHARTS: {
        return {...state,
            showCharts: !state.showCharts
        }
    }
    case SET_CURVE_DATA: {
        return {
            ...state,
            [action.data.resultName]: action.data.result
        }
    }
    default:
      return state;
  }
}