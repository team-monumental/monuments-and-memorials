import * as React from 'react';
import './Signup.scss';
import { Card, Form } from 'react-bootstrap';
import Logo from '../Logo/Logo';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { validEmailRegex } from '../../utils/string-util';

export default class Signup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            validated: false,
            name: '',
            email: '',
            password: '',
            matchingPassword: '',
            errors: {
                name: '',
                email: '',
                password: '',
                matchingPassword: ''
            }
        };
    }

    validateForm(errors) {
        let valid = true;
        for (let name of ['name', 'email', 'password', 'matchingPassword']) {
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
        const { onSignup } = this.props;
        const { errors, email, password, matchingPassword, name } = this.state;
        event.preventDefault();
        if (this.validateForm(errors)) {
            onSignup({email, password, matchingPassword, name});
        }
    }

    handleChange(event) {
        const { errors, password } = this.state;
        const { name, value } = event.target;
        if (event.preventDefault) event.preventDefault();

        switch (name) {
            case 'name':
                errors.name = value
                    ? ''
                    : 'Full Name is required';
                break;
            case 'email':
                errors.email = validEmailRegex.test(value)
                    ? ''
                    : 'Email is not valid';
                break;
            case 'password':
                errors.password = value.length < 8
                    ? 'Password must be 8 characters long'
                    : '';
                break;
            case 'matchingPassword':
                errors.matchingPassword = value === password
                    ? ''
                    : 'Passwords must match';
                break;
            default:
                break;
        }

        this.setState({errors, [name]: value})
    }

    render() {
        const { email, password, matchingPassword, name, errors, validated } = this.state;
        const { error, result } = this.props;

        return (
            <Card className="signup">
                <Card.Header>
                    <Card.Title className="text-center">
                        <Logo size="35px"/>
                        <span>
                            Sign Up
                        </span>
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    {!result &&
                        <Form className="signup-form" noValidate onSubmit={event => this.handleSubmit(event)}>
                            <Form.Group>
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={name}
                                    onChange={event => this.handleChange(event)}
                                    className="text-control"
                                    required
                                    noValidate
                                    isInvalid={errors.name && validated}
                                />
                                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={event => this.handleChange(event)}
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
                                    minLength="8"
                                    className="text-control"
                                    required
                                    noValidate
                                    isInvalid={errors.password && validated}
                                />
                                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="matchingPassword"
                                    value={matchingPassword}
                                    onChange={event => this.handleChange(event)}
                                    className="text-control"
                                    required
                                    noValidate
                                    isInvalid={errors.matchingPassword && validated}
                                />
                                <Form.Control.Feedback type="invalid">{errors.matchingPassword}</Form.Control.Feedback>
                            </Form.Group>
                            {error && <div className="error-message mb-3">
                                {error}
                            </div>}
                            <Button type="submit" className="w-100">
                                Sign Up
                            </Button>
                            <span>
                                Already a member? <Link to="/login">Login now</Link>
                            </span>
                        </Form>
                    }
                    {result &&
                        <div className="text-center">
                            Success! You have been registered.
                        </div>
                    }
                </Card.Body>
            </Card>
        )
    }
}