# Bonding Curve Playground [![pipeline status](https://gitlab.com/linumlabs/bonding-curve-playground/badges/master/pipeline.svg)](https://gitlab.com/linumlabs/bonding-curve-playground/commits/master)

![Linum Labs](images/linumlabs.png)

A web app to experiment and play with token bonding curve design.

Now with decimation, downsampling, interpolation, and memoization included...

## Hosting

This project is hosted at `http://bondingplayground.netlify.com/`. It's deployed from the master branch. We will integrate a proper deployment pipeline in with automated testing in due course!

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Prerequisites

Clone the repository `git clone git@gitlab.com:linumlabs/bonding-curve-playground.git`

## Installing

### `yarn install`

Installs the necessary dependencies.

## Testing

### `yarn test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## Development

### `yarn start`

NB: This does not work flawlessly due to the service worker implementation. Instead, use `serve -s build/`. If you want hot reloading, use `yarn start`, but expect that some of the plots will not be shown.

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn run build` followed by `serve -s build/`

Runs the app in "production" mode.<br>
Open [http://localhost:5000](http://localhost:5000) to view it in the browser.

## Deployment

### `yarn run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Built With

* [React](https://reactjs.org/) - The web framework used
* [Create-React-App](https://facebook.github.io/create-react-app/docs/getting-started) - React scaffolding

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us. We also have a list of issues that need to be solved and features that need to be added!

<!-- ## Versioning

We use ... for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). -->

## Roadmap

As we get more contributors onboard we'll define the roadmap a bit better, defining what useful features we'd like to develop.

### Future Features

Some initial ideas for needed features, and features currently being developed:

1. Trading simulator interface - this is in active development, see the relevant branch
2. Curve parameter controls, for example sliders, live updates, guided examples and interaction, etc.

## Authors

* **Benjamin Scholtz** - *Initial work* - [BenSchZA](https://github.com/BenSchZA)
* **Michael Yankelev** - *Initial work* - [panterazar](https://github.com/panterazar)

See also the list of [contributors](https://gitlab.com/linumlabs/bonding-curve-playground/graphs/master) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

<!-- ## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc -->
