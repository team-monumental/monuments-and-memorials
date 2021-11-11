import * as React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {Helmet} from 'react-helmet';

import BulkEditPanel from "../../../components/AdminPanel/BulkEdit/BulkEditPanel";

class BulkEditPage extends React.Component {
    render() {
        // const {mode} = this.props;
        return (<>
            <Helmet title={`Bulk Edit | Monuments and Memorials`}/>
            {/*<BulkEdit/>*/}
            <BulkEditPanel/>
        </>);
    }
}

export default withRouter(connect(BulkEditPage.mapStateToProps)(BulkEditPage));