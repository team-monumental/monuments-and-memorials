import React from 'react';
import './AboutInformation.scss';
import { Link } from 'react-router-dom';
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

        const mapLink = (
            <Link to="/map">click here</Link>
        );

        let nineElevenMemorialLink = "9/11 Memorial";
        if (monumentStatistics && monumentStatistics.nineElevenMemorialId) {
            nineElevenMemorialLink = (
                <Link to={`/monuments/${monumentStatistics.nineElevenMemorialId}`} key="911-memorial">
                    9/11 Memorial
                </Link>
            );
        }

        let vietnamVeteransMemorialLink = "Vietnam Veterans Memorial";
        if (monumentStatistics && monumentStatistics.vietnamVeteransMemorialId) {
            vietnamVeteransMemorialLink = (
                <Link to={`/monuments/${monumentStatistics.vietnamVeteransMemorialId}`}>Vietnam Veterans Memorial</Link>
            );
        }

        let suggestionLink = (
            <Link to="/create" key="create">click here</Link>
        );

        let signupLink = (
            <Link  to="/signup" key="signup">click here to create an account</Link>
        );

        const readMoreContributorsLink = contributors && contributors.length > 5 ? (
            <div className="more-contributors-link"
                 onClick={() => this.handleMoreContributorsClick()}>
                View {`All (${contributors.length})`}
            </div>
        ) : <></>;

        const hideMoreContributorsLink = (
            <div className="more-contributors-link hide-link"
                 onClick={() => this.handleMoreContributorsClick()}>
                Hide
            </div>
        );

        return (
            <div className="static-page-body">
                <div className="row">
                    <div className="col">
                        <div className="static-page-title">
                            <h1>
                                About Monuments + Memorials
                            </h1>
                        </div>
                        <div className="static-page-text">
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
                            <p>
                                Our goal is to document all temporary and permanent monuments + memorials throughout the United
                                States and territories. We are looking for contributors to add information, please join us by
                                creating an account ({signupLink}) or by contacting the organizers&nbsp;
                                <a href="mailto:contact@monuments.us.org">contact@monuments.us.org</a>. To view monuments
                                and memorials, {mapLink}.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col static-page-centered-col">
                        <div className="static-page-centered">
                            <div className="static-page-title">
                                <h2>
                                    Background
                                </h2>
                            </div>
                            <div className="static-page-text">
                                <p>
                                    Monuments and memorials offer insight into a community's values. They offer tribute to a person,
                                    idea, or event and/or honor an individual or group who have passed away or have been, in the case
                                    of veterans, killed in action. Across the United States, thousands of such work exists. While some
                                    familiar outdoor memorials include the {vietnamVeteransMemorialLink} in Washington, D.C. and the&nbsp;
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
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-6 col-12 mb-5 mb-lg-0">
                        <div className="static-page-title">
                            <h2>
                                Contributors
                            </h2>
                        </div>
                        <div className="static-page-text">
                            <p>
                                We invite contributions from anyone. If you are interested in contributing, please {suggestionLink}. Your
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
                        </div>
                    </div>
                    <div className="col-lg-6 col-12">
                        <div className="static-page-title">
                            <h2>
                                Acknowledgements
                            </h2>
                        </div>
                        <div className="static-page-text">
                            <p>
                                <span className="font-weight-bold">Software engineering students:</span> AJ Delposen, Nick Deyette, Ben Smith, Ben Vogler<br/>
                                <span className="font-weight-bold">Advisors:</span> Eric Mansfield, Samuel Malachowsky, and Jim Vallino<br/>
                                Lizzy Carr and Landyn Hatch, research assistants<br/>
                                Connie Froass, graphic design<br/>
                                Students in HIS 322 course, <span className="font-italic">Monuments & Memory</span>, spring 2019 and
                                spring 2020
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <div className="static-page-title">
                            <h2>
                                Statistics
                            </h2>
                        </div>
                        <div className="static-page-text">
                            <div className="stats">
                                <StatisticCard
                                    statistic={monumentStatistics.totalNumberOfMonuments}
                                    description="Monuments and Memorials"
                                    iconName="account_balance"
                                />
                                <StatisticCard
                                    statistic={monumentStatistics.oldestMonument ? monumentStatistics.oldestMonument.title : null}
                                    description={monumentStatistics.oldestMonument
                                        ? 'Oldest Monument or Memorial on Record'
                                        : null}
                                    statisticFontSize="small"
                                    link={monumentStatistics.oldestMonument ? '/monuments/' + monumentStatistics.oldestMonument.id : null}
                                    iconName="today"
                                />
                                <StatisticCard
                                    statistic={monumentStatistics.newestMonument ? monumentStatistics.newestMonument.title : null}
                                    description={monumentStatistics.newestMonument
                                        ? 'Newest Monument or Memorial on Record'
                                        : null}
                                    statisticFontSize="small"
                                    link={monumentStatistics.newestMonument ? '/monuments/' + monumentStatistics.newestMonument.id : null}
                                    iconName="event"
                                />
                                <StatisticCard
                                    statistic={monumentStatistics.numberOfMonumentsInRandomState}
                                    description={'Monuments and Memorials in ' + monumentStatistics.randomState}
                                    iconName="public"
                                />
                                <StatisticCard statistic={monumentStatistics.mostPopularTagName}
                                               description={`Most Popular Tag (${monumentStatistics.mostPopularTagUses} uses)`}
                                               link={`/search/?tags=${monumentStatistics.mostPopularTagName}`}
                                               statisticFontSize="small"
                                               iconName="trending_up"/>
                                <StatisticCard statistic={monumentStatistics.mostPopularMaterialName}
                                               description={`Most Popular Material (${monumentStatistics.mostPopularMaterialUses} uses)`}
                                               link={`/search/?materials=${monumentStatistics.mostPopularMaterialName}`}
                                               statisticFontSize="small"
                                               iconName="trending_up"/>
                                <StatisticCard
                                    statistic={monumentStatistics.numberOfMonumentsWithRandomTag}
                                    description={'Monuments tagged with: ' + monumentStatistics.randomTagName}
                                    iconName="local_offer"
                                />
                            </div>
                        </div>
                        <div className="static-page-title mt-5">
                            <h2>
                                Number of Monuments By State
                            </h2>
                        </div>
                        <div className="static-page-text">
                            <NumberOfMonumentsByStateBarChart
                                numberOfMonumentsByState={monumentStatistics.numberOfMonumentsByState}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}