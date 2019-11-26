import React from 'react';
import './CreatePage.scss'
import { connect } from 'react-redux';

import CreateForm from '../../components/CreateForm/CreateForm';
import ContributionAppreciation from "../../components/CreateForm/ContributionAppreciation/ContributionAppreciation";
import createMonument from "../../actions/create";

/**
 * Root container for the create a new Monument page
 */
class CreatePage extends React.Component {

    static mapStateToProps(state) {
        return state.createPage;
    }

    handleCreateFormCancelButtonClick() {
        this.props.history.goBack();
    }

    handleCreateFormSubmit(form) {
        const { dispatch } = this.props;
        dispatch(createMonument(form));
    }

    render() {
        return (
            <div className="create-page-container">
                <div className="column thank-you-column">
                    <ContributionAppreciation/>
                </div>
                <div className="column form-column">
                    <CreateForm
                        onCancelButtonClick={() => this.handleCreateFormCancelButtonClick()}
                        onSubmit={(form) => this.handleCreateFormSubmit(form)}
                    />
                </div>
            </div>
        );
    }

}

export default connect(CreatePage.mapStateToProps)(CreatePage);