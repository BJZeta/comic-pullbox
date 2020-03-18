import React, { Fragment, useEffect } from "react";
import Spinner from "../layout/Spinner";
import { connect } from "react-redux";
import { getProfiles } from "../../actions/profile";
import PropTypes from "prop-types";

const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
  useEffect(() => {
    getProfiles();
  }, []);

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">Profiles</h1>
          <p className="lead">
            <i className="fab fa-connectdevelop">
              {" "}
              Browse and connect with other users{" "}
            </i>
          </p>
          <div className="profiles"></div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
