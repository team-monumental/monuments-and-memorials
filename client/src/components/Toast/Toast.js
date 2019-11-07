import React from 'react';
import './Toast.scss';
import { Toast as BootstrapToast } from 'react-bootstrap';

/**
 * A notification displayed at the top of the screen
 * These are created by the Toaster using redux actions
 */
export default class Toast extends React.Component {

    render() {
        const { title, message, header, body, hide, variant, onDismissClick} = this.props;
        return (
            <BootstrapToast show={!hide} onClose={onDismissClick} className={variant || ''}>
                <BootstrapToast.Header>{
                    header ? header :
                        (<div className="mr-auto">{title}</div>)
                }</BootstrapToast.Header>
                <BootstrapToast.Body>{
                    body ? body :
                        (<div>{message}</div>)
                }</BootstrapToast.Body>
            </BootstrapToast>
        );
    }
}