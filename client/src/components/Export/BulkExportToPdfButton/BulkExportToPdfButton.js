import React from 'react';
import Button from 'react-bootstrap/Button';
import {bulkExportToPdf} from '../../../utils/export-util';

/**
 * Presentational component for a button that exports bulk data to PDF
 */
export default class BulkExportToPdfButton extends React.Component {

    handleClick() {
        const { fields, data, exportTitle } = this.props;
        bulkExportToPdf(fields, data, exportTitle)
    }

    render() {
        const { className } = this.props;

        return (
            <Button variant="light" className={className} onClick={() => this.handleClick()}>
                Export All to PDF
            </Button>
        );
    }
}
