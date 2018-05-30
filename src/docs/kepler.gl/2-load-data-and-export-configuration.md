<!-- INJECT:"KeplerglLoadData" heading -->

<ul class='insert learning-objectives'>
  <li>Load data and export configuration</li>
</ul>

# What Will We Do
In this step, we will be using Kepler.gl redux actions and helpers to inject data into a map instance 
and export its configuration programmatically.

In this part of our code lab, we are going to update only `app.js` file in `src`.

## 1. Data to load
We have created a folder `data` in `src` that contains mocked data which is a subset of the public dataset of 
New York City trips. The file name is `nyc-trips.csv.js`.

The file contains a long data string which would simulate the content of a csv file.

First, import nyc trips data into `app.js` by performing the following changes
```js
import nycTrips from './data/nyc-trips.csv';
```

In order to process the raw data we are going to use Kepler.gl APIs and in particular the following:
- Processors: provides ability to convert raw data (csv, json) into kepler.gl data form which has rows anf fields properties
- Actions: provides an easy interface to programmatically interact with kepler.gl instance

Import Processors and Actions
```js
// Kepler.gl actions
import {addDataToMap} from 'kepler.gl/actions';
// Kepler.gl Data processing APIs
import Processors from 'kepler.gl/processors';
```

Now that we have the necessary API imported in __app.js__ we can use react lifecycle to inject
data into kepler.gl map instance.

We can implement __componentDidMount__ in `app.js` using the following changes:
```js
componentDidMount() {
	// Use processCsvData helper to convert csv file into kepler.gl structure {fields, rows}
    const data = Processors.processCsvData(nycTrips);
    // Create dataset structure
    const dataset = {
      data,
      info: {
        // `info` property are optional, adding an `id` associate with this dataset makes it easier
        // to replace it later
        id: 'my_data'
      }
    };
    // addDataToMap action to inject dataset into kepler.gl instance
    this.props.dispatch(addDataToMap({datasets: dataset}));
}
```

In the above snippet, we first process the raw data using __processCsvData__ which will transform a raw csv content string into a Kepler.gl
stat structure __{rows, fields}__. The second step is to create the dataset object with the following structure:
- data: the generated object with rows and fields
- info (OPTIONAL): this is used to pass dataset id (this will be used in our next example) and other meta information (see API documentation for more)

In the last step, we are adding the data to our kepler.gl instance using the action __addDataToMap__ and we pass our new created dataset as an input paramenter.
You may notice, we use __datasets__ property to pass our new data object. __datasets__ property can be either a single object vlue or an array of datasets instances.

## 2. Export Kepler.gl instance configuration
Kepler.gl provides the ability to programmatically interact with the configuration store of an instance. In this part of our code lab, we are going to create a 
helper method in `app.js` to export Kepler.gl configuration. 

Before exporting the configuration we need to import Kepler.gl Schema APIs by add the following line to the import section:
```js
// Kepler.gl Schema APIs
import KeplerGlSchema from 'kepler.gl/schemas';
```

Let's add a new instance method to __app.js__ as it follows. __getMapConfig__ returns a config object of current map. __exportMapConfig__ save the config as a json file.

```js
  // This method is used as reference to show how to export the current kepler.gl instance configuration
  // Once exported the configuration can be imported using parseSavedConfig or load method from KeplerGlSchema
  getMapConfig() {
    // retrieve kepler.gl store
    const {keplerGl} = this.props;
    // retrieve current kepler.gl instance store
    const {map} = keplerGl;

    // create the config object
    return KeplerGlSchema.getConfigToSave(map);
  }

  // This method is used as reference to show how to export the current kepler.gl instance configuration
  // Once exported the configuration can be imported using parseSavedConfig or load method from KeplerGlSchema
  exportMapConfig = () => {
    // create the config object
    const mapConfig = this.getMapConfig();
    // save it as a json file
    downloadJsonFile(mapConfig, 'kepler.gl.json');
  };
```

__KeplerGlSchema.getConfigToSave__ takes the current map instance store, available in our component through `const mapStateToProps = state => state;`, and returns
the current map instance configuration with the following format:
- version: the current Kepler.gl schema version
- config: object with the actual configuration

Finally Let's add a button to trigger exporting configuration, and a helper to download the file.
```
import Button from './button';
import downloadJsonFile from "./file-download";
```

Render the button

```
  render() {
    return (
      <div style={{position: 'absolute', width: '100%', height: '100%'}}>
        <Button onClick={this.exportMapConfig}>Export Config</Button>
        <AutoSizer>
          {({height, width}) => (
            <KeplerGl
              mapboxApiAccessToken={MAPBOX_TOKEN}
              id="map"
              width={width}
              height={height}
            />
          )}
        </AutoSizer>
      </div>
    );
  }

```

Once the configuration is exported we can simply store it as json object wherever you see fit.

Checkout the complete code at [this link](https://github.com/uber-common/vis-academy/blob/kepler.gl/src/demos/kepler.gl/1-load-data/src/app.js)

__Next__, you can head to the next step:
[Load Data into Kepler.gl](#/kepler.gl/3-load-config).
