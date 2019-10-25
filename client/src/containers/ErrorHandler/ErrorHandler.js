import React from 'react';
import { connect } from 'react-redux';
import { addToast, errorLogged, removeError } from '../../actions';

class ErrorHandler extends React.Component {

    static mapStateToProps(state) {
        return {
            errors: state.errors
        };
    }

    render() {

        const { errors, children, dispatch } = this.props;
        const highSeverityErrors = [];

        for (let error of errors) {
            if (!error) continue;
            // High severity errors need to be displayed below, even if they've been logged already
            if (error.severity === 'high') highSeverityErrors.push(error);
            // If the error has already been logged to console, skip it
            if (error.logged) continue;
            console.error(`[Severity ${error.severity.toUpperCase()}]: ${error.message}`);
            // Update the redux store to indicate that the error has been logged
            dispatch(errorLogged(error.id));

            // For medium severity, show a toast
            if (error.severity === 'medium') {
                dispatch(addToast({
                    header: (<span className="font-weight-bold mr-auto">An error occurred</span>),
                    body: (<p>{error.message}</p>),
                    variant: 'danger'
                }));
            }
        }

        if (highSeverityErrors.length > 0) {
            if (highSeverityErrors.length > 1) {
                const oldErrors = highSeverityErrors.splice(1);
                for (let error of oldErrors) {
                    dispatch(removeError(error.id));
                }
            }
            return (
                <div>
                    {highSeverityErrors.map(error => (
                        <div className="h1 text-center" key={error.id}>{error.message}</div>
                    ))}
                </div>
            );
        }

        return (<div>{children}</div>);
    }
}

export default connect(ErrorHandler.mapStateToProps)(ErrorHandler);
