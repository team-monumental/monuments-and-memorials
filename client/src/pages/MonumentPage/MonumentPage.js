import React from 'react';
import './MonumentPage.scss';
import request from '../../utils/request';
import { connect } from 'react-redux';

import Monument from '../../components/Monument/Monument';

class MonumentPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            monument: {},
            contributions: [],
            images: [],
            tags: [],
            references: [],
            detailsOpen: false,
            modalOpen: false,
            modalImage: null
        };
    }

    async componentDidMount() {
        const { match: { params: { monumentId } } } = this.props;

        let error;
        const results = await Promise.all([
            request(`/api/monument/${monumentId}`),
            request(`/api/contributions/?monumentId=${monumentId}`),
            request(`/api/images/?monumentId=${monumentId}`),
            request(`/api/references/?monumentId=${monumentId}`),
            request(`/api/tags/?monumentId=${monumentId}`)
        ]).catch(err => error = err);

        if (error) {
            console.error(error);
            this.setState({error: error});
            return;
        }

        const [monument, contributions, images, references, tags] = results;
        this.setState({monument, contributions, images, references, tags});
        console.log(this.state);
    }

    render() {
        const {monument, contributions, images, references, tags} = this.state;
        return (
            <div>
                <Monument monument={monument} contributions={contributions} images={images} references={references} tags={tags}/>
            </div>
        )
    }
}

export default connect()(MonumentPage);