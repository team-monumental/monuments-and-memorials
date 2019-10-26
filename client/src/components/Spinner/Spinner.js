import React from 'react';
import './Spinner.scss';
import { Spinner as BootstrapSpinner } from 'react-bootstrap';

export default class Spinner extends React.Component {
    render() {
        const { show } = this.props;
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