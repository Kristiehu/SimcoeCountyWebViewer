import React, { Component } from "react";
import "./ImmigrationServices.css";
import * as helpers from "../../../../helpers/helpers";
import ThemePopupContent from "../themeComponents/ThemePopupContent";
import url from "url";
import GeoJSON from "ol/format/GeoJSON.js";
import { getCenter } from "ol/extent";
import { unByKey } from "ol/Observable.js";

class ImmigrationLayerToggler extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: props.layerConfig.visible,
      layer: this.initLayer(),
      styleUrl: null,
      recordCount: null,
      panelOpen: props.layerConfig.expanded,
      features: [],
      onlyFeaturesWithinMap: props.onlyFeaturesWithinMap,
    };
  }

  handleUrlParameter = () => {
    if (this.props.layerConfig.UrlParameter === undefined) return;

    const urlParam = helpers.getURLParameter(
      this.props.layerConfig.UrlParameter.parameterName
    );
    if (urlParam === null) return;

    const query =
      this.props.layerConfig.UrlParameter.fieldName + "=" + urlParam;
    helpers.getWFSGeoJSON(
      this.props.layerConfig.serverUrl,
      this.props.layerConfig.layerName,
      (result) => {
        if (result.length === 0) return;

        const feature = result[0];
        const extent = feature.getGeometry().getExtent();
        const center = getCenter(extent);
        helpers.zoomToFeature(feature);
        const entries = Object.entries(feature.getProperties());
        window.popup.show(
          center,
          <ThemePopupContent
            key={helpers.getUID()}
            values={entries}
            popupLogoImage={this.props.mainConfig.popupLogoImage}
            layerConfig={this.props.layerConfig}
          />,
          this.props.layerConfig.displayName
        );
      },
      null,
      null,
      query
    );
  };

  initLayer = () => {
    // GET LAYER
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

  componentDidMount() {
    // GET LEGEND
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

    // GET RECORD COUNT
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

    // URL PARAMETERS
    this.handleUrlParameter();

    // Immigration Data List==============================================
    this._isMounted = true;

    // GET FEATURES
    this.fetchFeatures();

    // Immigration Data List==============================================
  }

  onCheckboxChange = (evt) => {
    this.setState({ visible: evt.target.checked });
    this.state.layer.setVisible(evt.target.checked);
    this.props.onLayerVisiblityChange(this.state.layer);
  };

  // Immigration Data List==============================================

  fetchFeatures = () => {
    if (!this._isMounted) return;

    if (this.state.onlyFeaturesWithinMap) {
      const extent = window.map.getView().calculateExtent();
      helpers.getWFSGeoJSON(
        this.props.layerConfig.serverUrl,
        this.props.layerConfig.layerName,
        (result) => {
          this.setState({ features: result });
        },
        this.props.layerConfig.displayFieldName,
        extent
      );
    } else {
      helpers.getWFSGeoJSON(
        this.props.layerConfig.serverUrl,
        this.props.layerConfig.layerName,
        (result) => {
          this.setState({ features: result });
        },
        this.props.layerConfig.displayFieldName
      );
    }
  };

  onHeaderClick = () => {
    this.setState({ panelOpen: !this.state.panelOpen });
  };

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

  // Immigration Data List==============================================

  componentWillUnmount() {
    // CLEAN UP
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
            {/* <div style={{ paddingTop: "12px", width: "90%" }}>
              {this.props.layerConfig.displayName}
            </div> */}
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

        {/* <div>{this.props.children}</div> */}
      </div>
    );
  }
}

export default ImmigrationLayerToggler;
