import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const propTypes = {
  searchPlacesByQuery: PropTypes.func.isRequired
};

const StyledDescription = styled.div`
  font-size: 14px;
  color: ${props => props.theme.labelColorLT};
  line-height: 18px;
  margin-bottom: 12px;
`;

const InputForm = styled.div`
  flex-grow: 1;
  padding: 32px;
  background-color: ${props => props.theme.panelBackgroundLT};
`;

const StyledInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.inputPadding};
  color: ${props => props.theme.titleColorLT};
  height: ${props => props.theme.inputBoxHeight};
  border: 0;
  outline: 0;
  font-size: ${props => props.theme.inputFontSize};
  
  :active,
  :focus,
  &.focus,
  &.active {
    outline: 0;
  }
`;
const StyledFromGroup = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
`;

const StyledFromGroupItem = styled.div`
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  //justify-content: flex-end;
`;

export const StyledInputLabel = styled.div`
  font-size: 11px;
  color: ${props => props.theme.textColorLT};
  letter-spacing: 0.2px;
  ul {
    padding-left: 12px;
  }
`;
export const StyledBtn = styled.button`
  background-color: ${props => props.theme.primaryBtnActBgd};
  color: ${props => props.theme.primaryBtnActColor};
  border: none;
  min-height: 32px;
  min-width: 64px;
  cursor: pointer;
`;

class LoadGooglePlacesModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: null,
      radius: null,
      location: null
    };
  }

  _onParamChange = (key, value) => {
    this.setState({
      [key]: value
    });
  };

  _onSubmit = () => {
    const location = this.state.location ? this.state.location.split(',').map(value => {
      const intValue = parseInt(value);
      return intValue === isNaN(intValue) ? intValue : 0
    }) : undefined;

    this.props.searchPlacesByQuery({
      query: this.state.query,
      radius: this.state.radius,
      location
    });
  };

  render() {
    return (
      <div>
        <InputForm>
          <StyledDescription>Find places using any word you like! (powered by Google Places APIs)</StyledDescription>
          <StyledFromGroup>
            <StyledFromGroupItem>
              <StyledInputLabel>Search</StyledInputLabel>
              <StyledInput
                onChange={event => this._onParamChange('query', event.target.value)}
                type="text"
                placeholder="Provide any word you like"
              />
            </StyledFromGroupItem>
            <StyledFromGroupItem>
              <StyledInputLabel>Radius (meters = 500 default) [optional]</StyledInputLabel>
              <StyledInput
                onChange={event => this._onParamChange('radius', event.target.value)}
                type="text"
                placeholder="Radius of your search"
              />
            </StyledFromGroupItem>
            <StyledFromGroupItem>
              <StyledInputLabel>Location (lat, lng) [optional]</StyledInputLabel>
              <StyledInput
                onChange={event => this._onParamChange('location', event.target.value)}
                type="text"
                placeholder="Latitude, Longitude"
              />
            </StyledFromGroupItem>
            <StyledFromGroupItem>
              <StyledBtn type="submit" onClick={this._onSubmit}>
                Fetch
              </StyledBtn>
            </StyledFromGroupItem>
          </StyledFromGroup>
          <div id="map"></div>
        </InputForm>
      </div>
    );
  }
}

LoadGooglePlacesModal.propTypes = propTypes;

export default LoadGooglePlacesModal;
