import * as React from 'react';
import './BeginPasswordReset.scss';
import { validEmailRegex } from '../../utils/string-util';
import { Card, Form } from 'react-bootstrap';
import Logo from '../Logo/Logo';
import Button from 'react-bootstrap/Button';

export default class BeginPasswordReset extends React.Component {

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
        const { onResetPassword } = this.props;
        const { errors, email } = this.state;
        event.preventDefault();
        if (this.validateForm(errors)) {
            onResetPassword(email);
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
        const { email, validated, errors } = this.state;
        const { error, success } = this.props;

        return (
            <Card className="password-reset pb-2">
                <Card.Header>
                    <Card.Title className="text-center">
                        <Logo size="35px"/>
                        <span>
                            Reset Your Password
                        </span>
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    {!success &&
                        <Form className="password-reset-form" noValidate onSubmit={event => this.handleSubmit(event)}>
                            <Form.Group>
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="email"
                                    autoComplete="username"
                                    value={email}
                                    onChange={event => this.handleChange(event)}
                                    minLength="3"
                                    className="text-control"
                                    required
                                    noValidate
                                    isInvalid={errors.email && validated}
                                />
                                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                            </Form.Group>
                            {error && <div className="error-message mb-3">
                                {error}
                            </div>}
                            <Button type="submit" className="w-100">
                                Send Reset Link
                            </Button>
                        </Form>
                    }
                    {success &&
                        <div>
                            An email has been sent to your email address with instructions on how to reset your password.
                        </div>
                    }
                </Card.Body>
            </Card>
        );
    }
}