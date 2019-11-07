import React from 'react';
import Spinner from "../../Spinner/Spinner";

/**
 * Presentational Component for Nearby Monuments
 */
export default class NearbyMonuments extends React.Component {

    render() {
        const { monuments, fetchNearbyPending } = this.props;
        console.log(monuments);

        return (
            <div className="nearby">
                <div className="h6">
                    Nearby Monuments or Memorials
                </div>
            </div>
        );
    }
}