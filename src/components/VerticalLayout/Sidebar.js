import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import withRouter from "components/Common/withRouter";

//i18n
import { withTranslation } from "react-i18next";
import SidebarContent from "./SidebarContent";

import { Link } from "react-router-dom";

import logo from "../../assets/images/vijayho-logo-5.jpg";
import logoLightPng from "../../assets/images/vijayho-logo-5.jpg";
import logoLightSvg from "../../assets/images/vijayho-logo-5.jpg";
import logoDark from "../../assets/images/vijayho-logo-5.jpg";

const Sidebar = props => {

  return (
    <React.Fragment>
      <div className="vertical-menu">
        <div className="navbar-brand-box mt-3">
          <Link to="/" className="logo logo-dark">
            <span className="logo-sm">
              <img src={logo} alt="" style={{height:"65px", width:"120px"}}/>
            </span>
            <span className="logo-lg">
              <img src={logoDark} alt="" style={{height:"65px", width:"120px"}}/>
            </span>
          </Link>

          <Link to="/" className="logo logo-light ">
            <span className="logo-sm">
              <img src={logoLightSvg} alt="" style={{height:"65px", width:"140px"}}/>
            </span>
            <span className="logo-lg">
              <img src={logoLightPng} alt=""style={{height:"65px", width:"140px"}} />
            </span>
          </Link>
        </div>
        <div data-simplebar className="h-100">
          {props.type !== "condensed" ? <SidebarContent /> : <SidebarContent />}
        </div>
        <div className="sidebar-background"></div>
      </div>
    </React.Fragment>
  );
};

Sidebar.propTypes = {
  type: PropTypes.string,
};

const mapStatetoProps = state => {
  return {
    layout: state.Layout,
  };
};
export default connect(
  mapStatetoProps,
  {}
)(withRouter(withTranslation()(Sidebar)));
