import React from 'react';
import './Monument.css';

export default class Monument extends React.Component {

    constructor(props) {
        super(props);
        this.state = {monument: {}, monumentProperties: []};
    }

    async componentDidMount() {
        const { match: { params } } = this.props;

        const response = await fetch(`/api/monument/${params.monumentId}`);
        const monument = await response.json();
        const monumentProperties = [];
        for (let prop in monument) {
            if (!monument.hasOwnProperty(prop)) continue;
            monumentProperties.push({name: prop, value: monument[prop]});
        }
        this.setState({monument, monumentProperties});
    }

    render() {
        return (
            <div>
                {this.state.monumentProperties.map(prop =>
                    <div>
                        <span style={{fontWeight: 'bold'}}>{prop.name}:&nbsp;</span>
                        <span>{prop.value}</span>
                    </div>
                )}
            </div>
        )
    }
}