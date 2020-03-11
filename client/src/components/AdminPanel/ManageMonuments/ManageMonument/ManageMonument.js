import * as React from 'react';
import About from '../../../Monument/Details/About/About';
import { Link } from 'react-router-dom';
import { Alert, Button, Modal } from 'react-bootstrap';

export default class ManageMonument extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            toggleActiveModalOpen: false,
            deleteModalOpen: false
        };
    }

    toggleActive(active) {
        const { onToggleActive } = this.props;
        onToggleActive(active);
        this.setState({toggleActiveModalOpen: false});
    }

    deleteMonument() {
        const { onDeleteMonument } = this.props;
        onDeleteMonument();
        this.setState({deleteModalOpen: false});
    }

    render() {
        const { monument, deleted } = this.props;
        if (deleted) return (
            <div className="manage-monument">
                <div>
                    You have deleted {monument.title} successfully.
                </div>
            </div>
        );
        return (<>
            {this.renderManageMonument()}
            {this.renderConfirmToggleActiveModal()}
            {this.renderConfirmDeleteModal()}
        </>)
    }

    renderManageMonument() {
        const { monument } = this.props;

        return (
            <div className="manage-monument">
                <About monument={monument} contributions={monument.contributions} references={monument.references}
                       header={monument.title} showHiddenFields hideExportToCSV hideTitle/>
                {(monument.images && monument.images.length) ?
                    <div className="images">
                        {monument.images.map(image => (
                            <div key={image.id} className="image" style={{backgroundImage: `url(${image.url})`}}/>
                        ))}
                    </div> : null
                }
                {!monument.isActive &&
                <Alert variant="info">
                    This Monument or Memorial is marked as inactive, which means the public cannot view it. Press the
                    activate button if you'd like to make it publicly visible.
                </Alert>
                }
                <div className="buttons">
                    {monument.isActive &&
                    <Link to={`/monuments/${monument.id}`} className="btn btn-light">View Public Page</Link>
                    }
                    <Link to={`/panel/manage/monuments/monument/update/${monument.id}`} className="btn btn-light">Edit</Link>
                    <Button variant="light" onClick={() => this.setState({toggleActiveModalOpen: true})}>{monument.isActive ? 'Deactivate' : 'Activate'}</Button>
                    <Button variant="danger" onClick={() => this.setState({deleteModalOpen: true})}>Delete</Button>
                </div>
            </div>
        );
    }

    renderConfirmToggleActiveModal() {
        const { toggleActiveModalOpen } = this.state;
        const { monument } = this.props;

        return (
            <div onClick={e => e.stopPropagation()}>
                <Modal show={toggleActiveModalOpen} onHide={() => this.setState({toggleActiveModalOpen: false})}>
                    <Modal.Header closeButton>
                        {monument.isActive ? 'Deactivate' : 'Activate'} {monument.title}?
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            {monument.isActive ? 'Are you sure you want to deactivate this monument or memorial? It will no longer be visible to the public, but you will still be able to make changes to it here.'
                                : 'Are you sure you want to activate this monument or memorial? It will become visible to the public.'}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="light" onClick={() => this.setState({toggleActiveModalOpen: false})}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={() => this.toggleActive(!monument.isActive)}>
                            {monument.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }

    renderConfirmDeleteModal() {
        const { deleteModalOpen } = this.state;
        const { monument } = this.props;

        return (
            <div onClick={e => e.stopPropagation()}>
                <Modal show={deleteModalOpen} onHide={() => this.setState({deleteModalOpen: false})}>
                    <Modal.Header closeButton>
                        Delete {monument.title}?
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            Are you sure you want to <strong>permanently</strong> delete this monument or memorial? If you would like to hide it from the public, you may deactivate it instead.
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="light" onClick={() => this.setState({deleteModalOpen: false})}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={() => this.deleteMonument()}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}