import * as React from 'react';
import './Login.scss';
import { Card, Form } from 'react-bootstrap';
import Logo from '../Logo/Logo';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { validEmailRegex } from '../../utils/string-util';

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            validated: false,
            email: '',
            password: '',
            errors: {
                email: '',
                password: ''
            }
        };
    }

    validateForm(errors) {
        let valid = true;
        for (let name of ['email', 'password']) {
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
        const { onLogin } = this.props;
        const { errors, email, password } = this.state;
        event.preventDefault();
        if (this.validateForm(errors)) {
            onLogin({email, password});
        }
    }

    handleChange(event) {
        const { errors } = this.state;
        const { name, value } = event.target;
        if (event.preventDefault) event.preventDefault();

        switch (name) {
            case 'email':
                errors.email = validEmailRegex.test(value)
                    ? ''
                    : 'Email is not valid';
                break;
            case 'password':
                errors.password = value
                    ? ''
                    : 'Password is required';
                break;
            default:
                break;
        }

        this.setState({errors, [name]: value})
    }

    render() {
        const { email, password, validated, errors } = this.state;
        const { error, warn } = this.props;

        return (
            <Card className="login">
                <Card.Header>
                    <Card.Title className="text-center">
                        <Logo size="35px"/>
                        <span>
                            Login
                        </span>
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    {warn && <div className="error-message mb-3">
                        You must log in to view that page.
                    </div>}
                    <Form className="login-form" noValidate onSubmit={event => this.handleSubmit(event)}>
                        <Form.Group>
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="email"
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
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={password}
                                onChange={event => this.handleChange(event)}
                                minLength="3"
                                className="text-control"
                                required
                                noValidate
                                isInvalid={errors.password && validated}
                            />
                            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                        </Form.Group>
                        {error && <div className="error-message mb-3">
                            {error}
                        </div>}
                        <Button type="submit" className="w-100">
                            Log In
                        </Button>
                        <div>
                            Not a member? <Link to="/signup">Sign up now</Link>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        )
    }
}