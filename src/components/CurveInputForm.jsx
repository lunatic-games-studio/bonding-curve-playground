import React, { Component } from 'react';
import { Typography, FormControl, TextField, Button, FormHelperText } from '@material-ui/core';
import * as math from 'mathjs';


const allowedSymbolNames = ['x', 'e', 'pi'];

class CurveInputForm extends Component {
    state = {
        curveFunction: '',
        maxTokens: 5000,
        error: ''
    };

    handleChange = event => {
        // only validate the curveFunction input, as tokenSupply is already locked
        if (event.target.name === 'curveFunction') {
            try {
                const expression = math.parse(event.target.value);

                const symbols = expression.filter((node) => node.isSymbolNode)

                if (!symbols.map(s => s.name.toLowerCase()).includes('x')) {
                    throw new Error('Please include an `X` variable')
                }

                const invalidSymbols = symbols.filter(s => !allowedSymbolNames.includes(s.name.toLowerCase()))

                if (invalidSymbols.length > 0) {
                    throw new Error('Too many variables')
                }

                this.setState({ error: '' })
            } catch (error) {
                this.setState({ error: `Invalid - ${error.message}` });
            }
        }

        this.setState({ [event.target.name]: event.target.value });
    };

    handleExampleClick = type => {
        let example;

        switch (type) {
            case 'linear':
                example = 'x';
                break;
            case 'quadratic':
                example = 'x^2';
                break;
            case 'squareroot':
                example = 'sqrt(x)';
                break;
            case 'sigmoid':
                example = '100/(1+e^(-0.002(x-2000)))';
                break;
            default:
                example = '';
        }

        this.setState({ curveFunction: example });
    }

    render() {
        let exampleButtonStyle = {
            'marginLeft': '2px',
            'marginRight': '2px',
        }

        return (
            <div className="Curve-Input-Form">
                <Typography variant="h4">Choose a bonding function</Typography>
                <Typography variant="body1">Defined as token price p(x) where x is the number of tokens issued</Typography>
                <Typography variant="caption">Examples:</Typography>
                <div>
					<span>
						<Button style={exampleButtonStyle} variant="outlined" onClick={() => this.handleExampleClick('linear')}>
							<Typography variant="caption">Linear: x</Typography>
						</Button>
					</span>
                    <span>
						<Button style={exampleButtonStyle} variant="outlined" onClick={() => this.handleExampleClick('quadratic')}>
							<Typography variant="caption">Quadratic: x^2</Typography>
						</Button>
					</span>
                    <span>
						<Button style={exampleButtonStyle} variant="outlined" onClick={() => this.handleExampleClick('squareroot')}>
							<Typography variant="caption">Squareroot: sqrt(x)</Typography>
						</Button>
					</span>
                    <span>
						<Button style={exampleButtonStyle} variant="outlined" onClick={() => this.handleExampleClick('sigmoid')}>
							<Typography variant="caption">Sigmoid: 100/(1+e^(-0.02(x-1000)))</Typography>
						</Button>
					</span>
                </div>
                <FormControl style={{ margin: '10px' }}>
                    <TextField
                        value={this.state.curveFunction}
                        onChange={this.handleChange}
                        label="Enter bonding function"
                        placeholder="p(x) ="
                        margin="normal"
                        variant="outlined"
                        inputProps={{
                            name: 'curveFunction',
                            id: 'curve-function',
                        }} />
                    <FormHelperText>{this.state.error}</FormHelperText>
                </FormControl>
                <FormControl style={{ margin: '10px' }}>
                    <TextField
                        value={this.state.maxTokens}
                        onChange={this.handleChange}
                        label="Choose max token supply"
                        placeholder="5000"
                        margin="normal"
                        variant="outlined"
                        type="number"
                        inputProps={{
                            name: 'maxTokens',
                            id: 'max-tokens',
                        }} />
                </FormControl>
                <br />
                <Button type='submit' variant="outlined" color="primary" disabled={(!this.state.curveFunction || this.state.error !== '')} onClick={() => this.props.submitCurve(this.state)}>
                    Simulate
                </Button>
            </div>
        )
    }
}

export default CurveInputForm;
