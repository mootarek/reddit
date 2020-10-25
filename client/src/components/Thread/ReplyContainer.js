import ReplyInput from './ReplyInput';
import ReplyList from './ReplyList';
import React from 'react';

const ReplyContainer = (props) => {
    if (props.showInput) {
        return (
            <div className="col-xs-12 col-md-8 offset-md-2">
                <ReplyList
                    replies={props.replies}
                    id={props._id} />
                <div>
                    <ReplyInput reply={props.replies[0]} />  { /* Just the first reply all of them have the same board_name and thread_id
                                                             which is used to post a reply  */}
                </div>
            </div>
        );
    }
    return (
        <div className="col-xs-12 col-md-8 offset-md-2">
            <ReplyList
                replies={props.replies} limit={props.limit} />
        </div>
    )
};

export default ReplyContainer;
