import React, { Component } from 'react';
import {Link} from 'react-router-dom'

class NotFound extends Component {
    state= { }
    render() {
        return(
            <div>
                <h1>404 Not-Found</h1>
                <Link to="/">
                    <button>Home</button>
                </Link>
            </div>
        )
    }
}

export default NotFound