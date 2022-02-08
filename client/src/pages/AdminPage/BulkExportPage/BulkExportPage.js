import * as React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {fetchAllMonuments} from '../../../actions/monument';
import {Helmet} from 'react-helmet';
import BulkExport from '../../../components/AdminPanel/BulkExport/BulkExport';
import Spinner from '../../../components/Spinner/Spinner';

class BulkExportPage extends React.Component {

    static mapStateToProps(state) {
        return {
            ...state.monumentPage,
            session: state.session
        };
    }

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(fetchAllMonuments());
    }

    render() {
        const {mode, allMonuments, fetchAllPending} = this.props;

        return (<>
            <Helmet title={`Bulk Export | Monuments and Memorials`}/>
            <Spinner show={fetchAllPending}/>
            <BulkExport mode={mode} monuments={allMonuments || []}/>
        </>);
    }
}

export default withRouter(connect(BulkExportPage.mapStateToProps)(BulkExportPage));