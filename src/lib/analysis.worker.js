import BondingAnalysis from './bonding_analysis';
let bondingAnalysis = new BondingAnalysis();

self.addEventListener('message', event => { // eslint-disable-line no-restricted-globals
    console.log("Worker received message" + event);

    let result = [];

    switch(event.data.functionName) {
        case 'updateDataset':
            result = bondingAnalysis.updateDataset(...event.data.arguments);
            break;
        case 'collateralCurve':
            result = bondingAnalysis.collateralCurve();
            break;
        case 'marketCapCurve':
            result = bondingAnalysis.marketCapCurve();
            break;
        case 'impliedValuationCurve':
            result = bondingAnalysis.impliedValuationCurve();
            break;
        case 'costToSellCurve':
            result = bondingAnalysis.costToSellCurve(...event.data.arguments);
            break;
        case 'costToBuyCurve':
            result = bondingAnalysis.costToBuyCurve(...event.data.arguments);
            break;
        default:
            break;
    }

    self.postMessage({resultName: event.data.resultName, result: result}); // eslint-disable-line no-restricted-globals
});

export default Worker;
