import React from 'react';
import './Footer.scss';
import { NavLink } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Footer extends React.Component {

    render() {
        return (
            <div className="footer" style={{height: this.props.headerHeight, paddingTop: `calc(${this.props.headerHeight} / 2)`}}>
                <ul className="footer-content">
                    <li className="mr-2 "> Monuments and Memorials © 2020 </li>
                    <li className="mr-2"> | </li>
                    <li>
                        <Link to="/resources"> Resources </Link>
                    </li>
                </ul>
            </div>
        );
    }
}

export default connect(Footer.mapStateToProps)(Footer);
