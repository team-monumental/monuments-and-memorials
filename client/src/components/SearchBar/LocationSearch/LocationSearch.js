import React from 'react';
import './LocationSearch.scss';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng
} from 'react-places-autocomplete';
/* global google */

/**
 * Used to search the Monument coordinates field by location
 */
export default class LocationSearch extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchQuery: props.value,
            sessionToken: ''
        };
    }

    handleChange(newSearchQuery) {
        const { sessionToken } = this.state;
        if (!sessionToken) {
            this.setState({sessionToken: new google.maps.places.AutocompleteSessionToken()})
        }

        // Google Maps API session tokens expire after 3 minutes
        // If a request is made with an expired session token, Google charges the per-character rate
        // Manually expire our local session token after 3 minutes so we don't get charged the higher price
        window.setTimeout(() => {
            this.setState({sessionToken: null});
        }, 180000);

        this.setState({searchQuery: newSearchQuery});
    }

    handleSelect(address) {
        const { onSuggestionSelect } = this.props;

        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLon => {
                onSuggestionSelect(latLon.lat, latLon.lng);
            })
            .catch(error => console.error("Error", error));
    }

    render() {
        const { searchQuery } = this.state;
        const { className } = this.props;

        const renderFunc = ({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div className="autocomplete-container">
                <input
                    {...getInputProps({
                        placeholder: "Near...",
                        className: className
                    })}
                />
                <div className="autocomplete-dropdown-container">
                    {loading && <div>Loading...</div>}
                    {suggestions.map(suggestion => {
                        const className = suggestion.active
                            ? 'suggestion-item-active'
                            : 'suggestion-item';
                        return (
                            <div
                                {...getSuggestionItemProps(suggestion, {
                                    className
                                })}>
                                <i className="material-icons">room</i> {suggestion.description}
                            </div>
                        );
                    })}
                </div>
            </div>
        );

        const searchOptions = {
            sessionToken: this.state.sessionToken
        };

        return (
            <PlacesAutocomplete
                value={searchQuery}
                onChange={newSearchQuery => this.handleChange(newSearchQuery)}
                onSelect={address => this.handleSelect(address)}
                searchOptions={searchOptions}>
                {renderFunc}
            </PlacesAutocomplete>
        )
    }
}