import * as React from 'react';
import './Logo.scss';

export default class Logo extends React.Component {
    render() {
        const { size, className } = this.props;
        return (
            <img className={['logo', className].join(' ')}
                 src={process.env.PUBLIC_URL + '/MM-logo-rev-3.png'}
                 alt="Monuments and Memorials Logo"
                 width={size}
                 height={size}/>
        )
    }
}