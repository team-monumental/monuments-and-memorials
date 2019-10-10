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
        console.log(monument);
        const monumentProperties = [];
        for (let prop in monument) {
            if (!monument.hasOwnProperty(prop)) continue;
            monumentProperties.push({name: prop, value: monument[prop]});
        }
        this.setState({monument, monumentProperties});
    }

    render() {
        return (
            <div className="page-container">
                <div className="fields">
                    {this.state.monumentProperties.map(prop =>
                        <div key={prop.name}>
                            <span style={{fontWeight: 'bold'}}>{prop.name}:&nbsp;</span>
                            <span>{prop.value}</span>
                        </div>
                    )}
                </div>
                <div className="map">
                    <iframe title="gmaps-iframe"
                            src={`https://maps.google.com/maps?q=${this.state.monument.coordinatePointAsString}&z=16&output=embed`}
                            frameBorder="0"/>
                </div>
            </div>
        )
    }
}