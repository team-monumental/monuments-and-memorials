import React from 'react';
import './Spinner.scss';
import {Spinner as BootstrapSpinner} from 'react-bootstrap';

/**
 * Wraps the react-bootstrap Spinner with some extra styling to make it a full-page spinner
 */
export default class Spinner extends React.Component {
    render() {
        const {show} = this.props;
        if (!show) return (<div/>);
        return (
            <div className="spinner-container">
                <BootstrapSpinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </BootstrapSpinner>
            </div>
        );
    }
}