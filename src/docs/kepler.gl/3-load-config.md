<!-- INJECT:"KeplerglLoadConfig" heading -->

<ul class='insert learning-objectives'>
  <li>Loading existing configuration</li>
</ul>

# What Will We Do
In this step, we will be using Kepler.gl `addDataToMap` action to upload data with an existing configuration.

In this part of our code lab, we are going to update only `app.js` file in `src`.

## 1. Data to load
We have created a folder `data` in `src` that contains mocked configuration which was previously saved it. 
The file name is `nyc-config.json`.


First, import nyc config json into `app.js` by performing the following changes
```js
import nycConfig from './data/nyc-config';
```

Now that we have the necessary configuration file imported in __app.js__ we can update __componentDidMount__ and inject
the map configuration into our Kepler.gl instance. Update componentDidMount to look like this:

```js
// Use processCsvData helper to convert csv file into kepler.gl structure {fields, rows}
    const data = Processors.processCsvData(nycTrips);
    // Create dataset structure
    const dataset = {
      data,
      info: {
        id: 'rizctto3p'
        // this is used to match the dataId defined in nyc-config.json. For more details see API documentation.
        // It is paramount that this id mathces your configuration otherwise the configuration file will be ignored.
      }
    };
    // addDataToMap action to inject dataset into kepler.gl instance
    this.props.dispatch(addDataToMap({datasets: dataset, config: nycConfig}));
```

We now create the dataset to pass using the property Info and an Id. The id must match the Data id defined in some of the properties from within nyc-config.json.

We are also adding the configuration to __addDataToMap call which will make sure to load the existing configuration.
 
## 2. Replace an existing dataset with new data but with the same format

In order to replace the current data with new ones (same data properties), we are going to perform the following steps:
- generate a new dataset using the same approach we did previously
- extract the current configuration
- inject the new data

Import the new nyc data subset which we are going to use to replace the original one. 
In the import section of `app.js` add the following
```js
import nycTripsSubset from './data/nyc-subset.csv';
```

Let's create a new helper method that we will use to replace data. Add the following method to `app.js`

```js
// Created to show how to replace dataset with new data and keeping the same configuration
replaceData() {
	// Use processCsvData helper to convert csv file into kepler.gl structure {fields, rows}
	const data = Processors.processCsvData(nycTripsSubset);
	// Create dataset structure
	const dataset = {
	  data,
	  info: {
		id: 'rizctto3p'
		// this is used to match the dataId defined in nyc-config.json. For more details see API documentation.
		// It is paramount that this id mathces your configuration otherwise the configuration file will be ignored.
	  }
	};

	// read the current configuration
	const config = this.exportConfiguration();

	// addDataToMap action to inject dataset into kepler.gl instance
	this.props.dispatch(addDataToMap({datasets: dataset, config}));
}
```

this method will allow programmatically to replace the current data with new one (having the same structure).