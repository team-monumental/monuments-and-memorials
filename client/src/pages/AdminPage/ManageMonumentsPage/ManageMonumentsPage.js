import * as React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import ManageMonuments from '../../../components/AdminPanel/ManageMonuments/ManageMonuments';
import fetchMonument from '../../../actions/monument';
import {deleteMonument, toggleMonumentIsActive} from '../../../actions/update-monument';
import {Helmet} from 'react-helmet';

class ManageMonumentsPage extends React.Component {

    static mapStateToProps(state) {
        return {
            ...state.monumentPage,
            toggleMonumentIsActive: state.toggleMonumentIsActive,
            deleteMonument: state.deleteMonument
        };
    }

    componentDidMount() {
        this.fetchMonumentIfIdExists();
    }

    fetchMonumentIfIdExists() {
        const {dispatch, match: {params: {monumentId}}} = this.props;
        if (monumentId) {
            try {
                if (!isNaN(parseInt(monumentId))) {
                    dispatch(fetchMonument(monumentId, false));
                }
            } catch (err) {
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {toggleMonumentIsActive} = this.props;
        if (!toggleMonumentIsActive.pending && prevProps.toggleMonumentIsActive.pending) {
            this.fetchMonumentIfIdExists();
        }
    }

    handleToggleActive(active) {
        const {monument, dispatch} = this.props;
        dispatch(toggleMonumentIsActive(monument.id, active));
    }

    handleDeleteMonument() {
        const {monument, dispatch} = this.props;
        dispatch(deleteMonument(monument.id));
    }

    render() {
        const {mode, monument, deleteMonument} = this.props;
        return (<>
            <Helmet title={`Manage | Monuments and Memorials`}/>
            <ManageMonuments mode={mode} monument={monument} onToggleActive={active => this.handleToggleActive(active)}
                             onDeleteMonument={() => this.handleDeleteMonument()}
                             deleted={!deleteMonument.pending && deleteMonument.success}/>
        </>);
    }
}

export default withRouter(connect(ManageMonumentsPage.mapStateToProps)(ManageMonumentsPage));