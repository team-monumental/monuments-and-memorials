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

    handleSelect(address) {
        const { onSuggestionSelect } = this.props;

        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLon => {
                onSuggestionSelect(latLon.lat.toFixed(6), latLon.lng.toFixed(6), address);
            })
            .catch(error => console.error("Error", error));
    }

    handleClear() {
        const { onSuggestionSelect } = this.props;
        this.setState({searchQuery: ''});
        onSuggestionSelect('', '', '');
    }

    render() {
        const { searchQuery } = this.state;
        const { className, width, margin, barBottomSpacing } = this.props;

        const renderFunc = ({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div className="autocomplete-container" style={{width: '100%'}}>
                <input
                    {...getInputProps({
                        placeholder: "Near...",
                        className: className,
                        style: {width: '100%'}
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

        return (
            <div className="form-control-sm p-0 position-relative" style={{width: width, marginRight: margin, marginLeft: margin, marginBottom: barBottomSpacing}}>
                <PlacesAutocomplete
                    value={searchQuery}
                    onChange={newSearchQuery => this.handleChange(newSearchQuery)}
                    onSelect={address => this.handleSelect(address)}
                    searchOptions={searchOptions}
                    highlightFirstSuggestion={true}>
                    {renderFunc}
                </PlacesAutocomplete>
                {searchQuery && <i className="material-icons search-clear" onClick={() => this.handleClear()}>clear</i>}
            </div>
        )
    }
}