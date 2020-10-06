import * as React from 'react';
import './BulkExport.scss';
import { withRouter } from 'react-router-dom';
import {Button, Card} from "react-bootstrap";
import {buildBulkExportData, exportFields} from "../../../utils/export-util";
import ExportButtons from "../../Export/ExportButtons/ExportButtons";

class BulkExport extends React.Component {
    render() {
        const { mode, history, monuments } = this.props;
        const exportData = buildBulkExportData(monuments)

        return (
            <div className="bulk-export">
                <Card style={{maxWidth: mode === 'search' ? '800px' : ''}}>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <Card.Title>
                            Export All Monuments and Memorials
                        </Card.Title>
                        {mode === 'monument' && <>
                            <Button variant="light" className="h-75" onClick={() => history.goBack()}>Back</Button>
                        </>}
                    </Card.Header>
                    <Card.Body>
                        <p>
                            Bulk export all monument data to a CSV or PDF
                        </p>
                        <div className="export-buttons">
                            <ExportButtons className="mt-2" fields={exportFields}
                                           data={exportData}
                                           title="All Monuments"/>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}

export default withRouter(BulkExport);