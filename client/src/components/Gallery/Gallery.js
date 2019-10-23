import React from 'react';
import './Gallery.scss';
import { Modal } from 'react-bootstrap';

export default class Gallery extends React.Component {

    constructor(props) {
        super(props);
        let selectedImageIndex = props.selectedImageIndex || 0;
        if (props.images && props.images.length) {
            selectedImageIndex = props.images.findIndex(image => image.isPrimary) || selectedImageIndex;
        }
        this.state = {
            modalOpen: false,
            modalPage: 0,
            selectedImageIndex,
            imageTimeout: window.setTimeout(() => this.nextImage(), 5000)
        };
    }

    nextImage() {
        let index = this.state.selectedImageIndex;
        index++;
        if (index === this.props.images.length) index = 0;
        this.setState({
            selectedImageIndex: index,
            imageTimeout: window.setTimeout(() => this.nextImage(), 5000)
        });
        console.log(new Date());
    }

    selectImage(index) {
        window.clearTimeout(this.state.imageTimeout);
        this.setState({
            selectedImageIndex: index,
            imageTimeout: window.setTimeout(() => this.nextImage(), 5000)
        });
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
        const { images } = this.props;

        if (!images || !images.length) {
            return (<div style={{marginBottom: '0'}}/>);
        }
        else {
            return (
                <div className="images">
                    {this.renderModal()}
                    {this.renderSelectedImage()}
                    {this.renderCarousel()}
                </div>
            )
        }
    }

    renderSelectedImage() {
        const { selectedImageIndex } = this.state;
        const { images } = this.props;
        if (!images || !images.length || images.length <= selectedImageIndex) {
            return;
        }
        const selectedImage = images[selectedImageIndex];
        return (
            <div className="primary image-wrapper">
                <div className="primary image" style={{backgroundImage: `url(${selectedImage.url})`}}/>
                <div className="overlay" onClick={() => this.openModal(selectedImage)}>
                    <i className="material-icons">
                        open_in_new
                    </i>
                </div>
            </div>
        )
    }

    renderCarousel() {
        const { selectedImageIndex } = this.state;
        const { images } = this.props;
        if (!images || !images.length) return;
        return (
            <div className="image-selection">
                {
                    images.map((image, index) => (
                        <span className={`image-option${index === selectedImageIndex ? ' selected' : ''}`}
                              onClick={() => this.selectImage(index)}/>
                    ))
                }
            </div>
        );
    }

    renderModal() {
        const { modalOpen, selectedImageIndex } = this.state;
        const { images } = this.props;
        const selectedImage = images[selectedImageIndex];
        return (
            <div onClick={e => e.stopPropagation()}>
                <Modal show={modalOpen} onHide={() => this.closeModal()}>
                    <Modal.Header closeButton>
                        Image {selectedImageIndex + 1} of {images.length}
                    </Modal.Header>
                    <Modal.Body>
                        <div className="d-flex justify-content-center">
                            <img src={selectedImage.url} alt="large"/>
                        </div>
                        <p className="caption">Image description...</p>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}