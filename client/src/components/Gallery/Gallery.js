import React from 'react';
import './Gallery.scss';
import { Modal, Pagination } from 'react-bootstrap';

export default class Gallery extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            modalPage: 0
        };
    }

    openModal(image) {
        this.setState({
            modalOpen: true,
            modalPage: this.props.images.findIndex(i => {
                return i.id === image.id;
            })
        });
    }

    closeModal() {
        this.setState({modalOpen: false});
    }

    render() {
        const images = JSON.parse(JSON.stringify(this.props.images));
        let primaryImage = images.find(e => e.isPrimary === true);

        primaryImage = primaryImage !== undefined ?
            primaryImage :
            images.splice(0, 1);

        if (!images || !images.length) {
            return (<div style={{marginBottom: '0'}}/>);
        }
        else {
            return (
                <div className="images">
                    {this.renderModal()}
                    {this.renderPrimaryImage(primaryImage, images)}
                    {this.renderSecondaryImages(images)}
                </div>
            )
        }
    }

    renderPrimaryImage(primaryImage, images) {
        return (
            <div className={`primary image-wrapper${images.length === 0 ? ' only' : ''}`}>
                <div className="primary image" style={{backgroundImage: `url(${primaryImage.url})`}}/>
                <div className="overlay" onClick={() => this.openModal(primaryImage)} style={{height: '29rem', width: '29rem', borderRadius: '14px', left: '0'}}>
                    <i className="material-icons">
                        open_in_new
                    </i>
                </div>
            </div>
        )
    }

    renderSecondaryImages(images) {
        console.log(images.length);
        let extraImages = [];
        if (images.length > 5) {
            extraImages = images.slice(4);
            images = images.slice(0, 4);
        }
        let count = images.length;
        if (extraImages.length) count++;
        const imageHeight = `${(29 / count) - ((count - 1)/count)}rem`;

        return (
            <div className="secondary-images">
                {images.map(image => {
                    return this.renderSecondaryImage(image, imageHeight)
                })}
                {this.renderShowAll(extraImages, imageHeight)}
            </div>
        )
    }

    renderSecondaryImage(image, imageHeight) {
        return (
            <div key={image.id} className="image-wrapper">
                <div className="image"
                     style={{
                         backgroundImage: `url(${image.url})`,
                         height: imageHeight
                     }}/>
                <div className="overlay" onClick={() => this.openModal(image)} style={{height: imageHeight}}>
                    <i className="material-icons">
                        open_in_new
                    </i>
                </div>
            </div>
        )
    }

    renderShowAll(extraImages, imageHeight) {
        if (!extraImages.length) return;
        return (
            <div className="show-all">
                <div className="image" style={{
                    backgroundImage: `url(${extraImages[0].url})`,
                    height: imageHeight
                }}/>
                <div className="overlay" onClick={() => this.openModal(extraImages[0])} style={{height: imageHeight}}>
                    <div>
                        +{extraImages.length} more
                    </div>
                </div>
            </div>
        )
    }

    renderModal() {
        const { modalOpen, modalPage } = this.state;
        const images = this.props.images;
        const selectedImage = images[modalPage];
        let pagination = [];
        let paginationIndices = [];
        images.forEach((image, index) => {
            if (index < 2 || Math.abs(modalPage - index) < 2 || images.length - index < 2) {

                if (paginationIndices.length > 0) {
                    let lastIndex = paginationIndices[paginationIndices.length - 1];
                    if (lastIndex !== index - 1) {
                        pagination.push((
                            <Pagination.Ellipsis/>
                        ))
                    }
                }

                pagination.push((
                    <Pagination.Item key={image.id} active={image.id === selectedImage.id}
                                     onClick={() => this.setState({modalPage: index})}>{index + 1}</Pagination.Item>
                ));
                paginationIndices.push(index);
            }
        });
        return (
            <div onClick={e => e.stopPropagation()}>
                <Modal show={modalOpen} onHide={() => this.closeModal()}>
                    <Modal.Header closeButton>
                        Image {modalPage + 1} of {images.length}
                    </Modal.Header>
                    <Modal.Body>
                        <img src={selectedImage.url} alt="large"/>
                        {images.length > 1 ?
                            (
                                <div className="d-flex justify-content-center mt-4">
                                    <Pagination>
                                        <Pagination.Prev onClick={() => {
                                            if (modalPage > 0) this.setState({modalPage: modalPage - 1});
                                        }} disabled={modalPage === 0}/>
                                        {pagination}
                                        <Pagination.Next onClick={() => {
                                            if (modalPage < images.length - 1) this.setState({modalPage: modalPage + 1});
                                        }} disabled={modalPage === images.length - 1}/>
                                    </Pagination>
                                </div>
                            ) : undefined
                        }
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}