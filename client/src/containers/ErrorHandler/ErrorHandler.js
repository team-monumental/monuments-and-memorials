import React from 'react';
import { connect } from 'react-redux';
import { removeError } from '../../actions/errors';

class ErrorHandler extends React.Component {

    static mapStateToProps(state) {
        return {
            errors: state.errors
        };
    }

    render() {

        const { errors, children, dispatch } = this.props;

        if (errors.length > 1) {
            const oldErrors = errors.splice(1);
            for (let error of oldErrors) {
                dispatch(removeError(error.id));
            }
        }

        if (errors.length > 0) {
            return (
                <div>
                    {errors.map(error => (
                        <div className="h1 text-center" key={error.id}>{error.message}</div>
                    ))}
                </div>
            );
        }

        return (<div>{children}</div>);
    }
}

export default connect(ErrorHandler.mapStateToProps)(ErrorHandler);
