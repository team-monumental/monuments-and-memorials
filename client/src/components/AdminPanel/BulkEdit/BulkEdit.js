import * as React from 'react';
import './BulkEdit.scss';
import {withRouter} from 'react-router-dom';
import {Button, Card} from "react-bootstrap";
import SearchPage from "../../../pages/SearchPage/SearchPage";


class BulkEdit extends React.Component {
    render() {
        const {mode, history} = this.props;

        return (
            <div className="bulk-edit">
                <Card style={{maxWidth: mode === 'search' ? '800px' : ''}}>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <Card.Title>
                            Bulk Edit
                        </Card.Title>
                        {mode === 'monument' && <>
                            <Button variant="light" className="h-100" onClick={() => history.goBack()}>Back</Button>
                        </>}
                    </Card.Header>
                    <Card.Body>
                        {(!mode || mode === 'search') && <>
                            <SearchPage searchUri="/panel/manage/monuments/search"
                                        monumentUri="/panel/manage/monuments/monument"
                                        hideMap/>
                        </>}
                    </Card.Body>
                </Card>
            </div>
        );
    }
}

export default withRouter(BulkEdit);