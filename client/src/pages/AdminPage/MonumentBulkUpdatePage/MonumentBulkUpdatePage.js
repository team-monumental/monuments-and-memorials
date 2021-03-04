import React from 'react';
import './MonumentBulkUpdatePage.scss';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import BulkUpdateForm from "../../../components/BulkUpdateForm/BulkUpdateForm";
import { bulkValidateSuggestions, bulkCreateSuggestions, bulkUpdateMonuments} from "../../../actions/bulk-update";
import Spinner from '../../../components/Spinner/Spinner';
import ErrorModal from '../../../components/Error/ErrorModal/ErrorModal';
import { Modal, ProgressBar } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { Role } from '../../../utils/authentication-util'

/**
 * Root container for the page to bulk suggest Monument updates
 */
class MonumentBulkUpdatePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showingErrorModal: false,
            showValidationResults: false,
            showUpdateResults: false,
            term: Role.RESEARCHER_OR_ABOVE.includes(props.role.toUpperCase()) ? 'Update' : 'Suggest'
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.error && !prevState.showingErrorModal) {
            this.setState({showingErrorModal: true});
        }
        else if (this.props.createSuggestionResult && !this.props.bulkSuggestionCreatePending) {
            this.props.history.push('/panel/suggestion-created?type=bulk');
        }
        else if (this.props.createResult && !this.props.bulkUpdatePending && !prevProps.createResult) {
            this.setState({showUpdateResults: true})
        } else if (prevState.showUpdateResults) {
            this.setState({showUpdateResults: false})
        }
    }

    static mapStateToProps(state) {
        return {
            ...state.session,
            ...state.bulkUpdatePage
        };
    }
}