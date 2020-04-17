import React, { Component } from "react";
import ThemeLayers from "../themeComponents/ThemeLayers.jsx";
import * as helpers from "../../../../helpers/helpers";
import ImmigrationLayers from "./ImmigrationLayers";

class Container extends Component {
  state = {};

  // CALLED FROM LAYERS.  CALL THEME DATA THROUGH A REF TO PASS ON THE CHANGE FOR VISIBLITY
  onLayerVisibilityChange = (layer) => {
    this.data.onLayerVisibilityChange(layer);
  };

  componentDidMount() {
    // DISABLE PARCEL CLICK
    //if (this.props.config.disableParcelClick !== undefined && this.props.config.disableParcelClick)
    //window.disableParcelClick = true;
  }

  componentWillUnmount() {
    // RE-ENABLE PARCEL CLICK
    window.disableParcelClick = false;
  }

  render() {
    return (
      <div className="sc-theme-container">
        <ImmigrationLayers
          config={this.props.config}
          onLayerVisiblityChange={(layer) => {
            this.onLayerVisibilityChange(layer);
          }}
        />
      </div>
    );
  }
}

export default Container;
