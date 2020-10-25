import { Link } from 'react-router-dom'
import { HOME_PAGE_LOADED, CHECK_IF_BOARD } from '../constants/actiontypes'
import React, { Component } from 'react'
import agent from '../agent'
import { connect } from 'react-redux'
import Board from './Board'

const mapStateToProps = state => ({
    ...state.boardList
})


const mapDispatchToProps = dispatch => ({
    onLoad: (payload) => {
        dispatch({ type: HOME_PAGE_LOADED, payload })
    },
    check: (payload) => {
        dispatch({ type: CHECK_IF_BOARD, payload })
    }
})

export class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            input: '',
            searchQuery: '',
            clicked: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleClick.bind(this)
    }

    handleChange(ev) {
        this.setState({
            input: ev.target.value,
        })
    }
    handleClick(ev) {
        ev.preventDefault()
        const searchQuery = this.state.input
        this.setState({
            clicked: true,
            final: searchQuery
        })

        this.props.check(agent.Boards.check(searchQuery))

    }

    componentWillMount() {
        this.props.onLoad(agent.Boards.getAll())
    }
    render() {
        const isClicked = this.state.clicked;
        let html;
        let other;
        let starter;
        if (isClicked) {
            html = <p>This board already exists Choose another name</p>
            other = <div>this Board name is available Do you want with this name
            <Link to={`/b/${this.state.final}/threads`}>{this.state.final}</Link>
            </div>
        } else {
            starter = <p>Let's Make some New Boards!</p>;
        }
        return (
            <div>
                <h1>Welcome To boards App</h1>

                <p className='$'>Here are a list of the trending boards have a look</p>
                <div className='boardList'>
                    {this.props.boards && this.props.boards.map((board, i) => (
                        <div key={i} className='linktoboard'>
                            <Link to={`/b/${board.name}/threads`}>
                                {board.name}
                            </Link>
                        </div>
                    ))}

                </div>

                <label>
                    Create A New Board:
                    <input type='text' value={this.state.input} onChange={(ev) => this.handleChange(ev)} />

                </label>

                <button onClick={(ev) => this.handleClick(ev)}>Search</button>
                {starter}
                
                {this.props.exists ? html : other}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
