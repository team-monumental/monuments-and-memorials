import React from 'react';
import './AboutInformation.scss';
import { NavLink } from 'react-router-dom';
import ContributorsList from './ContributorsList/ContributorsList';
import StatisticCard from './StatisticCard/StatisticCard';
import NumberOfMonumentsByStateBarChart from './NumberOfMonumentsByStateBarChart/NumberOfMonumentsByStateBarChart';

/**
 * Presentational component for the plain-text information displayed on the About Page
 */
export default class AboutInformation extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showingAllContributors: false
        };
    }

    handleMoreContributorsClick() {
        const { showingAllContributors } = this.state;
        this.setState({showingAllContributors: !showingAllContributors});
    }

    render() {
        const { contributors, monumentStatistics } = this.props;
        const { showingAllContributors } = this.state;

        const mapNavLink = (
            <NavLink onClick={e => {
                e.preventDefault();
                window.location.replace('/map');
            }} to="/map" key="map">click here</NavLink>
        );

        let nineElevenMemorialLink = "9/11 Memorial";
        if (monumentStatistics && monumentStatistics.nineElevenMemorialId) {
            nineElevenMemorialLink = (
                <NavLink onClick={e => {
                    e.preventDefault();
                    window.location.replace(`/monuments/${monumentStatistics.nineElevenMemorialId}`);
                }} to={`/monuments/${monumentStatistics.nineElevenMemorialId}`} key="911-memorial">9/11 Memorial</NavLink>
            );
        }

        const readMoreContributorsLink = (
            <div className="more-contributors-link"
                 onClick={() => this.handleMoreContributorsClick()}>
                Read More
            </div>
        );

        const hideMoreContributorsLink = (
            <div className="more-contributors-link hide-link"
                 onClick={() => this.handleMoreContributorsClick()}>
                Hide
            </div>
        );

        return (
            <div className="about-information-container">
                <h1>
                    About Monuments + Memorials
                </h1>
                <p>
                    <span className="font-italic">Monuments + Memorials</span> is a crowd-sourced initiative developed at
                    the Rochester Institute of Technology under the direction of Dr. Juilee Decker. Students in her spring
                    2019 history course <span className="font-italic">Monuments + Memory</span> began data collection by
                    examining 26 states or territories of the US. The following fall, software engineering students in the
                    Golisano College of Computer and Information Sciences built this web application to house data and to
                    generate further interest and data collection. The spring 2020 history course added to the existing
                    data by contributing 900 additional monuments + memorials, so that all states are represented, as
                    are two territories (Guam and Puerto Rico).
                </p>
                {/* TODO: Replace click here with link to sign-in page */}
                <p>
                    Our goal is to document all temporary and permanent monuments + memorials throughout the United
                    States and territories. We are looking for contributors to add information, please join us by
                    creating an account (sign-in link here) or by contacting the organizers&nbsp;
                    <a href="mailto:contact@monuments.us.org">contact@monuments.us.org</a>. To view monuments
                    and memorials, {mapNavLink}.
                </p>
                <h3 className="font-italic">
                    Background:
                </h3>
                {/* TODO: Add link to Vietnam Veterans Memorial */}
                <p>
                    Monuments and memorials offer insight into a community's values. They offer tribute to a person,
                    idea, or event and/or honor an individual or group who have passed away or have been, in the case
                    of veterans, killed in action. Across the United States, thousands of such work exists. While some
                    familiar outdoor memorials include the Vietnam Veterans Memorial in Washington, D.C. and the&nbsp;
                    {nineElevenMemorialLink} and Museum in NYC -- and such works are deemed part of our national
                    treasures -- no method exists to enable someone to research and locate public monuments and memorials
                    throughout the United States. In short, our nation's vast collection of publicly-accessible art,
                    however, is largely uncatalogued and thus remains undocumented for the public. This project aims to
                    remedy that gap in documentation and access.
                </p>
                <p>
                    Our goal is to map every monument or memorial in the United States and its inhabited territories
                    (American Samoa, Guam, Puerto Rico, the North Mariana Islands, and U.S. Virgin Islands). We invite
                    anyone to contribute information and an image of temporary and permanent monuments and memorials in
                    these areas. If you have any questions, please contact the project coordinator, Juilee Decker&nbsp;
                    <a href="mailto:contact@monuments.us.org">contact@monuments.us.org</a>.
                </p>
                <h3 className="font-italic">
                    Contributors:
                </h3>
                {/* TODO: Replace click here with link to sign-in page */}
                <p>
                    We invite contributions from anyone. If you are interested in contributing, please click here. Your
                    submissions will be recognized in our list of contributors:
                </p>

                <div className="contributors-list-container">
                    <ContributorsList
                        contributors={contributors}
                        showingAllContributors={showingAllContributors}
                    />

                    {!showingAllContributors && readMoreContributorsLink}
                    {showingAllContributors && hideMoreContributorsLink}
                </div>

                <h3 className="font-italic">
                    Acknowledgements:
                </h3>
                <p>
                    <span className="font-weight-bold">Software engineering students:</span> AJ Delposen, Nick Deyette, Ben Smith, Ben Vogler<br/>
                    <span className="font-weight-bold">Advisors:</span> Eric Mansfield, Samuel Malachowsky, and Jim Vallino<br/>
                    Lizzy Carr and Landyn Hatch, research assistants<br/>
                    Connie Froass, graphic design<br/>
                    Students in HIS 322 course, <span className="font-italic">Monuments & Memory</span>, spring 2019 and
                    spring 2020
                </p>
                <h3 className="font-italic">
                    Statistics:
                </h3>
                <div className="statistics-container">
                    <div className="statistics-row">
                        <StatisticCard
                            statistic={monumentStatistics.totalNumberOfMonuments}
                            description="Total number of Monuments and Memorials"
                        />
                        <StatisticCard
                            statistic={monumentStatistics.oldestMonument ? monumentStatistics.oldestMonument.title : null}
                            description={monumentStatistics.oldestMonument
                                ? 'Oldest Monument or Memorial on record (Date: ' + monumentStatistics.oldestMonument.date + ')'
                                : null}
                            statisticFontSize="small"
                            link={monumentStatistics.oldestMonument ? '/monuments/' + monumentStatistics.oldestMonument.id : null}
                        />
                        <StatisticCard
                            statistic={monumentStatistics.newestMonument ? monumentStatistics.newestMonument.title : null}
                            description={monumentStatistics.newestMonument
                                ? 'Newest Monument or Memorial on record (Date: ' + monumentStatistics.newestMonument.date + ')'
                                : null}
                            statisticFontSize="small"
                            link={monumentStatistics.newestMonument ? '/monuments/' + monumentStatistics.newestMonument.id : null}
                        />
                    </div>
                    <div className="statistics-row last">
                        <StatisticCard
                            statistic={monumentStatistics.numberOfMonumentsInRandomState}
                            description={'Number of Monuments in ' + monumentStatistics.randomState}
                        />
                        <StatisticCard
                            statistic={monumentStatistics.numberOfMonumentsWithRandomTag}
                            description={'Number of Monuments tagged with: ' + monumentStatistics.randomTagName}
                        />
                    </div>
                </div>
                <div className="charts-container">
                    <NumberOfMonumentsByStateBarChart
                        numberOfMonumentsByState={monumentStatistics.numberOfMonumentsByState}
                    />
                </div>
            </div>
        );
    }
}