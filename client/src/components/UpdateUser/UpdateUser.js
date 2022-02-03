import * as React from 'react';
import './UpdateUser.scss';
import {Card, Form} from 'react-bootstrap';
import {validEmailRegex} from '../../utils/string-util';
import Button from 'react-bootstrap/Button';
import {Link, withRouter} from 'react-router-dom';

export class UpdateUser extends React.Component {

    constructor(props) {
        super(props);
        const {user} = props;
        this.state = {
            validated: false,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            errors: {
                firstName: '',
                lastName: '',
                email: ''
            }
        };
    }

    validateForm(errors) {
        let valid = true;
        for (let name of ['firstName', 'lastName', 'email']) {
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
        const {onSubmit} = this.props;
        const {errors, email, firstName, lastName} = this.state;
        event.preventDefault();
        if (this.validateForm(errors)) {
            onSubmit({email, firstName, lastName});
        }
    }

    handleChange(event) {
        const {errors} = this.state;
        const {name, value} = event.target;
        if (event.preventDefault) event.preventDefault();

        switch (name) {
            case 'firstName':
                errors.firstName = value
                    ? ''
                    : 'First name is required';
                break;
            case 'lastName':
                errors.lastName = value
                    ? ''
                    : 'Last name is required';
                break;
            case 'email':
                errors.email = validEmailRegex.test(value)
                    ? ''
                    : 'Email is not valid';
                break;
            default:
                break;
        }

        this.setState({errors, [name]: value})
    }

    render() {
        const {email, firstName, lastName, errors, validated} = this.state;
        const {error, success, needsConfirmation, history, user} = this.props;

        const hasChanges = (email !== user.email) || (firstName !== user.firstName) || (lastName !== user.lastName);

        return (
            <div className="d-flex flex-column align-items-center">
                <Card className="mb-4">
                    <Card.Header>
                        <Card.Title>Update Your Information</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        {!success &&
                            <Form className="update-account-form" noValidate
                                  onSubmit={event => this.handleSubmit(event)}>
                                <Form.Group>
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="firstName"
                                        autoComplete="given-name"
                                        value={firstName}
                                        onChange={event => this.handleChange(event)}
                                        className="text-control"
                                        required
                                        noValidate
                                        isInvalid={errors.firstName && validated}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lastName"
                                        autoComplete="family-name"
                                        value={lastName}
                                        onChange={event => this.handleChange(event)}
                                        className="text-control"
                                        required
                                        noValidate
                                        isInvalid={errors.lastName && validated}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        autoComplete="username"
                                        value={email}
                                        onChange={event => this.handleChange(event)}
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
                                <Button type="submit" className="w-100" disabled={!hasChanges}>
                                    Submit
                                </Button>
                            </Form>
                        }
                        {success && <>
                            <div>
                                Your information has been updated successfully.
                            </div>
                            {needsConfirmation && <>
                                <div className="my-2 needs-confirmation-text">An email has been sent to your new email
                                    address with instructions on how to finish changing your email address.
                                </div>
                                <div>You will now need to log in again with your new email address.</div>
                            </>}
                        </>}
                    </Card.Body>
                    {success &&
                        <Card.Footer className="d-flex justify-content-end">
                            {needsConfirmation &&
                                <Link to="/login" className="btn btn-primary">
                                    Log In
                                </Link>
                            }
                            {!needsConfirmation &&
                                <Button onClick={() => history.goBack()}>
                                    <i className="material-icons">
                                        arrow_back
                                    </i>
                                    Back
                                </Button>
                            }
                        </Card.Footer>
                    }
                </Card>
            </div>
        );
    }
}

export default withRouter(UpdateUser);