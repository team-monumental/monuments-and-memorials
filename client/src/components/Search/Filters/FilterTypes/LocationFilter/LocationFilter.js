import React from 'react';
import './LocationFilter.scss';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng
} from 'react-places-autocomplete';
import { Form }from 'react-bootstrap';
import * as QueryString from 'query-string';
/* global google */

/**
 * Used to search the Monument coordinates field by location
 */
export default class LocationSearch extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchQuery: props.value,
            sessionToken: '',
            showDistance: true,
            distance: '25'
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.value !== this.props.value) {
            this.handleChange(this.props.value);
        }
    }

    handleFilterChange(value){
        const {changeDistance} = this.props;
        this.setState({distance: value});
        changeDistance(value)

    }
    handleChange(newSearchQuery) {
        const sessionToken = this.state.sessionToken || new google.maps.places.AutocompleteSessionToken();
        if (this.state.sessionToken !== sessionToken) {
            this.setState({sessionToken});
        }

        // Google Maps API session tokens expire after 3 minutes
        // If a request is made with an expired session token, Google charges a higher rate
        // Manually expire our local session token after 3 minutes so we don't get charged the higher rate
        window.setTimeout(() => {
            if (sessionToken === this.state.sessionToken) {
                this.setState({sessionToken: null});
            }
        }, 180000);

        this.setState({searchQuery: newSearchQuery});
    }

    async handleSelect(address) {
        const { onSuggestionSelect } = this.props;

        const results = await geocodeByAddress(address);
        const latLon = await getLatLng(results[0]);
        onSuggestionSelect(latLon.lat.toFixed(6), latLon.lng.toFixed(6), address, results[0]);
        this.setState({showDistance: true, address: address})
    }

    handleClear() {
        this.setState({searchQuery: ''});
    }

    render() {
        const { searchQuery, showDistance, distance } = this.state;
        const { className, placeholder, isInvalid } = this.props;

        const renderFunc = ({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div className="autocomplete-container">
                <input
                    {...getInputProps({
                        placeholder: placeholder || "Near...",
                        className: [className, isInvalid ? 'is-invalid' : undefined].join(' ')
                    })}
                />
                <div className={'autocomplete-dropdown-container' + (suggestions && suggestions.length ? ' d-block' : ' d-none')}>
                    {loading && <div>Loading...</div>}
                    {suggestions.map(suggestion => {
                        const className = 'suggestion-item ' + (suggestion.active
                            ? 'active'
                            : '');
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

        const xStyle = {
            right: isInvalid ? '1.25em' : '0.5em'
        }

        const distanceFilter = showDistance ? (
            <Form.Control onChange={event => 
                this.handleFilterChange(event.target.value)} 
                as="select" 
                className="min-width-select dist-drop" 
                value={distance}>
                <option value="10">Within 10 miles</option>
                <option value="15">Within 15 miles</option>
                <option value="25">Within 25 miles</option>
                <option value="50">Within 50 miles</option>
                <option value="100">Within 100 miles</option>
            </Form.Control>
        ) : null;

        return (
            <div className="location-search">
                <span className="mr-1">Location</span>
                <PlacesAutocomplete
                    value={searchQuery}
                    onChange={newSearchQuery => this.handleChange(newSearchQuery)}
                    onSelect={address => this.handleSelect(address)}
                    onError={(status, clearSuggestions) => clearSuggestions()}
                    searchOptions={searchOptions}
                    highlightFirstSuggestion={true}>
                    {renderFunc}
                </PlacesAutocomplete>
                {searchQuery && <i className="material-icons search-clear" style={xStyle}
                                   onClick={() => this.handleClear()}>clear</i>}
                {distanceFilter}
            </div>
        )
    }
}