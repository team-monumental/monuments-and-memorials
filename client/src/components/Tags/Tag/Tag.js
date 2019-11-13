import * as React from 'react';
import './Tag.scss';
import * as QueryString from 'query-string';

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
        const { name, selectable, selectedIcon, isMaterial } = this.props;
        const { selected } = this.state;
        const params = {};
        if (isMaterial) params.materials = name;
        else params.tags = name;
        const link = '/search/?' + QueryString.stringify(params);
        if (selectable) {
            return (
                <div className="tag text-truncate">
                    {name}
                    <i className="material-icons" onClick={() => this.handleToggleSelect()}>
                        {selected ? selectedIcon || 'check' : 'add'}
                    </i>
                </div>
            );
        }
        return (
            <a href={link} className="tag text-truncate">
                {name}
            </a>
        );
    }
}