import * as React from 'react';
import './DateChange.scss';
import { prettyPrintDate, prettyPrintMonth } from '../../../../utils/string-util';

/**
 * Presentational component for displaying a change in a Monument date
 */
export default class DateChange extends React.Component {

    renderYearChange() {
        const { oldYear, newYear, didChange } = this.props;

        let oldYearDisplay = <span className="old-attribute none">NONE</span>;
        let newYearDisplay = <span className="new-attribute none">NONE</span>;

        if (oldYear) {
            oldYearDisplay = <span className="old-attribute">{oldYear}</span>;
        }

        if (newYear && newYear.length) {
            newYearDisplay = <span className="new-attribute">{newYear}</span>;
        }

        return this.renderChange(oldYearDisplay, newYearDisplay, didChange);
    }

    renderMonthYearChange() {
        const { oldYear, oldMonth, newYear, newMonth, didChange } = this.props;

        let oldMonthYearDisplay = <span className="old-attribute none">NONE</span>;
        let newMonthYearDisplay = <span className="new-attribute none">NONE</span>;

        if (oldMonth && oldYear) {
            oldMonthYearDisplay = <span className="old-attribute">{`${prettyPrintMonth(oldMonth)}, ${oldYear}`}</span>;
        }

        if (newMonth && newYear && newYear.length) {
            newMonthYearDisplay = <span className="new-attribute">{`${prettyPrintMonth(newMonth)}, ${newYear}`}</span>;
        }

        return this.renderChange(oldMonthYearDisplay, newMonthYearDisplay, didChange);
    }

    renderExactDateChange() {
        const { oldDate, newDate, didChange } = this.props;

        let oldDateDisplay = <span className="old-attribute none">NONE</span>;
        let newDateDisplay = <span className="new-attribute none">NONE</span>;

        if (oldDate) {
            oldDateDisplay = <span className="old-attribute">{prettyPrintDate(oldDate)}</span>;
        }

        if (newDate) {
            newDateDisplay = <span className="new-attribute">{prettyPrintDate(newDate)}</span>;
        }

        return this.renderChange(oldDateDisplay, newDateDisplay, didChange);
    }

    renderChange(oldDisplay, newDisplay, didChange) {
        return (
            <div className="attribute-update">
                <span className="attribute-label">Date:&nbsp;</span>
                {oldDisplay}
                <i className="material-icons">arrow_right_alt</i>
                {newDisplay}
                {
                    didChange ?
                        <div/> :
                        <span className="no-attribute-change font-weight-bold">&nbsp;(NO CHANGES)</span>
                }
            </div>
        );
    }

    render() {
        const { type } = this.props;

        switch (type.toLowerCase()) {
            case 'year':
                return this.renderYearChange();
            case 'month-year':
                return this.renderMonthYearChange();
            case 'exact-date':
                return this.renderExactDateChange();
            default:
                return <div/>;
        }
    }
}