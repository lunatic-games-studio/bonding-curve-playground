import React, { Component } from 'react';
import {Typography, Paper, Grid, IconButton, Button} from '@material-ui/core';
import './App.css';
import CurveInputForm from './components/CurveInputForm';
import * as math from 'mathjs';
import CurveDisplayChartJS from './components/CurveDisplayChartJS';
import CurveDescriptionPanel from './components/CurveDescriptionPanel';
import Worker from './lib/analysis.worker.js';
import 'array.stride';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as appActions from './actions';

class App extends Component {
    componentDidMount = () => {
        this.worker = Worker();

        this.worker.addEventListener('message', (event) => {
            console.log('Got: ' + event.data.resultName + '\n');
            if (event.data.hasOwnProperty('resultName')) { this.props.appActions.setCurveData(event.data) }
        });

        this.worker.addEventListener('error', function (error) {
            console.log('Worker error: ' + error.message + '\n');
            throw error;
        });
    };

    generateDataset = (curveParameters) => {
        this.props.appActions.setCurveParameters(curveParameters);
        const expr = math.compile(curveParameters.curveFunction);
        const interval = (curveParameters.maxTokens > 9999) ? curveParameters.maxTokens / 5000 : 1;
        const dataset = math.range(0, curveParameters.maxTokens, interval)
            .toArray()
            .map((x) => { return {
                x: x,
                y: expr.eval({ x: x })}
            });

        this.props.appActions.setCurveData({resultName:'bondingCurve', result: dataset.map(point => point.y)});
        this.props.appActions.setCurveData({resultName:'supplyDataset', result: dataset.map(point => point.x)});

        console.log('Starting worker queue');
        this.worker.postMessage({ functionName: 'updateDataset', arguments: [dataset] });
        this.worker.postMessage({ resultName: 'collateralCurve', functionName: 'collateralCurve' });
        this.worker.postMessage({ resultName: 'marketCapCurve', functionName: 'marketCapCurve' });
        this.worker.postMessage({ resultName: 'impliedValuationCurve', functionName: 'impliedValuationCurve' });
        this.worker.postMessage({ resultName: 'costOfBuying5Curve', functionName: 'costToBuyCurve', arguments: [0.05] });
        this.worker.postMessage({ resultName: 'costOfBuying10Curve', functionName: 'costToBuyCurve', arguments: [0.10] });
        this.worker.postMessage({ resultName: 'costOfSelling5Curve', functionName: 'costToSellCurve', arguments: [0.05] });
        this.worker.postMessage({ resultName: 'costOfSelling10Curve', functionName: 'costToSellCurve', arguments: [0.10] });
        console.log('Posted worker queue');

        this.props.appActions.toggleShowCharts();
    };

    render() {
        const {
            showCharts,
            supplyDataset,
            bondingCurve,
            collateralCurve,
            marketCapCurve,
            impliedValuationCurve,
            costOfBuying5Curve,
            costOfBuying10Curve,
            costOfSelling5Curve,
            costOfSelling10Curve,
        } = this.props;

        let styles = {
            header: {
                margin: '20px'
            },
            gitlabIcon: {
                width:"24px",
                height:"24px"
            },
            linum: {
                textTransform: 'none',
                fontFamily: "'Pacifico', cursive",
                fontSize: 'large'
            }
        };

        return (
            <div className="App">
                <header className="App-header">
                    <Typography variant="h2" style={styles.header}>Bonding Curve Playground</Typography>
                    <link href="https://fonts.googleapis.com/css?family=Pacifico" rel="stylesheet"/>
                    <Button variant={"outlined"} style={styles.linum} href={"https://github.com/lunatic-games-studio/bonding-curve-playground"}>An open-source tool created at Lunatic Games Studio with love</Button>
                    <IconButton arial-label={"GitHub"} href={"https://github.com/lunatic-games-studio/bonding-curve-playground"}>
                    </IconButton>
                </header>
                <CurveInputForm submitCurve={this.generateDataset} />
                {showCharts &&
                <Grid
                    container
                    spacing="24"
                    direction="column"
                    justify="space-around"
                    alignItems="center" >
                    <Grid item xs={12} md={8}>
                        <Paper>
                            <CurveDescriptionPanel title="Bonding Curve" description="
                                A bonding curve is an automatic market maker. It introduces liquidity
                                into a market where traditional stock markets rely on willing buyer and willing seller.
                                The price per unit supply is defined by the bonding curve, with the price of the
                                token generally increasing as the total supply increases. Any collateral bonded into
                                the market is kept aside in a collateral pool, which means the tokens can be sold
                                back down the bonding curve at any point.
                            "/>
                            <CurveDisplayChartJS title="" xLabel="Token supply" yLabel="Price"
                                                 yDatasets={[
                                                     { label: "Bonding", data: bondingCurve },
                                                 ]}
                                                 xDataset={supplyDataset} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Paper>
                            <CurveDescriptionPanel title="Collateral vs Implied Valuation" description="Description."/>
                            <CurveDisplayChartJS title="" xLabel="Token supply" yLabel="Price"
                                                 stacked="true"
                                                 yDatasets={[
                                                     { label: "Collateral", data: collateralCurve },
                                                     { label: "Implied valuation", data: impliedValuationCurve },
                                                 ]}
                                                 xDataset={supplyDataset} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Paper>
                            <CurveDescriptionPanel title="Market Capital" description="Description."/>
                            <CurveDisplayChartJS title="" xLabel="Token supply" yLabel="Price"
                                                 yDatasets={[
                                                     { label: "Market cap", data: marketCapCurve },
                                                 ]}
                                                 xDataset={supplyDataset} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Paper>
                            <CurveDescriptionPanel title="Cost of buying/selling" description="Description."/>
                            <CurveDisplayChartJS title="" xLabel="Token supply" yLabel="Price"
                                                 yDatasets={[
                                                     { label: "Buy 5%", data: costOfBuying5Curve },
                                                     { label: "Buy 10%", data: costOfBuying10Curve },
                                                     { label: "Sell 5%", data: costOfSelling5Curve },
                                                     { label: "Sell 10%", data: costOfSelling10Curve },
                                                 ]}
									xDataset={supplyDataset} />
							</Paper>
						</Grid>
					</Grid>
				}
			</div >
        );
    }
}

const mapStateToProps = state => {
    return {
        showCharts: state.showCharts,
        supplyDataset: state.supplyDataset,
        bondingCurve: state.bondingCurve,
        collateralCurve: state.collateralCurve,
        marketCapCurve: state.marketCapCurve,
        impliedValuationCurve: state.impliedValuationCurve,
        costOfBuying5Curve: state.costOfBuying5Curve,
		costOfBuying10Curve: state.costOfBuying10Curve,
		costOfSelling5Curve: state.costOfSelling5Curve,
		costOfSelling10Curve: state.costOfSelling10Curve,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		appActions: bindActionCreators(appActions, dispatch)
	}
}

export default connect(
	mapStateToProps,
    mapDispatchToProps
)(App);

