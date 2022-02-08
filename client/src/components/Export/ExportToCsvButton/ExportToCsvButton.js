import React, {useContext} from 'react';
import Button from 'react-bootstrap/Button';
import {exportToCsv} from '../../../utils/export-util';
import {RollbarContext} from '../../../App';

/**
 * Presentational component for a button that exports data to CSV
 */
export const ExportToCsvButton = (props) => {

    const {fields, data, exportTitle, className} = props;
    const rollbar = useContext(RollbarContext);

    const handleClick = () => {
        const csv = exportToCsv(fields, data);
        const exportFileName = exportTitle.endsWith('.csv') ? exportTitle : exportTitle + '.csv';
        const blob = new Blob([csv]);

        if (navigator.msSaveBlob) { // For Microsoft Edge
            navigator.msSaveBlob(blob, exportFileName);
        } else {
            const link = document.createElement("a");
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", exportFileName);
                document.body.appendChild(link);
                link.click();
            }
        }
        rollbar.info(`Exported monuments (${data.length}) to CSV`);
    }

    const text = data && data.length > 1 ? "Export all to CSV" : "Export to CSV";

    return (
        <Button variant="light" className={className} onClick={() => handleClick()}>
            {text}
        </Button>
    );
}