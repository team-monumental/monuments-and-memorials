import * as React from 'react';
import './ManageMonuments.scss';
import { withRouter } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import SearchBar from '../../Header/SearchBar/SearchBar';
import SearchPage from '../../../pages/SearchPage/SearchPage';
import ManageMonument from './ManageMonument/ManageMonument';
import UpdateMonumentPage from '../../../pages/UpdateMonumentPage/UpdateMonumentPage';
import { Helmet } from 'react-helmet';

class ManageMonuments extends React.Component {

    render() {
        const { mode, monument, history, match, onToggleActive, onDeleteMonument, deleted } = this.props;
        return (
            <div className="manage-monuments">
                <Card style={{maxWidth: mode === 'search' ? '800px' : ''}}>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <Card.Title>
                            Manage Monuments or Memorials
                        </Card.Title>
                        {mode === 'monument' && <>
                            <Button variant="light" className="h-75" onClick={() => history.goBack()}>Back</Button>
                        </>}
                    </Card.Header>
                    <Card.Body>
                        {(!mode || mode === 'search') &&
                            <SearchBar uri="/panel/manage/monuments/search"/>
                        }
                        {mode === 'search' && <>
                            <SearchPage searchUri="/panel/manage/monuments/search" monumentUri="/panel/manage/monuments/monument"
                                        hideMap/>
                        </>}
                        {mode === 'monument' && <>
                            <Helmet title={`Manage ${monument.title} | Monuments and Memorials`}/>
                            <ManageMonument monument={monument} onToggleActive={onToggleActive} onDeleteMonument={onDeleteMonument}
                                            deleted={deleted}/>
                        </>}
                        {mode === 'update' && <>
                            <UpdateMonumentPage match={match}/>
                        </>}
                    </Card.Body>
                </Card>
            </div>
        )
    }
}

export default withRouter(ManageMonuments);