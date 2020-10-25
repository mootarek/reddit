import ReplyContainer from './ReplyContainer';
import React from 'react';
import { Link } from 'react-router-dom'

const Thread = (props) => {

  return (
    //Styling Here is diffrent it's one of million

    <div className="thread">

      <div className="banner">
        <div className="container">
          <h1><Link to={`/b/${props.board.board.name}/${props.thread._id}`}>{props.thread.text}</Link></h1>

          <span className="date-posted">
            {new Date(props.thread.created_on).toDateString()}
          </span>
        </div>

        <div className='row'>
            <ReplyContainer replies={props.thread.replies || []} showInput = {false} limit={5}/>
        </div>
      </div>

    </div>
  );
}


export default  Thread;
