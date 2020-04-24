import React, { Component } from "react";
import "./ImmigrationServices.css";
import * as helpers from "../../../../helpers/helpers";
import ThemePopupContent from "../themeComponents/ThemePopupContent";
import url from "url";
import GeoJSON from "ol/format/GeoJSON.js";
import { unByKey } from "ol/Observable.js";
import information from "./information.png";
import Collapsible from "react-collapsible";

class ImmigrationLayerToggler extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: props.layerConfig.visible,
      layer: this.initLayer(),
      styleUrl: null,
      recordCount: null,
      panelOpen: props.layerConfig.expanded,
    };
  }

  // GET LAYER
  initLayer = () => {
    const layer = helpers.getImageWMSLayer(
      url.resolve(this.props.layerConfig.serverUrl, "wms"),
      this.props.layerConfig.layerName,
      "geoserver",
      null,
      50
    );
    layer.setVisible(this.props.layerConfig.visible);
    layer.setZIndex(this.props.layerConfig.zIndex);
    layer.setProperties({
      name: this.props.layerConfig.layerName,
      disableParcelClick: true,
    });
    window.map.addLayer(layer);
    return layer;
  };

  // GET LEGEND & RECORD COUNT
  componentDidMount() {
    // LEGEND
    const styleUrlTemplate = (serverURL, layerName, styleName) =>
      `${serverURL}/wms?REQUEST=GetLegendGraphic&VERSION=1.1&FORMAT=image/png&WIDTH=20&HEIGHT=20&TRANSPARENT=true&LAYER=${layerName}&STYLE=${
        styleName === undefined ? "" : styleName
      }`;
    const styleUrl = styleUrlTemplate(
      this.props.layerConfig.serverUrl,
      this.props.layerConfig.layerName,
      this.props.layerConfig.legendStyleName
    );
    this.setState({ styleUrl: styleUrl });

    // RECORD COUNT
    helpers.getWFSLayerRecordCount(
      this.props.layerConfig.serverUrl,
      this.props.layerConfig.layerName,
      (count) => {
        this.setState({ recordCount: count });
      }
    );

    this.mapClickEvent = window.map.on("click", (evt) => {
      if (window.isDrawingOrEditing) return;

      var viewResolution = window.map.getView().getResolution();
      var url = this.state.layer
        .getSource()
        .getFeatureInfoUrl(evt.coordinate, viewResolution, "EPSG:3857", {
          INFO_FORMAT: "application/json",
        });
      if (url) {
        helpers.getJSON(url, (result) => {
          const features = result.features;
          if (features.length === 0) {
            return;
          }
          const geoJSON = new GeoJSON().readFeatures(result);
          const feature = geoJSON[0];
          const entries = Object.entries(feature.getProperties());
          window.popup.show(
            evt.coordinate,
            <ThemePopupContent
              key={helpers.getUID()}
              values={entries}
              popupLogoImage={this.props.config.popupLogoImage}
              layerConfig={this.props.layerConfig}
            />,
            this.props.layerConfig.displayName
          );
        });
      }
    });

    // this._isMounted = false;
  }

  // TURN ON/OFF THE LAYERS
  onCheckboxChange = (evt) => {
    this.setState({ visible: evt.target.checked });
    this.state.layer.setVisible(evt.target.checked);
  };

  // ON LAYER HEADER CLICK
  onHeaderClick = () => {
    this.setState({ panelOpen: !this.state.panelOpen });
  };

  // ON MAP WINDOW CLICK
  itemClick = (feature) => {
    helpers.getGeometryCenter(feature.getGeometry(), (center) => {
      // SHOW POPUP
      const entries = Object.entries(feature.getProperties());
      window.popup.show(
        center.flatCoordinates,
        <ThemePopupContent
          key={helpers.getUID()}
          values={entries}
          popupLogoImage={this.props.config.popupLogoImage}
          layerConfig={this.props.layerConfig}
        />
      );
      helpers.zoomToFeature(feature, false);
      window.map.getView().setZoom(15);
    });
  };

  // REMOVE THE LAYERS ONCE CLOSE THE PANEL
  componentWillUnmount() {
    window.map.removeLayer(this.state.layer);
    unByKey(this.mapClickEvent);
    this._isMounted = false;
  }

  render() {
    return (
      <div
        className={
          this.state.visible
            ? "sc-immigration-data-list-container"
            : "sc-hidden"
        }
      >
        <div
          className={
            this.state.panelOpen
              ? "sc-immigration-data-list-header open"
              : "sc-immigration-data-list-header"
          }
          onClick={this.onHeaderClick}
        >
          <div className="sc-immigration-data-list-header-symbol">
            <img src={this.state.styleUrl} alt="style" />
          </div>
          <div
            className={
              this.props.layerConfig.boxStyle === undefined ||
              !this.props.layerConfig.boxStyle
                ? ""
                : "sc-immigration-layer-toggler-label-with-box-container"
            }
          >
            <label
              className={
                this.props.layerConfig.boxStyle === undefined ||
                !this.props.layerConfig.boxStyle
                  ? "sc-immigration-layer-toggler-label"
                  : "sc-immigration-layer-toggler-label-with-box"
              }
            >
              <input
                type="checkbox"
                checked={this.state.visible}
                style={{ verticalAlign: "middle" }}
                onChange={this.onCheckboxChange}
              />
              {this.props.layerConfig.displayName}
            </label>
            <label
              className={
                this.props.layerConfig.boxStyle === undefined ||
                !this.props.layerConfig.boxStyle
                  ? "sc-immigration-layer-toggler-count"
                  : "sc-immigration-layer-toggler-count-with-box"
              }
            >
              {" (" + this.state.recordCount + ")"}
            </label>
            <label className="sc-immigration-layer-icon">
              <img src={information} alt="informationicon" />
            </label>
          </div>
          <div
            className={
              this.state.panelOpen
                ? "sc-immigration-data-list-item-container"
                : "sc-hidden"
            }
          >
            {this.props.layerConfig.description}
          </div>
        </div>
      </div>
    );
  }
}

export default ImmigrationLayerToggler;
