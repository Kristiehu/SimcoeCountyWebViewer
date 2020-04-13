import React, { Component } from "react";
import "./ImmigrationServices.css";
import * as helpers from "../../../../helpers/helpers";
import * as config from "./config.json";
import PanelComponent from "../../../PanelComponent";
import ThemeContainer from "../themeComponents/ThemeContainer.jsx";

class ImmigrationServices extends Component {
  state = {};

  onClose = () => {
    // ADD CLEAN UP HERE (e.g. Map Layers, Popups, etc)

    // CALL PARENT WITH CLOSE
    this.props.onClose();
  };

  render() {
    return (
      <PanelComponent
        onClose={this.onClose}
        name={this.props.name}
        type="themes"
      >
        <div classname="container"
        <div className="sc-theme-immigration-service-main-container">
          Explore resources to help newcomers: housing support services,
          settlement services, Employment Ontario services, libraries, an
          Ontario Early Years centres, Service Ontario and Service Canada.
          <div className="sc-title sc-underline">Support Services</div>
        </div>
      </PanelComponent>
    );
  }
}

export default ImmigrationServices;
