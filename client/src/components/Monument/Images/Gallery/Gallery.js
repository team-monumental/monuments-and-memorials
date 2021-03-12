import React from 'react';
import './Gallery.scss';
import { Modal } from 'react-bootstrap';
import Pagination from '../../../Pagination/Pagination';
import { getS3ImageNameFromObjectUrl } from '../../../../utils/api-util';

export default class Gallery extends React.Component {

    constructor(props) {
        super(props);
        let selectedImageIndex = props.selectedImageIndex || 0;
        if (props.images && props.images.length) {
            selectedImageIndex = props.images.findIndex(image => image.isPrimary) || selectedImageIndex;
            if (selectedImageIndex < 0) selectedImageIndex = 0;
        }
        const imageRotationAnimationLength = props.imageRotationAnimationLength || 1000;
        const imageRotationInterval = (props.imageRotationInterval || 10000) - imageRotationAnimationLength;
        this.state = {
            modalOpen: false,
            modalImageIndex: 0,
            selectedImageIndex,
            imageRotationInterval,
            imageRotationAnimationLength,
            animating: false,
            imageTimeout: window.setTimeout(() => this.nextImage(), imageRotationInterval)
        };
    }

    nextImage() {
        let index = this.state.selectedImageIndex;
        index++;
        if (index === this.props.images.length) index = 0;
        this.animate(index);
    }

    selectImage(index) {
        window.clearTimeout(this.state.imageTimeout);
        this.animate(index);
    }

    animate(index) {
        const { images } = this.props;
        if (images.length <= 1) {
            this.setState({animating: false});
            return;
        }

        this.setState({
            animationIndex: index,
            animating: true
        });
        const { imageTimeout, imageRotationAnimationLength } = this.state;
        window.setTimeout(() => {
            if (imageTimeout !== this.state.imageTimeout) return;
            this.setState({
                selectedImageIndex: index,
                imageTimeout: window.setTimeout(() => this.nextImage(), this.state.imageRotationInterval)
            });
            // This additional delay is used to fix some choppiness that occurs due to the image loading in right as the
            // one above it is hidden. This gives the image 100ms to load in, making the transition guaranteed to be smooth
            window.setTimeout(() => {
                this.setState({
                    animating: false,
                    animationIndex: index
                })
            }, 100);
        }, imageRotationAnimationLength);
    }

    openModal(image) {
        this.setState({
            modalOpen: true,
            modalImageIndex: this.props.images.findIndex(i => {
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
                <div className="gallery">
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
        const ariaLabel = this.getAltText(selectedImage)
        return (
            <>
                <div className="image-wrapper" role="img" aria-label={ariaLabel}>
                    <div className="image" style={{backgroundImage: `url("${selectedImage.url}")`}} />
                    {this.renderAnimation()}
                    <div className="overlay" onClick={() => this.openModal(selectedImage)}>
                        <i className="material-icons">
                            open_in_new
                        </i>
                    </div>
                </div>
                {selectedImage.caption && <div style={{ margin: '0 auto', textAlign: 'center' }}>
                    {selectedImage.caption}
                </div>}
                {selectedImage.referenceUrl && <div style={{ margin: '0 auto', textAlign: 'center' }}>
                    <span className="detail-label">Reference:&nbsp;</span>
                    <a href={selectedImage.referenceUrl}>{selectedImage.referenceUrl}</a>
                </div>}
            </>
        )
    }

    renderCarousel() {
        const { selectedImageIndex, animating, animationIndex } = this.state;
        const { images } = this.props;
        if (!images || images.length <= 1) return;
        return (
            <div className="image-selection">
                {
                    images.map((image, index) => {
                        let className = 'image-option';
                        if ((animating && index === animationIndex) || (!animating && index === selectedImageIndex)) {
                            className += ' selected';
                        }
                        if (animating) className += ' animating';
                        return (
                            <span key={image.id} className={className}
                                  onClick={() => {
                                      if (this.state.animating) return;
                                      this.selectImage(index);
                                  }}/>
                        )
                    })
                }
            </div>
        );
    }

    renderAnimation() {
        const { animating, animationIndex } = this.state;
        const { images } = this.props;
        const animationImage = animating ? images[animationIndex] : null;
        return (
            <div className="animation image" style={{
                backgroundImage: animating ? `url(${animationImage.url})` : null,
                opacity: animating ? 1 : 0,
                transitionDuration: animating ? '1s' : '0s',
                visibility: animating ? 'visible' : 'hidden'
            }}/>
        )
    }

    renderModal() {
        const { modalOpen, modalImageIndex } = this.state;
        const { images } = this.props;
        const selectedImage = images[modalImageIndex];
        const altText = this.getAltText(selectedImage)
        return (
            <div onClick={e => e.stopPropagation()}>
                <Modal show={modalOpen} onHide={() => this.closeModal()} className="image-view-modal">
                    <Modal.Header closeButton>
                        Image {modalImageIndex + 1} of {images.length}
                    </Modal.Header>
                    <Modal.Body>
                        <img src={selectedImage.url} alt={altText} />
                        <div className="imageInfo">
                            {selectedImage.caption && <div style={{ margin: '0 auto', textAlign: 'center' }}>
                                {selectedImage.caption}
                            </div>}
                            {selectedImage.referenceUrl && <div style={{ margin: '0 auto', textAlign: 'center' }}>
                                <span className="detail-label">Reference:&nbsp;</span>
                                <a href={selectedImage.referenceUrl}>{selectedImage.referenceUrl}</a>
                            </div>}
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="d-flex justify-content-center">
                        <Pagination count={images.length} page={modalImageIndex} onPage={page => {
                            this.setState({modalImageIndex: page});
                        }}/>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }

    getAltText(image) {
        const { tags } = this.props;
        const imageFileName = image ? getS3ImageNameFromObjectUrl(image.url) : 'None';
        const imageName = imageFileName ? imageFileName.split('.')[0] : 'None';
        let tagsStrings = tags.map(tag => tag.name)
        return `${imageName}:  a representation of ${tagsStrings}`
    }
}