import ReplyContainer from './ReplyContainer';
import React, { useState, useEffect } from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import { DELETE_THREAD, REPORT_THREAD, GET_FOR_PREVIEW } from '../../constants/actiontypes';

const mapStateToProps = state => ({
  thread: { ...state.thread }
})

const mapDispatchToProps = dispatch => ({
  onLoad: (payload) =>
    dispatch({ type: GET_FOR_PREVIEW, payload }),
  del: (payload) =>
    dispatch({ type: DELETE_THREAD, payload }),
  put: (payload) =>
    dispatch({ type: REPORT_THREAD, payload }),
});

const Thread = props => {
  const [password, setPassword] = useState('');
  const [incorrect, serIncorrect] = useState(false)

  const handleChange = (e) => {
    setPassword(e.target.value);
  }
  const handleSubmission = async () => {
    const data = password;
    setPassword('');
    const payload = await agent.Threads.delete(props.match.params.board, parseFloat(props.match.params.thread_id), data);
    if (payload.id === -1) {
      serIncorrect(true)
    }
    props.del(payload);
  }


  useEffect(() => {
    const getThread = async () => {
      const payload = await agent.Threads.get(props.match.params.board, props.match.params.thread_id)
      props.onLoad(payload)
    }

    getThread()
  }, props.thread);

  // Thraed individual page Upon Redirecting or Clicking to the thread's Link 
  return (
    <div className="thread-page">

      <div className="banner">
        <div className="container">
          <h2>{props.thread.text}</h2>
          <span className="date-posted">
            {new Date(props.thread.created_on).toDateString()}
          </span>


          <p>
            REPORT THE THREAD:
          <button onClick={() => props.put(agent.Threads.put(props.match.params.board, props.match.params.thread_id))}>Report</button>
          </p>

          <p>
            Type the password to delete the thread:
          <input type='text' name='delete_pass' onChange={(e) => handleChange(e)} value={password} />
          </p>
          {incorrect ? <p>Incorrect Thread Password</p> : ''}
          <p>
            <button onClick={() => handleSubmission()}>Submit</button>
          </p>
        </div>
      </div>

      <div className="row">
        <ReplyContainer
          replies={props.thread.replies || []} showInput={true}/>
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Thread);
