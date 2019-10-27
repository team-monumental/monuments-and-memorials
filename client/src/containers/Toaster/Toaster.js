import React from 'react';
import './Toaster.scss';
import { connect } from 'react-redux';
import { removeToast } from '../../actions/toasts';
import Toast from '../../components/Toast/Toast';

/**
 * Container for Toasts, which listens to redux actions adding and removing Toasts
 */
class Toaster extends React.Component {

    static mapStateToProps(state) {
        return {
            toasts: state.toasts
        };
    }

    render() {
        const { toasts, dispatch } = this.props;
        return (
            <div className="toasts">
                {toasts.map(toast => (
                    <Toast {...toast} key={toast.id} onDismissClick={() => dispatch(removeToast(toast.id))}/>
                ))}
            </div>
        );
    }
}

export default connect(Toaster.mapStateToProps)(Toaster);
