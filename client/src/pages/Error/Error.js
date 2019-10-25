import React from 'react';
import { connect } from 'react-redux';

class Error extends React.Component {

    static mapStateToProps({ error }) {
        return { error };
    }

    render() {
        const error = this.props.error || {
            message: 'An unknown error occurred.'
        };
        return (
            <h3>{error.message}</h3>
        )
    }
}

export default connect(Error.mapStateToProps)(Error);
