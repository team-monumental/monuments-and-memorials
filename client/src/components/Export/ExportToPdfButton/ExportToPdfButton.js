import React, {useContext} from 'react';
import Button from 'react-bootstrap/Button';
import {exportToPdf} from '../../../utils/export-util';
import {RollbarContext} from '../../../App';

/**
 * Presentational component for a button that exports data to PDF
 */
export const ExportToPdfButton = (props) => {

    const {fields, data, exportTitle, className} = props;
    const rollbar = useContext(RollbarContext);

    const handleClick = () => {
        exportToPdf(fields, data, exportTitle);
        rollbar.info(`Exported monuments (${data.length}) to PDF`);
    }

    const text = data && data.length > 1 ? "Export all to PDF" : "Export to PDF";

    return (
        <Button variant="light" className={className} onClick={() => handleClick()}>
            {text}
        </Button>
    );
}
