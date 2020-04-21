import React from 'react';
import './ContributorsList.scss';
import Collapse from 'react-bootstrap/Collapse';

/**
 * Presentational component for the list of Contributors shown on the About Page
 */
export default class ContributorsList extends React.Component {

    render() {
        const { contributors, showingAllContributors } = this.props;

        if (contributors && contributors.length) {
            const contributorsToDisplay = contributors.slice(0, 5);
            const hiddenContributors = contributors.slice(5);

            return (
                <div>
                    <div className="contributors-list-shown-container">
                        {
                            contributorsToDisplay.map((contributor) => {
                                return <div key={contributor}>{contributor}</div>;
                            })
                        }
                    </div>

                    <Collapse in={showingAllContributors}>
                        <div className="contributors-list-hidden-container">
                            {
                                hiddenContributors.map((contributor) => {
                                    return <div key={contributor}>{contributor}</div>
                                })
                            }
                        </div>
                    </Collapse>
                </div>
            );
        }
        else {
            return (
                <div/>
            );
        }
    }
}