import React from 'react';
import Button from 'react-bootstrap/Button';
import { exportToCsv } from '../../../utils/export-util';

/**
 * Presentational component for a button that exports data to CSV
 */
export default class ExportToCsvButton extends React.Component {

    handleClick() {
        const { fields, data, exportTitle } = this.props;

        const csv = exportToCsv(fields, data);
        const encodedUri = encodeURI(csv);

        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);

        const exportFileName = exportTitle.endsWith('.csv') ? exportTitle : exportTitle + '.csv';
        link.setAttribute('download', exportFileName);

        document.body.appendChild(link);
        link.click();
    }

    render() {
        const { className } = this.props;

        return (
            <Button variant="light" className={className} onClick={() => this.handleClick()}>
                Export to CSV
            </Button>
        );
    }
}