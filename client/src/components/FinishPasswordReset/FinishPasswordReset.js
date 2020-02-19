import * as React from 'react';
import './FinishPasswordReset.scss';
import { Card, Form } from 'react-bootstrap';
import Logo from '../Logo/Logo';
import Button from 'react-bootstrap/Button';
import * as QueryString from 'query-string';
import { withRouter } from 'react-router-dom';

export class FinishPasswordReset extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: null,
            validated: false,
            token: null,
            password: '',
            newPassword: '',
            matchingNewPassword: '',
            errors: {
                password: '',
                newPassword: '',
                matchingNewPassword: ''
            }
        };
    }

    componentDidMount() {
        this.initialize();
    }

    initialize() {
        const { location: { search } } = this.props;
        const token = QueryString.parse(search).token;

        if (!token) {
            // How did you get here you little rascal?
            return this.setState({redirect: '/'});
        } else {
            this.setState({token});
        }
    }

    validateForm(errors) {
        let valid = true;
        for (let name of ['password', 'newPassword', 'matchingNewPassword']) {
            this.handleChange({
                target: {
                    name,
                    value: this.state[name]
                }
            });
        }
        for (let message of Object.values(errors)) {
            if (message.length > 0) valid = false;
        }
        this.setState({validated: true});
        return valid;
    }

    handleSubmit(event) {
        const { onResetPassword } = this.props;
        const { errors, token, password, newPassword, matchingNewPassword } = this.state;
        event.preventDefault();
        if (this.validateForm(errors)) {
            onResetPassword({token, password, newPassword, matchingNewPassword});
        }
    }

    handleChange(event) {
        const { errors, newPassword } = this.state;
        const { name, value } = event.target;
        if (event.preventDefault) event.preventDefault();

        switch (name) {
            case 'password':
                errors.password = typeof value === 'string' && value.length > 0;
                break;
            case 'newPassword':
                errors.newPassword = value.length < 8
                    ? 'Password must be 8 characters long'
                    : '';
                break;
            case 'matchingNewPassword':
                errors.matchingNewPassword = value === newPassword
                    ? ''
                    : 'Passwords must match';
                break;
            default:
                break;
        }

        this.setState({errors, [name]: value})
    }

    render() {
        const { password, newPassword, matchingNewPassword, validated, errors } = this.state;
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
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={event => this.handleChange(event)}
                                    minLength="8"
                                    className="text-control"
                                    required
                                    noValidate
                                    isInvalid={errors.password && validated}
                                />
                                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>New Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="newPassword"
                                    autoComplete="new-password"
                                    value={newPassword}
                                    onChange={event => this.handleChange(event)}
                                    minLength="8"
                                    className="text-control"
                                    required
                                    noValidate
                                    isInvalid={errors.newPassword && validated}
                                />
                                <Form.Control.Feedback type="invalid">{errors.newPassword}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Confirm New Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="matchingNewPassword"
                                    autoComplete="new-password"
                                    value={matchingNewPassword}
                                    onChange={event => this.handleChange(event)}
                                    className="text-control"
                                    required
                                    noValidate
                                    isInvalid={errors.matchingNewPassword && validated}
                                />
                                <Form.Control.Feedback type="invalid">{errors.matchingNewPassword}</Form.Control.Feedback>
                            </Form.Group>
                            {error && <div className="error-message mb-3">
                                {error}
                            </div>}
                            <Button type="submit" className="w-100">
                                Change Password
                            </Button>
                        </Form>
                    }
                    {success &&
                        <div>
                            Success! Your password has been changed.
                        </div>
                    }
                </Card.Body>
            </Card>
        );
    }
}

export default withRouter(FinishPasswordReset);