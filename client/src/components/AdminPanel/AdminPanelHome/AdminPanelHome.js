import * as React from 'react';
import './AdminPanelHome.scss';
import { Card } from 'react-bootstrap';

export default class AdminPanelHome extends React.Component {

    render() {
        const { role } = this.props;
        return (
            <div className="home">
                <Card>
                    <Card.Header>
                        <Card.Title>
                            Welcome to the {role} Panel
                        </Card.Title>
                    </Card.Header>
                    <Card.Body>
                        You can perform advanced actions such as bulk creating monuments and memorials from this page. Please see the sidebar to the left for advanced actions.
                    </Card.Body>
                </Card>
            </div>
        );
    }
}