<!-- INJECT:"KeplerglLoadConfig" heading -->

<ul class='insert learning-objectives'>
  <li>Loading existing configuration</li>
</ul>

# What Will We Do
In this step, we will be using Kepler.gl `addDataToMap` action to upload data with an existing configuration. You can use this action to load the saved map.

In this part of our code lab, we are going to update only `app.js` file in `src`.

## 1. Data and Config to load
If you previously downloaded a map config, you can put it in the `src/data` folder, and name it `nyc-config.json`, replacing the existing one.


First, import nyc config json into `app.js`
```js
import nycConfig from './data/nyc-config.json';
```

Now that we have the necessary configuration file imported in __app.js__ we can update __componentDidMount__ and inject
the map configuration into our Kepler.gl instance. Update componentDidMount to look like this:

```js
  componentDidMount() {
    // Use processCsvData helper to convert csv file into kepler.gl structure {fields, rows}
    const data = Processors.processCsvData(nycTrips);
    // Create dataset structure
    const dataset = {
      data,
      info: {
        id: 'my_data'
        // this is used to match the dataId defined in nyc-config.json. For more details see API documentation.
        // It is paramount that this id mathces your configuration otherwise the configuration file will be ignored.
      }
    };
    // addDataToMap action to inject dataset into kepler.gl instance
    this.props.dispatch(addDataToMap({datasets: dataset, config: nycConfig}));
  }
```

We now create the dataset to pass using the property Info and an Id. The id must match the Data id defined in some of the properties from within nyc-config.json.

We are also adding the configuration to __addDataToMap__ call which will make sure to load the existing configuration.
 
## 2. Replace an existing dataset with new data with the same format , keeping the current config.

In order to replace the current data with new ones (same column names, data types etc), we are going to perform the following steps:
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
  replaceData = () => {
    // Use processCsvData helper to convert csv file into kepler.gl structure {fields, rows}
    const data = Processors.processCsvData(nycTripsSubset);
    // Create dataset structure
    const dataset = {
      data,
      info: {
        id: 'my_data'
        // this is used to match the dataId defined in nyc-config.json. For more details see API documentation.
        // It is paramount that this id mathces your configuration otherwise the configuration file will be ignored.
      }
    };

    // read the current configuration
    const config = this.getMapConfig();

    // addDataToMap action to inject dataset into kepler.gl instance
    this.props.dispatch(addDataToMap({datasets: dataset, config}));
  };
```

Last let's update the button in __render__ to trigger replacing data
```js
    <Button onClick={this.replaceData}>Replace Data</Button>
```

this method will allow programmatically to replace the current data with new one and apply the same map configuration.

Checkout the complete code at [this link](https://github.com/uber-common/vis-academy/blob/kepler.gl/src/demos/kepler.gl/3-load-config/src/app.js)
