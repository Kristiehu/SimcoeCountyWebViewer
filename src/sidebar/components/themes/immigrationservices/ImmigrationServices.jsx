import React, { Component } from "react";
import "./ImmigrationServices.css";
import * as helpers from "../../../../helpers/helpers";
import PanelComponent from "../../../PanelComponent";

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
        <div className="introduction">
          Explore resources to help newcomers: housing support services,
          settlement services, Employment Ontario services, libraries, and
          Ontario Early Years centres, Service Ontario and Service Canada
        </div>

        <div className="sc-theme-immigration-service-main-container">
          <div className="sc-title sc-underline">Support Services</div>
          <ThemeContainer config={config.default} />
        </div>
      </PanelComponent>
    );
  }
}

export default ImmigrationServices;
