import React, { Component } from 'react'
import { connect } from 'react-redux'
import agent from '../agent'
import StackedReview from './Thread/StackedReview'

import {
    BOARD_PAGE_LOADED,
    BOARD_PAGE_UNLOADED,
    THREAD_SUBMITTED
} from '../constants/actiontypes'


const mapStateToProps = state => ({

    board: {...state.board},
    ...state.threadList,
    thread: {...state.thread}

})


const mapDispatchToProps = dispatch => ({
    onLoad: (payload) => {
        dispatch({ type: BOARD_PAGE_LOADED, payload })
    },
    onUnLoad: () => {
        dispatch({ type: BOARD_PAGE_UNLOADED })
    },
    submit: (payload) => {
        dispatch({ type: THREAD_SUBMITTED, payload })
    },

})
export class Board extends Component {

    constructor(props) {
        super(props)

        this.state = {
            text: '',
            delete_password: '',
            pleaseFillOut: false,
            submitted: false
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleText = this.handleText.bind(this)
        this.handlePassword = this.handlePassword.bind(this)
    }

    handleSubmit(ev) {
        ev.preventDefault();
        if (this.state.text !== '' && this.state.delete_password !== '') {
 
            const payload = agent.Threads.post(this.props.match.params.board,
                    {
                    text: this.state.text,
                    delete_password: this.state.delete_password
                    }
            )

            this.props.submit(payload);
            
            this.setState({
                text: '',
                delete_password: '',
                submitted: true
            });
        } else {
            this.setState({
                pleaseFillOut: true,
            })
        }
    }
    handleText(ev) {
        this.setState({
            text: ev.target.value,
        })
    }
    handlePassword(ev) {
        this.setState({
            delete_password: ev.target.value,
        })
    }
    componentDidMount() {
        this.props.onLoad(Promise.all([
            agent.Threads.getAll(this.props.match.params.board),  // this.props.match.params.board is the board name 
            agent.Threads.post(this.props.match.params.board) 
        ]));
    }
    render() {
        var fillOut = <span>Please fill out the requirements</span>
        let redirectThread;
        if (this.state.submitted) {
             redirectThread = this.state.pleaseFillOut ? fillOut : this.props.history.push(`/b/${this.props.match.params.board}/${this.props.thread._id}`)
        } else {
            redirectThread = <p>Enter submit to be redirected to the thread</p>
        }
        
        return (
            <div>
                
                {this.props.threads && this.props.threads.map((thread, i) => (
                        <div key={i} className='Thread_wrapper'>
                            <StackedReview thread={thread} board={this.props.board} />
                        </div>
                    ))}

                <form onSubmit={(e) => this.handleSubmit(e)} >
                    <div>
                        Type here The name of the thread:
                        <input value={this.state.text} type="text" onChange={this.handleText} />
                    </div>
                    <div>
                        Type here password of your thread:
                        <input value={this.state.delete_password} type="text" onChange={this.handlePassword} />
                    </div>
                    <button type='submit'>Submit</button>

                </form>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Board)







