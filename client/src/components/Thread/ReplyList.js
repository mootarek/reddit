import Reply from './Reply';
import React from 'react';

const ReplyList = props => {
  if (props.limit) {
    return (
      <div>
        {props.replies && props.replies.slice(0, props.limit).map(reply => (
          <div key={reply._id} className='Reply_wrapper'>
            <Reply reply={reply} />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div>
      {props.replies && props.replies.map(reply => (
        <div key={reply._id} className='Reply_wrapper'>
          <Reply className="reply" reply={reply} />
        </div>
      ))}
    </div>
  );
};

export default ReplyList;