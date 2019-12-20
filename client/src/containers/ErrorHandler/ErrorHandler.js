import React from 'react';
import { connect } from 'react-redux';
import { removeError } from '../../actions/errors';
import ErrorScreen from '../../components/Error/ErrorScreen/ErrorScreen';

/**
 * Container for errors which renders the page content if there are no errors, otherwise
 * renders the most recent error on the page (like a 404 page for example)
 * For more minor errors, you should just log them in the console or dispatch a Toast to let the user know
 */
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
                <ErrorScreen errors={errors}/>
            );
        }

        return (<div className="h-100">{children}</div>);
    }
}

export default connect(ErrorHandler.mapStateToProps)(ErrorHandler);
