import React, { Component } from "react";
import "./ImmigrationServices.css";
import * as helpers from "../../../../helpers/helpers";
import ImmigrationLayers from "./ImmigrationLayers.jsx";
// import ImmigrationData from "./ImmigrationData.jsx";

class ImmigrationContainer extends Component {
  state = { onlyFeaturesWithinMap: false };

  // CALLED FROM LAYERS.  CALL THEME DATA THROUGH A REF TO PASS ON THE CHANGE FOR VISIBLITY
  onLayerVisibilityChange = (layer) => {
    this.data.onLayerVisibilityChange(layer);
  };

  onCheckboxChange = (evt) => {
    this.setState({ onlyFeaturesWithinMap: evt.target.checked });
  };

  componentWillUnmount() {
    // RE-ENABLE PARCEL CLICK
    window.disableParcelClick = false;
  }

  render() {
    return (
      <div className="sc-immigration-container">
        <ImmigrationLayers
          config={this.props.config}
          onLayerVisiblityChange={(layer) => {
            this.onLayerVisibilityChange(layer);
          }}
        />
        {/* <ImmigrationData
          config={this.props.config}
          ref={(data) => {
            this.data = data;
          }}/> */}
      </div>
    );
  }
}

export default ImmigrationContainer;
