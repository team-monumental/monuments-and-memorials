import React from 'react';
import "./RelatedMonuments.scss";
import Spinner from '../../Spinner/Spinner';
import SearchResult from '../../Search/SearchResult/SearchResult';
import Collapse from 'react-bootstrap/Collapse';

/**
 * Presentational Component for Related/Nearby Monuments
 */
export default class RelatedMonuments extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showingExtraMonuments: false
        };
    }

    handleMoreClick() {
        this.setState({showingExtraMonuments: true});
    }

    handleLessClick() {
        this.setState({showingExtraMonuments: false});
    }

    render() {
        const {title, monuments, pending} = this.props;
        const {showingExtraMonuments} = this.state;

        const monumentsToShow = (monuments && monuments.length) ? monuments.slice(0, 2) : [];
        const extraMonuments = (monuments && monuments.length && monuments.length > 2) ? monuments.slice(2) : [];

        const header = (
            <div className="h4">
                {title}
            </div>
        );

        const spinner = (
            <Spinner show={pending}/>
        );

        const moreLink = (
            <div className="related-monuments-link" onClick={() => this.handleMoreClick()}>More</div>
        );

        const lessLink = (
            <div className="related-monuments-link" onClick={() => this.handleLessClick()}>Less</div>
        );

        const extraMonumentsDisplay = (
            <div className="extra-related-monuments-container">
                <Collapse in={showingExtraMonuments}>
                    <div>
                        {
                            extraMonuments.map(
                                (extraMonument) => (
                                    <SearchResult key={extraMonument.id} monument={extraMonument}/>
                                )
                            )
                        }
                    </div>
                </Collapse>
                {!showingExtraMonuments && moreLink}
                {showingExtraMonuments && lessLink}
            </div>
        );

        if (monuments && monuments.length) {
            return (
                <div className="related">
                    {header}
                    {spinner}
                    <div className="related-monuments-container">
                        {
                            monumentsToShow.map(
                                (monument) => (
                                    <SearchResult key={monument.id} monument={monument}/>
                                )
                            )
                        }

                        {monuments.length > 2 && extraMonumentsDisplay}
                    </div>
                </div>
            );
        }
        return (
            <div/>
        );
    }
}