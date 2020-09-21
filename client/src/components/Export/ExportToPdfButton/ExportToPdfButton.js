import React from 'react';
import Button from 'react-bootstrap/Button';
import {exportToPdf} from '../../../utils/export-util';

/**
 * Presentational component for a button that exports data to CSV
 */
export default class ExportToCsvButton extends React.Component {

    handleClick() {
        const { fields, data, exportTitle } = this.props;
        exportToPdf(fields, data, exportTitle)
    }

    render() {
        const { className } = this.props;

        return (
            <Button variant="light" className={className} onClick={() => this.handleClick()}>
                Export to PDF
            </Button>
        );
    }
}
