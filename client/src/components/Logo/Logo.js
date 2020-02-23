import * as React from 'react';
import './Logo.scss';

export default class Logo extends React.Component {
    render() {
        let { size, className } = this.props;
        size = size || '35px';
        const filename = size.includes('px') && parseInt(size.replace('px', '')) > 64 ?
            'svg/logo.svg' : 'logo128.png';
        return (
            <img className={['logo', className].join(' ')}
                 src={`${process.env.PUBLIC_URL}/${filename}`}
                 alt="Monuments and Memorials Logo"
                 width={size}
                 height={size}/>
        )
    }
}