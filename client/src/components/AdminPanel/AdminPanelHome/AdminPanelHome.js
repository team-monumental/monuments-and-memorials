import * as React from 'react';
import './AdminPanelHome.scss';
import { Card } from 'react-bootstrap';
import { Role } from '../../../utils/authentication-util';

export default class AdminPanelHome extends React.Component {

    render() {
        const { role } = this.props;

        const commonTextDisplay = (<>
            &nbsp;If you encounter any problems, please cancel your action and contact the site administrator,&nbsp;
            <a href="mailto:contact@monuments.us.org">contact@monuments.us.org</a>.
        </>);

        /* TODO: Add link to Resources Page once it is merged */
        const partnerAndResearcherCommonTextDisplay = (<>
            &nbsp;Please see the sidebar to the left for advanced actions. If you have any questions
            about records and terms, please consult the Resources Page.
            {commonTextDisplay}
        </>);

        const thankYouParagraphDisplay = (<p>
            Thank you for your efforts to help us document monuments + memorials.
        </p>);

        let cardBodyDisplay;
        switch (role.toUpperCase()) {
            case Role.ADMIN:
                cardBodyDisplay = (<>
                    You can perform advanced actions such as bulk creation of records. Please see the sidebar to the
                    left for advanced actions.
                    {commonTextDisplay}
                </>);
                break;
            case Role.PARTNER:
                cardBodyDisplay = (<>
                    <p>
                        Partners are defined as individuals who have a stronger interest in data collection than
                        researchers or the public, and who commit to contributing multiple records that reflect
                        particular geographic regions or subject areas.
                    </p>
                    <p>
                        In addition to serving as data stewards, Partners may serve as community curators, and may wish
                        to curate content from the database. Partners may perform actions such as bulk creation of
                        records.
                        {partnerAndResearcherCommonTextDisplay}
                    </p>
                    {thankYouParagraphDisplay}
                </>);
                break;
            case Role.RESEARCHER:
                cardBodyDisplay = (<>
                    <p>
                        Researchers are defined as individuals who have an interest in monuments + memorials; may
                        contribute to data collection, data refinement, and interpretation; and may wish to curate
                        content from the database.
                    </p>
                    <p>
                        In adding to serving as data stewards, Researchers may serve as community curators, and may wish
                        to curate content from the database. Researchers may perform advanced actions such as bulk
                        creation of records.
                        {partnerAndResearcherCommonTextDisplay}
                    </p>
                    {thankYouParagraphDisplay}
                </>);
                break;
            default:
                cardBodyDisplay = <div/>;
        }

        return (
            <div className="home">
                <Card>
                    <Card.Header>
                        <Card.Title>
                            Welcome to the {role} Panel
                        </Card.Title>
                    </Card.Header>
                    <Card.Body>
                        {cardBodyDisplay}
                    </Card.Body>
                </Card>
            </div>
        );
    }
}