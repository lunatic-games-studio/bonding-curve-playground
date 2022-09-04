// import * as math from 'mathjs';
// let math = require('mathjs');
import Benchmark from 'benchmark';
import simplify from 'simplify-js';

let assert = require('assert');

class BondingAnalysis {

	constructor(priceDataset = [], supplyDataset = []) {
		this.updateDataset(priceDataset, supplyDataset);
		this.sumReducer = (accumulator, currentValue) => accumulator + currentValue;
		this.areaPartsMemoize = this.memoize((p1, p2) => {
			return this.integralParts.slice(Math.min(p1, p2), Math.max(p1, p2) + 1)
		});
	}

	updateDataset(dataset) {
		this.priceDataset = dataset.map(data => data.y);
		this.supplyDataset = dataset.map(data => data.x);
		this.datasetLength = this.equalizeDatasets();
		this.collateralCurveArray = new Array(this.datasetLength);
		this.collateralCurveArray[0] = NaN;
		this.marketCapCurveArray = new Array(this.datasetLength);
		this.marketCapCurveArray[0] = NaN;
		this.integralParts = this.priceDataset.map((y, index) => this.definiteIntegral(index, index + 1));
	}

	/*
	* Calculates the definite integral between two index points.
	* Returns the integral sum as float.
	*/
	definiteIntegral(p1, p2) {
		let minP = Math.min(p1, p2);
		let maxP = Math.max(p1, p2);
		let xDataset = this.supplyDataset.slice(minP, maxP + 1);
		let yDataset = this.priceDataset.slice(minP, maxP + 1);
		let integralSum = 0;

		for (let index = 0, len = xDataset.length; index < len; index++) {
			if (index + 1 < xDataset.length) {
				let segmentArea = (yDataset[index + 1] + yDataset[index])*(xDataset[index + 1] - xDataset[index])*0.5;
				integralSum += segmentArea;
			}
		}

		return integralSum;
	}

	/*
	* Calculates the y-dataset for the collateral curve.
	* Returns a one-dimensional array.
	*/
	collateralCurve() {
		if(this.collateralCurveArray[0]) return this.collateralCurveArray;
		let yDataset = new Array(this.datasetLength);

		for (let i = 0, len = this.datasetLength; i < len; i++) {
			// Push collateral at point
			yDataset[i] = this.integralParts.slice(0, i + 2).reduce(this.sumReducer);
		}

		this.collateralCurveArray = yDataset;
		return this.collateralCurveArray;
	}

	marketCapCurve() {
		if(this.marketCapCurveArray.length[0]) return this.marketCapCurveArray;
		let yDataset = new Array(this.datasetLength);

		for (let i = 0, len = this.datasetLength; i < len; i++) {
			yDataset[i] = this.marketCap(this.priceDataset[i], this.supplyDataset[i]);
		}

		this.marketCapCurveArray = yDataset;
		return yDataset;
	}

	impliedValuationCurve() {
		let collateralCurveDataset = this.collateralCurveArray[0] ? this.collateralCurveArray : this.collateralCurve();
		let marketCapCurveDataset = this.marketCapCurveArray[0] ? this.marketCapCurveArray : this.marketCapCurve();

		let result = [];
		for (let i = 0, len = marketCapCurveDataset.length; i < len; i++) {
			result[i] = marketCapCurveDataset[i] - collateralCurveDataset[i];
		}

		return result;
	}

	/*
	* Return market cap at spot price
	*/
	marketCap(price, supply) {
		return price * supply;
	}

	memoize(func) {
	  let cache = {};
	  return function() {
	    let key = JSON.stringify(arguments);
	    if(cache[key]) {
	      return cache[key];
	    }
	    else {
	      let val = func.apply(this, arguments);
	      cache[key] = val;
	      return val;
	    }
	  };
	}

	costToSellCurve(percent) {
		BondingAnalysis.assertValidPercent(percent);
		let yDataset = new Array(this.datasetLength);

		for (let index = 0, len1 = this.datasetLength; index < len1; index++) {
			let currentSupply = this.supplyDataset[index];
			let tokensBought = percent * currentSupply;
			let toIndex = this.nearestIndex(currentSupply - tokensBought, this.supplyDataset);
			// let areaParts = this.integralParts.slice(Math.min(index, toIndex), Math.max(index, toIndex) + 1);
			let areaParts = this.areaPartsMemoize(index, toIndex);

			if (areaParts.length > 0) {
				let sum = 0;
				for (let i = 0, len2 = areaParts.length; i < len2; i++) {
					sum += areaParts[i];
				}
				yDataset[index] = sum;
			} else {
				yDataset[index] = 0;
			}
		}

		return yDataset;
	}

	costToBuyCurve(percent) {
		BondingAnalysis.assertValidPercent(percent);
		let yDataset = new Array(this.datasetLength);

		for (let index = 0, len1 = this.datasetLength; index < len1; index++) {
			let currentSupply = this.supplyDataset[index];
			let tokensBought = percent * currentSupply;
			let toIndex = this.nearestIndex(currentSupply + tokensBought, this.supplyDataset);
			// let areaParts = this.integralParts.slice(Math.min(index, toIndex), Math.max(index, toIndex) + 1);
			let areaParts = this.areaPartsMemoize(index, toIndex);

			if (areaParts.length > 0) {
				let sum = 0;
				for (let i = 0, len2 = areaParts.length; i < len2; i++) {
					sum += areaParts[i];
				}
				yDataset[index] = -sum;
			} else {
				yDataset[index] = 0;
			}
		}

		return yDataset;
	}

	static assertValidPercent(percent) {
		assert(percent <= 1);
		assert(percent >= 0);
	}

	nearestIndex(target, array) {
		return array.findIndex((value, index) => {
			return value >= target;
		});
	}

	/*
	* Makes both x & y dataset the same length.
	* Returns the resultant dataset length.
	*/
	equalizeDatasets() {
		let datasetLength = Math.max(this.priceDataset.length, this.supplyDataset.length);
		this.priceDataset = this.priceDataset.slice(0, datasetLength);
		this.supplyDataset = this.supplyDataset.slice(0, datasetLength);
	 	return datasetLength;
	}
}

export default BondingAnalysis;

// console.log('Starting')
// let instance = new BondingAnalysis([...Array(100).keys()], [...Array(100).keys()]);
// console.log(instance.costToBuyCurve(0.05));
// console.log('The End');
