import React, { Fragment, useEffect } from "react";
import Spinner from "../layout/Spinner";
import { connect } from "react-redux";
import { getProfiles } from "../../actions/profile";
import PropTypes from "prop-types";

const Posts = ({ getProfiles, profile: { profiles, loading } }) => {
  useEffect(() => {
    getProfiles();
  }, []);

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">Posts</h1>
          <p className="lead">
            <i className="fab fa-connectdevelop">
              {" "}
              Check out the latest news from your shop (Coming Soon){" "}
            </i>
          </p>
          <div className="profiles"></div>
        </Fragment>
      )}
    </Fragment>
  );
};

Posts.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps, { getProfiles })(Posts);
