import React, { Fragment, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addComic } from "../../actions/profile";

const AddComic = ({ addComic, history }) => {
  const [formData, setFormData] = useState({
    title: "",
    available: "Pending",
    from: "",
    to: null,
    fullSubscription: false,
    currentIssue: "Pending"
  });

  const [fullSubDisabled, toggleDisabled] = useState(false);

  const { title, fullSubscription, from, to } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <Fragment>
      <h1 className="large text-primary">
        Request a Comic to add into your Pullbox
      </h1>
      <small>* = required field</small>
      <form
        className="form"
        onSubmit={e => {
          e.preventDefault();
          addComic(formData, history);
        }}
      >
        <div className="form-group">
          <input
            type="text"
            placeholder="* Title"
            name="title"
            value={title}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <h4>From What Issue</h4>
          <input
            type="text"
            name="from"
            value={from}
            onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">
          <p>
            <input
              type="checkbox"
              name="fullSubscription"
              checked={fullSubscription}
              value={fullSubscription}
              onChange={e => {
                setFormData({
                  ...formData,
                  fullSubscription: !fullSubscription
                });
                toggleDisabled(!fullSubDisabled);
              }}
            />{" "}
            Full Subscription
          </p>
        </div>
        <div className="form-group">
          <h4>To Issue</h4>
          <input
            type="text"
            name="to"
            value={to}
            onChange={e => onChange(e)}
            disabled={fullSubDisabled ? "disabled" : ""}
          />
        </div>
        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

AddComic.propTypes = {
  addComic: PropTypes.func.isRequired
};

export default connect(null, { addComic })(withRouter(AddComic));
