import React from 'react';
import './Footer.scss';
import {Link} from 'react-router-dom';

export default class Footer extends React.Component {

    render() {
        return (
            <div className="footer">
                <ul className="footer-content">
                    <li>Monuments + Memorials © {new Date().getFullYear()}</li>
                    <li>
                        <Link to="/resources">Resources</Link>
                    </li>
                    <li>
                        <Link to="/tag-directory">Tag Directory</Link>
                    </li>
                </ul>
            </div>
        );
    }
}
