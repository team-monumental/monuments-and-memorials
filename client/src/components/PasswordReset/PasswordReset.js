import * as React from 'react';
import './Login.scss';
import { validEmailRegex } from '../../utils/string-util';

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            validated: false,
            email: '',
            errors: {
                email: ''
            }
        };
    }

    validateForm(errors) {
        let valid = !(errors.email.length > 0);
        this.handleChange({
            target: {
                name: 'email',
                value: this.state.email
            }
        });
        this.setState({validated: true});
        return valid;
    }

    handleSubmit(event) {
        const { onPasswordReset } = this.props;
        const { errors, email } = this.state;
        event.preventDefault();
        if (this.validateForm(errors)) {
            onPasswordReset(email);
        }
    }

    handleChange(event) {
        const { errors } = this.state;
        const { name, value } = event.target;
        if (event.preventDefault) event.preventDefault();

        if (name === 'email') {
            errors.email = validEmailRegex.test(value)
                ? ''
                : 'Email is not valid';
        }

        this.setState({errors, [name]: value})
    }

    render() {

    }
}