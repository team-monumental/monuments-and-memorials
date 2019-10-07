import React from 'react';
import './Logo.css';

export default class Logo extends React.Component {
    render() {
        return (
            <div className="logo">
                <div className="M">
                    M
                </div>
                <div className="col">
                    <span>emorials<span style={{fontSize: '0.5em'}}>&nbsp;</span>&</span>
                    <span>onuments</span>
                </div>
            </div>
        );
    }
}
