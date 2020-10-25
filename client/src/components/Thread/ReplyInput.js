import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import { ADD_REPLY } from '../../constants/actiontypes';

const mapDispatchToProps = dispatch => ({
  onSubmit: payload =>
    dispatch({ type: ADD_REPLY, payload })
 
});

class ReplyInput extends React.Component {
  constructor() {
    super();
    this.state = {
      text: '',
      delete_password: ''
    };

    this.setBody = ev => {
      this.setState({ text: ev.target.value });
    };

    this.setDeletePassword = ev => {
      this.setState({ delete_password: ev.target.value });
    }

    this.createReply = ev => {
      ev.preventDefault();
      const payload = agent.Replies.post(this.props.reply.board_name, this.props.reply.thread_id,
        { 
          text: this.state.text,
          delete_password: this.state.delete_password
         });
      this.setState({ text: '', delete_password: ''});
      this.props.onSubmit(payload);
    };
  }

  render() {
    return (
      <form className="card Reply-form" onSubmit={this.createReply}>
        <div className="card-block">

          <textarea className="form-control"
            placeholder="Write a Reply..."
            value={this.state.text}
            onChange={this.setBody}
            rows="3">
          </textarea>
          <input className="form-control"
            placeholder="Write the Reply password "
            value={this.state.delete_password}
            onChange={this.setDeletePassword}>

          </input>
        </div>
        <div className="card-footer">
          <button
            className="btn btn-sm btn-primary"
            type="submit">
            Post Reply
          </button>
        </div>
      </form>
    );
  }
}

export default connect(() => ({}), mapDispatchToProps)(ReplyInput);