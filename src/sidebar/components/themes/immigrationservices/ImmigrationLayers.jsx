import React from "react";
import * as helpers from "../../../../helpers/helpers";
import ImmigrationLayerToggler from "./ImmigrationLayerToggler";

const ImmigrationLayers = (props) => {
  return (
    <div className="sc-theme-layers-container">
      <div className="sc-title sc-underline">SUPPORT SERVICES</div>
      <div className="sc-container">
        {props.config.toggleLayers.map((layerConfig) => (
          <ImmigrationLayerToggler
            key={helpers.getUID()}
            layerConfig={layerConfig}
            config={props.config}
            onLayerVisiblityChange={props.onLayerVisiblityChange}
          />
        ))}
      </div>
    </div>
  );
};

export default ImmigrationLayers;
