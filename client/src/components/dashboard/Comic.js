import React, { Fragment } from "react";
import { connect } from "react-redux";
import { deleteComic } from "../../actions/profile";
import PropTypes from "prop-types";

const Comic = ({ comic, deleteComic }) => {
  const comics = comic.map(issue => (
    <tr key={issue._id}>
      <td>{issue.title}</td>
      <td className="hide-sm">{issue.currentIssue}</td>
      <td>
        {issue.from} - {issue.to === null ? " Latest Issue" : issue.to}
      </td>
      <td>
        <button
          onClick={() => deleteComic(issue._id)}
          className="btn btn-danger"
        >
          Delete
        </button>
      </td>
    </tr>
  ));

  return (
    <Fragment>
      <h2 className="my-2">My Pullbox</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th className="hide-sm">Currently Inside</th>
            <th className="hide-sm">Issues</th>
            <th />
          </tr>
        </thead>
        <tbody>{comics}</tbody>
      </table>
    </Fragment>
  );
};

Comic.propTypes = {
  comic: PropTypes.array.isRequired,
  deleteComic: PropTypes.func.isRequired
};

export default connect(null, { deleteComic })(Comic);
