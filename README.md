[![CircleCI](https://circleci.com/gh/architecture-topography/json-collector/tree/master.svg?style=svg)](https://circleci.com/gh/architecture-topography/json-collector/tree/master)
# JSON Collector

The json collector will read from a topo diagram from a json file and call the
correct mutations in TOPO to create the diagram.

## Running locally
To run locally with node-ts (basically compiling typescript on the fly).

1. Install all the dependecies with `yarn install`.
1. Run `yarn start`.

## Testing

1. Install all the dependencies with `yarn install`.
1. Run unit tests with `yarn test`.

## Building and packaging

To build the TypeScript into javascript that you can run with `node`. Follow the following steps.

1. Install all the dependencies with `yarn install`.
1. Build with `yarn build`. All the compiled javascript will be in the `lib` directory.

To package into binaries. Run `yarn package` and the packaged binaries will be in the `packaged` directory.

## Usage
Depending on whether your running with yarn start of with one of the packaged binaries, the start of your command will be different. The examples below assume that you're using the osx binary.

To run the demo JSON on a locally running topo instance you would run the following. 

```
./packaged/json-collector-macos -f examples/demo.json --host 'http://localhost:4000'
```

This should give you output similar to

```
[cli] TOPO JSON Collector
[topoInterface] Deleted existing data
[topoInterface] Created technology: React
[topoInterface] Created technology: Ruby on Rails
[topoInterface] Created technology: Elixir
[topoInterface] Created box: ThoughtWorks
[topoInterface] Created box: Staffing
[topoInterface] Created box: Finance
[topoInterface] Created box: People
[topoInterface] Created box: Professional Services
[topoInterface] Created box: Demand
[topoInterface] Created box: Selling Work
[topoInterface] Created System: Sales Funnel
```

A couple of things to note:

* This will try to make as much as possible. It wont cancel out after an error
* It always starts by deleting all the nodes in topo. The assumption is that the JSON file is the source of truth.