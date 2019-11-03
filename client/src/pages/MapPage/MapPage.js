import * as React from 'react';
import './MapPage.scss';
import MapResults from '../../components/Search/MapResults/MapResults';
import { connect } from 'react-redux';
import fetchMonuments from '../../actions/map';

class MapPage extends React.Component {

    constructor(props) {
        super(props);
        const { dispatch } = props;
        dispatch(fetchMonuments());
    }

    static mapStateToProps(state) {
        if (state.mapPage) {
            const { monuments } = state.mapPage;
            if (monuments.error || monuments.errors) return {};
        }
        return state.mapPage;
    }

    render() {
        const { monuments } = this.props;
        return (
            <div className="map-page">
                <MapResults monuments={monuments} useCircleMarkers zoom="5"/>
            </div>
        );
    }
}

export default connect(MapPage.mapStateToProps)(MapPage);