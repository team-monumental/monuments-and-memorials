import React from 'react';
import { connect } from 'react-redux';

import Monument from '../../components/Monument/Monument';
import Spinner from '../../components/Spinner/Spinner';
import fetchMonument from '../../actions/monument';

/**
 * Root container component for the monument record page which handles retrieving the monument
 * and its related records via redux
 */
class MonumentPage extends React.Component {

    static mapStateToProps(state) {
        return state.monumentPage;
    }

    componentDidMount() {
        const { dispatch, match: { params: { monumentId } } } = this.props;
        dispatch(fetchMonument(monumentId));
    }

    render() {
        const { monument, nearbyMonuments, fetchMonumentPending, fetchNearbyPending } = this.props;
        return (
            <div className="page h-100">
                <Spinner show={fetchMonumentPending}/>
                <Monument monument={monument} nearbyMonuments={nearbyMonuments} fetchNearbyPending={fetchNearbyPending}/>
            </div>
        );
    }
}

export default connect(MonumentPage.mapStateToProps)(MonumentPage);