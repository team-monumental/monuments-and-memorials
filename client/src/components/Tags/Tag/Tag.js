import * as React from 'react';
import './Tag.scss';

export default class Tag extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: props.selected || false
        };
    }

    handleToggleSelect() {
        const { onSelect } = this.props;
        const value = !this.state.selected;
        this.setState({selected: value});
        onSelect(value);
    }

    render() {
        const { name, selectable, selectedIcon } = this.props;
        const { selected } = this.state;

        return (
            <div className="tag text-truncate">
                {name}
                {selectable && (
                    <i className="material-icons" onClick={() => this.handleToggleSelect()}>
                        {selected ? selectedIcon || 'check' : 'add'}
                    </i>
                )}
            </div>
        );
    }
}