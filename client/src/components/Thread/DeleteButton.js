import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import { DELETE_REPLY } from '../../constants/actiontypes';

const mapDispatchToProps = dispatch => ({
  onClick: (payload) =>
    dispatch({ type: DELETE_REPLY, payload})
});

const DeleteButton = props => {
  const del = () => {
    const payload = agent.Replies.delete(props.reply.board_name, props.reply._id);
    props.onClick(payload);
  };

    return (
      <button className="mod-options" onClick={del}>
        <i className="ion-trash-a"></i> Delete %%button%%
      </button>
    );

};

export default connect(() => ({}), mapDispatchToProps)(DeleteButton);