import React from 'react';
import './ErrorScreen.scss';

/**
 * Presentational component for displaying errors to the user in a friendly way
 */
export default class ErrorScreen extends React.Component {

    render() {
        const { errors } = this.props;

        return (
            <div className="error-screen-container">
                <h1>
                    Oops! An error occurred...
                </h1>
                <p>
                    An error occurred while processing your request.
                </p>
                {errors.map((error) => (
                    <p
                        className="font-weight-bold"
                        key={error.id}
                    >
                        {error.message}
                    </p>
                ))}
            </div>
        );
    }
}