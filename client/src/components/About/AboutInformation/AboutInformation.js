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

        let mapNavLink = (
            <NavLink onClick={e => {
                e.preventDefault();
                window.location.replace('/map');
            }} to="/map" key="map">click here</NavLink>
        );

        const readMoreContributorsLink = (
            <div className='more-contributors-link'
                 onClick={() => this.handleMoreContributorsClick()}>
                Read More
            </div>
        );

        const hideMoreContributorsLink = (
            <div className='more-contributors-link hide-link'
                 onClick={() => this.handleMoreContributorsClick()}>
                Hide
            </div>
        );

        return (
            <div className='about-information-container'>
                <h1>
                    About Monuments + Memorials
                </h1>
                {/* TODO: Replace click here with link to sign-in page */}
                <p>
                    <span className='font-italic'>Monuments + Memorials</span> is a crowd-sourced initiative developed at
                    the Rochester Institute of Technology under the direction of Dr. Juilee Decker. Students in her spring
                    2019 history course <span className='font-italic'>Monuments & Memory</span> began data collection by
                    examining 26 states or territories in the US. The following fall, software engineering students in the
                    Golisano College of Computer and Information Sciences built this web application to house data and to
                    generate further interest and data collection. To view monuments and memorials, {mapNavLink}. To enter
                    data, click here.
                </p>
                <h3 className='font-italic'>
                    Background:
                </h3>
                <p>
                    Monuments and memorials offer insight into a community's values. They offer tribute to a person,
                    idea, or event and/or honor an individual or group who have passed away or have been, in the case
                    of veterans, killed in action. Across the United States, thousands of such work exists; this vast
                    collection of publicly-accessible art, however, is largely uncatalogued and thus remains
                    undocumented for the public. While some familiar outdoor memorials include the Vietnam Veterans
                    Memorial in Washington, D.C. and the 9/11 Memorial and Museum in NYC -- and such works are deemed
                    part of our national treasures -- no method exists to enable someone to research and locate public
                    monuments and memorials throughout the United States. This project aims to remedy that gap in
                    documentation and access.
                </p>
                <p>
                    Our goal is to map every monument and memorial in the United States and its inhabited territories
                    (American Samoa, Guam, Puerto Rico, the North Mariana Islands, and U.S. Virgin Islands). We invite
                    anyone to contribute information and an image of monuments and memorials in these areas. If you have
                    any questions, please contact the project coordinator, Juilee Decker jdgsh@rit.edu.
                </p>
                <h3 className='font-italic'>
                    Contributors:
                </h3>
                {/* TODO: Replace click here with link to sign-in page */}
                <p>
                    We invite contributions from anyone. If you are interested in contributing, please click here. Your
                    submissions will be recognized in our list of contributors:
                </p>

                <div className='contributors-list-container'>
                    <ContributorsList
                        contributors={contributors}
                        showingAllContributors={showingAllContributors}
                    />

                    {!showingAllContributors && readMoreContributorsLink}
                    {showingAllContributors && hideMoreContributorsLink}
                </div>

                <h3 className='font-italic'>
                    Acknowledgements:
                </h3>
                <p>
                    <span className='font-weight-bold'>Software engineering students:</span> AJ Delposen, Nick Deyette, Ben Smith, Ben Vogler<br/>
                    <span className='font-weight-bold'>Advisors:</span> Eric Mansfield, Samuel Malachowsky, Jim Vallino<br/>
                    Lizzy Carr, research assistant<br/>
                    Connie Froass, graphic design<br/>
                    Students in HIS 322 course, <span className='font-italic'>Monuments & Memory</span>, spring 2019 and
                    spring 2020
                </p>
                <h3 className='font-italic'>
                    Statistics:
                </h3>
                <div className='statistics-container'>
                    <div className="statistics-row">
                        <StatisticCard
                            statistic={monumentStatistics.totalNumberOfMonuments}
                            description='Total number of Monuments and Memorials'
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
                    <div className='statistics-row last'>
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
                <div className='charts-container'>
                    <NumberOfMonumentsByStateBarChart
                        numberOfMonumentsByState={monumentStatistics.numberOfMonumentsByState}
                    />
                </div>
            </div>
        );
    }
}