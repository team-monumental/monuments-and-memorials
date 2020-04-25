import React from 'react';
import './ResourcePage.scss';
import { Collapse, Button } from 'react-bootstrap';
import TextSearch from '../../components/Header/SearchBar/TextSearch/TextSearch';
import Footer from '../../components/Footer/Footer';
import { capitalize } from '../../utils/string-util';

export default class ResourcePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fields: {
                submittedBy: {}, artist: {}, title: {}, date: {}, description: {}, material: {}, inscription: {},
                latitudeAndLongitude: {}, city: {}, state: {}, tags: {}, reference: {}, images: {}, temporary: {}
            },
            collapseAll: false,
            search: ''
        };
    }

    toggleCollapseField(field) {
        const { fields } = this.state;
        fields[field.name].collapsed = !fields[field.name].collapsed;
        this.setState({fields});
    }

    toggleCollapseAllFields() {
        const { fields, collapseAll } = this.state;
        for (const fieldName in fields) {
            if (!fields.hasOwnProperty(fieldName)) continue;
            fields[fieldName].collapsed = !collapseAll;
        }
        this.setState({
            fields,
            collapseAll: !collapseAll
        });
    }

    render() {
        const { collapseAll, search } = this.state;
        return (
            <div className="page-container">
                <div className="resources page static">
                    <div className="static-page-body">
                        <div className="row">
                            <div className="col">
                                <div className="static-page-title">
                                    <h1>Resources and Glossary</h1>
                                </div>
                                <div className="static-page-text">
                                    <p>
                                        This page provides descriptions, formats, and examples of our system's fields for monuments and memorials, to assist you in submitting changes to our database.
                                    </p>
                                    <div className="collapse-all-search-container">
                                        <div className="d-flex">
                                            <TextSearch disableAnimation
                                                        placeholder="Search fields..."
                                                        value={search}
                                                        className="form-control"
                                                        onSearchChange={search => this.setState({search})}
                                                        onClear={() => this.setState({search: ''})}/>
                                            <Button variant="light" className="btn-sm collapse-btn"
                                                    onClick={() => this.toggleCollapseAllFields()}>
                                                {collapseAll ? 'Show All' : 'Collapse All'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {this.renderFields()}
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }

    renderFields() {
        const { search } = this.state;

        const fields = [];
        for (const fieldName in this.state.fields) {
            if (!this.state.fields.hasOwnProperty(fieldName)) continue;
            const field = this.state.fields[fieldName];
            field.content = this.fieldContent[fieldName];
            field.name = fieldName;
            field.prettyName = capitalize(fieldName.replace(/([A-Z])/g, ' $1').trim());
            fields.push(field);
        }

        return fields.filter(field => field.name.includes(search) || field.prettyName.includes(search))
            .map(field => (
            <div className="row" key={field.name}>
                <div className="col">
                    <div className="static-page-text">
                        <div className="field-name">
                            <i className="material-icons"
                               onClick={() => this.toggleCollapseField(field)}>
                                {field.collapsed ? 'add' : 'remove'}
                            </i>
                            <h5>{field.prettyName}</h5>
                        </div>
                        <Collapse in={!field.collapsed}>
                            <div className="field-content">
                                {field.content}
                            </div>
                        </Collapse>
                    </div>
                </div>
            </div>
        ));
    }

    get fieldContent() {
        return {
            submittedBy: (<>
                <p>
                    The person who provided information about this monument or memorial. Any updates to this record will add name of new contributor to an already existing record.
                </p>
                <p>
                    <span className="important">Format:</span> Inputted from monuments.us.org account holder information.
                </p>
                <p>
                    <span className="important">Example:</span> Juilee Decker
                </p>
            </>),
            artist: (<>
                <p>
                    The creator of the monument or memorial.
                </p>
                <p>
                    <span className="important">Format:</span> First name Last name.
                </p>
                <p>
                    <span className="important">Example:</span> Enid Yandell
                </p>
                <p>
                    Do not use any punctuation in this field, other than middle initial.
                </p>
                <p>
                    Use proper capitalization.
                </p>
                <p>
                    In the case where more than one artist contributed to the work, use only the primary artist’s name here. Other names may be included in the “Description” field.
                </p>
            </>),
            title: (<>
                <p>
                    The given title of the work.
                </p>
                <p>
                    <span className="important">Format:</span> Capitalize Beginning Letter of Each Word in Title
                </p>
                <p>
                    <span className="important">Example:</span> Carrie Brown Bajnotti Memorial Fountain
                </p>
                <p>
                    Do not use any punctuation in this field.
                </p>
                <p>
                    If more than one name is given for this work, use the most common name in this field. Other titles may be included in the “Description” field.
                </p>
            </>),
            date: (<>
                <p>
                    The date that the work was created or dedicated.
                </p>
                <p>
                    <span className="important">Format:</span> Month-Day-Year. mm-dd-yyyy
                </p>
                <p>
                    <span className="important">Example:</span> 06-26-1901
                </p>
                <p>
                    In cases where the year is only known, use default date of 01-01-yyyy.
                </p>
                <p>
                    In cases where no date is known, leave the field blank.
                </p>
            </>),
            description: (<>
                <p>
                    One sentence summary about this monument or memorial.
                </p>
                <p>
                    <span className="important">Format:</span> The Name of Monument in City was created by Artist in Year. You may find further information about this monument or memorial at: URL.
                </p>
                <p>
                    <span className="important">Example:</span> The Carrie Brown Bajnotti Memorial Fountain was created by Enid Yandell in 1901. You may find further information about this monument or memorial at <a href="https://www.brown.edu/Departments/Joukowsky_Institute/courses/architectureandmemory/8145.html">https://www.brown.edu/Departments/Joukowsky_Institute/courses/architectureandmemory/8145.html</a>.
                </p>
            </>),
            material: (<>
                <p>
                    The materials from which the monument or memorial is made.
                </p>
                <p>
                    <span className="important">Format:</span> Choose from the tags provided.
                </p>
                <p>
                    <span className="important">Example:</span> Bronze
                </p>
                <p>
                    If more than one material was used in the creation of this work, select all relevant materials from the list provided.
                </p>
            </>),
            inscription: (<>
                <p>
                    Any text on the monument or memorial.
                </p>
                <p>
                    <span className="important">Format:</span> Type exactly as words appear on the monument or memorial.
                </p>
                <p>
                    <span className="important">Example:</span> Enid Yandell S. ERECTED AD MDCCCC A GIFT TO HONOR THE MEMORY OF CARRIE MATHILDE DAUGHTER OF THE LATE NICHOLAS BROWN OF PROVIDENCE FROM HER HUSBAND PAUL BAJNOTTI OF TURIN ITALY
                </p>
                <p>
                    Use whatever punctuation is in the original.
                </p>
            </>),
            latitudeAndLongitude: (<>
                <p>
                    The longitude and latitude coordinates of the monument or memorial's location.
                </p>
                <p>
                    <span className="important">Format:</span> degrees, using + for Northern Hemisphere, relative to the equator - for Western Hemisphere, relative to the Greenwich Meridian
                </p>
                <p>
                    <span className="important">Example:</span> 41.835270, -71.461780
                </p>
                <p>
                    To obtain coordinates, use the Google Maps “What’s here?” feature.
                </p>
                <img src="/resources/how-to-convert-degrees.png" className="example-image"/>
                <p>
                    Or, input address here: <a href="https://www.latlong.net/">https://www.latlong.net/</a>
                </p>
            </>),
            city: (<>
                <p>
                    The city where the monument or memorial is located.
                </p>
                <p>
                    <span className="important">Format:</span> Use common name of city, with punctuation if required
                </p>
                <p>
                    <span className="important">Example:</span> Providence
                </p>
            </>),
            state: (<>
                <p>
                    The state or territory where the monument or memorial is located.
                </p>
                <p>
                    <span className="important">Format:</span> Use common abbreviation of state – two letters, no punctuation
                </p>
                <p>
                    <span className="important">Example:</span> RI
                </p>
            </>),
            tags: (<>
                <p>
                    Terms that are relevant to describe the monument or memorial.
                </p>
                <p>
                    <span className="important">Format:</span> Use terms from pre-defined list
                </p>
                <p>
                    <span className="important">Example:</span> Woman Artist, Typhoid, Brown University
                </p>
            </>),
            reference: (<>
                <p>
                    Location where reliable information was found.
                </p>
                <p>
                    <span className="important">Format:</span> URL
                </p>
                <p>
                    <span className="important">Example:</span> <a href="https://siris-artinventories.si.edu/ipac20/ipac.jsp?&profile=ariall&source=~!siartinventories&uri=full=3100001~!12792~!0#focus">https://siris-artinventories.si.edu/ipac20/ipac.jsp?&profile=ariall&source=~!siartinventories&uri=full=3100001~!12792~!0#focus</a>
                </p>
            </>),
            images: (<>
                <p>
                    Upload an image that you have taken or from another location.
                </p>
                <p>
                    <span className="important">Format:</span> .jpg, .png
                </p>
            </>),
            temporary: (<>
                <p>
                    Is this monument or memorial temporary or permanent?
                </p>
            </>)
        };
    }
}
