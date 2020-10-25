import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import { REPORT_REPLY } from '../../constants/actiontypes';




const mapDispatchToProps = dispatch => ({
  onClick: (payload) =>
    dispatch({ type: REPORT_REPLY, payload }),
  onLoad: () => 
    dispatch({type: '_blank_'})  
});


const ReportButton = props => {
  console.log(props)
  
  props.onLoad()

  const put = () => {
    const payload = agent.Replies.put(props.reply.board_name, props.reply._id);
    props.onClick(payload);

  };

    return (
      <button className="mod-options" onClick={put}>
        <i className="ion-danger-a"></i>
        Report %%button%%
      </button>
    );
};

export default connect(() => ({}), mapDispatchToProps)(ReportButton);