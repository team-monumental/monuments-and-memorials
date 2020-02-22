import * as React from 'react';
import './Logo.scss';

export default class Logo extends React.Component {
    render() {
        const { size, className } = this.props;
        let pixelSize = parseInt(size.replace('px', ''));
        let logoSize = 192;
        if (pixelSize > 192 && pixelSize <= 512) logoSize = 512;
        if (pixelSize > 512) logoSize = '-full-size';
        return (
            <img className={['logo', className].join(' ')}
                 src={`${process.env.PUBLIC_URL}/logo${logoSize}.png`}
                 alt="Monuments and Memorials Logo"
                 width={size}
                 height={size}/>
        )
    }
}