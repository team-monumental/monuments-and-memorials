import React from 'react';
import './FeedbackModal.scss';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { isEmptyObject } from '../../../utils/object-util';

/**
 * Presentational component for the Model shown when a Bulk Monument Create operation completes
 */
export default class FeedbackModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showing: false
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (isEmptyObject(prevProps.bulkCreateResult) &&
            !isEmptyObject(this.props.bulkCreateResult)) {
            this.setState({showing: true});
        }
    }

    handleClose() {
        const { onClose } = this.props;

        this.setState({showing: false});

        onClose();
    }

    render() {
        const { showing } = this.state;
        const { bulkCreateResult } = this.props;

        let invalidCsvRowsSectionDetails = (
          <div/>
        );

        if (!isEmptyObject(bulkCreateResult.invalidCsvMonumentRecordsByRowNumber)) {
            invalidCsvRowsSectionDetails = Object.keys(bulkCreateResult.invalidCsvMonumentRecordsByRowNumber).map((key) => {
                const invalidReasons = bulkCreateResult.invalidCsvMonumentRecordErrorsByRowNumber[key].map((value, index) => {
                   return (
                       <li key={key + '-reason-' + index}>
                           {value}
                       </li>
                   );
                });

                return (
                    <div
                        className={'invalid-csv-row-detail-container'}
                        key={key}
                    >
                        <div className='row-number'>
                            <span className='font-weight-bold'>Row Number: </span>{key}
                        </div>
                        <div className="csv-row">
                            <span className='font-weight-bold'>CSV Row:</span>
                            <div className="csv-row-details">
                                {bulkCreateResult.invalidCsvMonumentRecordsByRowNumber[key]}
                            </div>
                        </div>
                        <div className='reasons'>
                            <span className='font-weight-bold'>Reasons: </span>
                            <ul>
                                {invalidReasons}
                            </ul>
                        </div>
                    </div>
                );
            });
        }

        const invalidCsvRowsSection = (
            <div className='invalid-csv-rows-container'>
                <h6>Invalid CSV Row(s):</h6>
                <div className='invalid-csv-rows-detail-container'>
                    {invalidCsvRowsSectionDetails}
                </div>
            </div>
        );

        return (
            <Modal
                show={showing}
                onHide={() => this.handleClose()}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Bulk Create Results</Modal.Title>
                </Modal.Header>
                <hr/>
                <Modal.Body>
                    <p>
                        Using the CSV file you provided, we successfully created {bulkCreateResult.monumentsInsertedCount} new
                        Monuments and Memorials! Thanks!
                    </p>

                    {!isEmptyObject(bulkCreateResult.invalidCsvMonumentRecordsByRowNumber) && invalidCsvRowsSection}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        onClick={() => this.handleClose()}
                    >
                        Continue
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}