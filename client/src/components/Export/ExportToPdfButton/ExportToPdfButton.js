import React from 'react';
import Button from 'react-bootstrap/Button';
import {exportToPdf} from '../../../utils/export-util';

/**
 * Presentational component for a button that exports data to PDF
 */
export default class ExportToPdfButton extends React.Component {

    handleClick() {
        const { fields, data, exportTitle } = this.props;
        exportToPdf(fields, data, exportTitle)
    }

    render() {
        const { className, data } = this.props;
        const text = data && data.length > 1 ? "Export all to PDF" : "Export to PDF"

        return (
            <Button variant="light" className={className} onClick={() => this.handleClick()}>
                {text}
            </Button>
        );
    }
}
