import DeleteButton from './DeleteButton';
import ReportButton from './ReportButton';
import React from 'react';

const Reply = props => {
  const reply = props.reply;

  return (
    <div className="card">
      <div className="card-block">
        <span className="date-posted">
          {new Date(reply.created_on).toDateString()}
        </span>
                &nbsp;  &nbsp;  &nbsp;  &nbsp; <span className="card-text">{reply.text}</span>
      </div>
      <br></br>
      <DeleteButton reply={reply} /> 
      <br></br>
      <ReportButton reply={reply} /> 
      <br></br>
    </div>
  );
};

export default Reply;