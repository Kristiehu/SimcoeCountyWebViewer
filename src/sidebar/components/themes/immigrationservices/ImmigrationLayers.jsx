import React from "react";
import * as helpers from "../../../../helpers/helpers";
import ThemeLayerToggler from "../themeComponents/ThemeLayerToggler.jsx";

const ImmigrationLayers = (props) => {
  return (
    <div className="sc-theme-layers-container">
      <div className="sc-title sc-underline">SUPPORT SERVICES</div>
      <div className="sc-container">
        {props.config.toggleLayers.map((layerConfig) => (
          <ThemeLayerToggler
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
