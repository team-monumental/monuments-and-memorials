import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Helmet} from 'react-helmet';

import BulkEditPanel from "../../../components/AdminPanel/BulkEdit/BulkEditPanel";

class BulkEditPage extends React.Component {
    render() {
        return (
            <>
                <Helmet title={`Bulk Edit | Monuments and Memorials`}/>
                <BulkEditPanel/>
            </>
        );
    }
}

export default withRouter(connect(BulkEditPage.mapStateToProps)(BulkEditPage));