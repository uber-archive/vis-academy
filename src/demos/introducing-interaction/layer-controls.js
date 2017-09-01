import React, {Component} from 'react';
import {layerControl} from './style';

export default class LayerControls extends Component {

  _onValueChange(settingName, newValue) {
    const {settings} = this.props;
    // Only update if we have a confirmed change
    if (settings[settingName] !== newValue) {
      // Create a new object so that shallow-equal detects a change
      const newSettings = {
        ...this.props.settings,
        [settingName]: newValue
      };

      this.props.onChange(newSettings);
    }
  }

  render() {
    const {title, settings, propTypes = {}} = this.props;

    return (
      <div className="layer-controls" style={layerControl}>
        {title && <h4>{title}</h4>}
        {Object.keys(settings).map(key =>
          <div key={key}>
            <label>{propTypes[key].displayName}</label>
            <div style={{display: 'inline-block', float: 'right'}}>
              {settings[key]}</div>
            <Setting
              settingName={key}
              value={settings[key]}
              propType={propTypes[key]}
              onChange={this._onValueChange.bind(this)}/>
          </div>)}
      </div>
    );
  }
}

const Setting = props => {
  const {propType} = props;
  if (propType && propType.type) {
    switch (propType.type) {
    case 'range':
      return <Slider {...props} />;

    case 'boolean':
      return <Checkbox {...props}/>;
    default:
      return <input {...props}/>;
    }
  }
};

const Checkbox = ({settingName, value, onChange}) => {
  return (
    <div key={settingName} >
      <div className="input-group" >
        <input
          type="checkbox"
          id={settingName}
          checked={value}
          onChange={ e => onChange(settingName, e.target.checked) }/>
      </div>
    </div>
  );
};

const Slider = ({settingName, value, propType, onChange}) => {

  const {max = 100} = propType;

  return (
    <div key={settingName}>
      <div className="input-group" >
        <div>
          <input
            type="range"
            id={settingName}
            min={0} max={max} step={max / 100}
            value={value}
            onChange={ e => onChange(settingName, Number(e.target.value)) }/>
        </div>
      </div>
    </div>
  );
};
