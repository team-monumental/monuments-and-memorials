import React from 'react';
import './Toast.scss';
import { Toast as BootstrapToast } from 'react-bootstrap';

export default class Toast extends React.Component {

    render() {
        const { header, body, hide, variant, onDismissClick} = this.props;
        return (
            <BootstrapToast show={!hide} onClose={onDismissClick} className={variant || ''}>
                <BootstrapToast.Header>{header}</BootstrapToast.Header>
                <BootstrapToast.Body>
                    {body}
                </BootstrapToast.Body>
            </BootstrapToast>
        );
    }
}