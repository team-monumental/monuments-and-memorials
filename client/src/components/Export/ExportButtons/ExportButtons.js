import React from 'react';
import moment from "moment";
import ExportToCsvButton from "../ExportToCsvButton/ExportToCsvButton";
import ExportToPdfButton from "../ExportToPdfButton/ExportToPdfButton";

/**
 * Presentational component for a button that exports data to CSV
 */
export default class ExportButtons extends React.Component {

    render() {
        const { fields, data, title } = this.props;

        return (
            <span>
                <span>
                    <ExportToCsvButton className="mt-2" fields={fields}
                                       data={data}
                                       exportTitle={`${title} Data ${moment().format('YYYY-MM-DD hh:mm')}`}/>
                </span>
                <span style={{marginLeft: '5px'}}>
                    <ExportToPdfButton className="mt-2" fields={fields}
                                       data={data}
                                       exportTitle={`${title} Data ${moment().format('YYYY-MM-DD hh:mm')}`}/>
                </span>
            </span>
        );
    }
}
