import React from 'react';
import './LocationFilter.scss';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng
} from 'react-places-autocomplete';
import { Form }from 'react-bootstrap';
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
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.value !== this.props.value) {
            this.handleChange(this.props.value);
        }
    }

    handleFilterChange(value){
        const {changeDistance} = this.props;
        changeDistance(value);
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
        const addressComponents = results[0].address_components;
        var state = '';
        for(const val of addressComponents){
            if (val.types.includes("administrative_area_level_1")){
                state = val.short_name
            }
        }
        onSuggestionSelect(latLon.lat.toFixed(6), latLon.lng.toFixed(6), address, state);
        this.setState({showDistance: true, address: address, searchQuery: address})
    }

    handleClear() {
        const {onClear} = this.props;
        this.setState({searchQuery: ''});
        onClear();
        
    }

    render() {
        const { searchQuery, showDistance } = this.state;
        const { className, placeholder, isInvalid, distance, badLocationState } = this.props;

        const renderFunc = ({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div className="autocomplete-container-filter">
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
                <option value="250">Within 250 miles</option>
                <option value="-1">By State</option>
            </Form.Control>
        ) : null;

        return (
            <div className="location-filter">
                <div className="location-box">
                    <PlacesAutocomplete
                        value={searchQuery}
                        onChange={newSearchQuery => this.handleChange(newSearchQuery)}
                        onSelect={address => this.handleSelect(address)}
                        onError={(status, clearSuggestions) => clearSuggestions()}
                        searchOptions={searchOptions}
                        highlightFirstSuggestion={true}>
                        {renderFunc}
                    </PlacesAutocomplete>
                    {searchQuery && <div className="loc-clear"><i className="material-icons"
                                    onClick={() => this.handleClear()}>clear</i></div>}
                </div>
                {distanceFilter}
                {badLocationState && 
                    <div className="bad-location">
                        <i className="material-icons">error_outline</i>
                        <p className="bad-location">No State Found</p>
                    </div>
                }
            </div>
        )
    }
}