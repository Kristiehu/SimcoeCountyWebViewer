import React, { Component } from "react";
import * as helpers from "../../../../helpers/helpers";
import ImmigrationDataList from "./ImmigrationDataList";

class ImmigrationData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      onlyFeaturesWithinMap: false,
    };
    this.layerRefs = [];
  }

  // THIS FUNCTION IS CALLED FROM PARENT THROUGH A REF
  onLayerVisibilityChange = (layer) => {
    // LET ALL THE THEMEDATALIST COMPONENTS KNOW A LAYER HAS CHANGED VISIBLITY
    this.layerRefs.forEach((dataList) => {
      if (dataList !== null) dataList.onLayerVisibilityChange(layer);
    });
  };

  onCheckboxChange = (evt) => {
    this.setState({ onlyFeaturesWithinMap: evt.target.checked });
  };

  render() {
    return (
      <div className="sc-theme-data-container">
        {/* <div className="sc-title sc-underline">THEME DATA</div> */}

        <div>
          {this.props.config.toggleLayers.map((layerConfig) => (
            <ImmigrationDataList
              key={helpers.getUID()}
              config={this.props.config}
              layerConfig={layerConfig}
              ref={(data) => {
                this.layerRefs.push(data);
              }}
              onlyFeaturesWithinMap={this.state.onlyFeaturesWithinMap}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default ImmigrationData;
