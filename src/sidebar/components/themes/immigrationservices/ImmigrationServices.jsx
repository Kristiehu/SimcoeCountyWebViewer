import React, { Component } from "react";
import "./ImmigrationServices.css";
import * as helpers from "../../../../helpers/helpers";
import * as config from "./config.json";
import PanelComponent from "../../../PanelComponent";
import ImmigrationContainer from "./ImmigrationContainer.jsx";

class ImmigrationServices extends Component {
  state = {};

  onClose = () => {
    this.props.onClose();
  };

  render() {
    return (
      <PanelComponent
        onClose={this.onClose}
        name={this.props.name}
        type="themes"
      >
        <div className="sc-immigration-service-main-container">
          <div className="sc-immigration-text-box">
            Explore resources to help newcomers: housing support services,
            settlement services, Employment Ontario services, libraries, an
            Ontario Early Years centres, Service Ontario and Service Canada.
          </div>
          <ImmigrationContainer config={config.default} />
        </div>
      </PanelComponent>
    );
  }
}

export default ImmigrationServices;
