import React from 'react';
import './ResourcePage.scss';
import { NavLink, withRouter } from 'react-router-dom';

class ResourcePage extends React.Component {

    render() {

        return (
            <>
                <div id="resource-page">
                    <div id='resource-page-title'>
                        <b>Resources + Glossary</b>
                    </div>
                    <div>
                        <p> In the descriptions below, monuments and memorials are abbreviated as M+M. </p>
                    </div>
                    <div id="resource-page-body">
                        <p>
                            <br/>

                            <b>Field Descriptions, Formats, and Examples</b>
                            <br/>
                            <p>
                                (note to Ben S, items in red, I am not sure about. Can we discuss with team?)
                                <br/>
                                <br/>
                            </p>

                            <b>Submitted By</b>
                            <br/>
                            <p>
                                The person who provided information about this M+M. Any updates to this record will add name of new contributor to an already existing record.
                                <br/>
                                <u>Format:</u> Inputted from monuments.us.org account holder information.
                                <br/>
                                <u>Example:</u> Juilee Decker
                                <br/>
                                <br/>
                            </p>

                            <b>Artist</b>
                            <br/>
                            <p>
                                The creator of the M+M.
                                <br/>
                                <u>Format:</u> First name Last name.
                                <br/>
                                <u>Example:</u> Enid Yandell
                                <br/>
                                Do not use any punctuation in this field, other than middle initial.
                                <br/>
                                Use proper capitalization.
                                <br/>
                                In the case where more than one artist contributed to the work, use only the primary artist’s name here. Other names may be included in the “Description” field.
                                <br/>
                                <br/>
                            </p>

                            <b>Title</b>
                            <br/>
                            <p>
                                The given title of the work.
                                <br/>
                                <u>Format:</u> Capitalize Beginning Letter of Each Word in Title
                                <br/>
                                <u>Example:</u> Carrie Brown Bajnotti Memorial Fountain
                                <br/>
                                Do not use any punctuation in this field.
                                <br/>
                                If more than one name is given for this work, use the most common name in this field. Other titles may be included in the “Description” field.
                                <br/>
                                <br/>
                            </p>

                            <b>Date</b>
                            <br/>
                            <p>
                                The date that the work was created or dedicated.
                                <br/>
                                <u>Format:</u> Month-Day-Year. mm-dd-yyyy
                                <br/>
                                <u>Example:</u> 06-26-1901
                                <br/>
                                In cases where the year is only known, use default date of 01-01-yyyy.
                                <br/>
                                In cases where no date is known, leave the field blank.
                                <br/>
                                <br/>
                            </p>

                            <b>Description</b>
                            <br/>
                            <p>
                                One sentence summary about this M+M.
                                <br/>
                                <u>Format:</u> The Name of Monument in City was created by Artist in Year. You may find further information about this monument or memorial at: URL.
                                <br/>
                                <u>Example:</u> The Carrie Brown Bajnotti Memorial Fountain was created by Enid Yandell in 1901. You may find further information about this monument or memorial at https://www.brown.edu/Departments/Joukowsky_Institute/courses/architectureandmemory/8145.html.
                                <br/>
                                <br/>
                            </p>

                            <b>Material</b>
                            <br/>
                            <p>
                                The materials from which the M+M is made.
                                <br/>
                                <u>Format:</u> Choose from the tags provided.
                                <br/>
                                <u>Example:</u> Bronze
                                <br/>
                                If more than one material was used in the creation of this work, select all relevant tags from the list provided.
                                <br/>
                                (note to team, who can add a materials tag?)
                                <br/>
                                <br/>
                            </p>

                            <b>Inscription</b>
                            <br/>
                            <p>
                                Any text on the M+M.
                                <br/>
                                <u>Format:</u> Type exactly as words appear on the M+M.
                                <br/>
                                <u>Example:</u> Enid Yandell S. ERECTED AD MDCCCC A GIFT TO HONOR THE MEMORY OF CARRIE MATHILDE DAUGHTER OF THE LATE NICHOLAS BROWN OF PROVIDENCE FROM HER HUSBAND PAUL BAJNOTTI OF TURIN ITALY
                                <br/>
                                Use whatever punctuation is in the original.
                                <br/>
                                <br/>
                            </p>

                            <b>Latitude and Longitude</b>
                            <br/>
                            <p>
                                The longitude and latitude coordinates of M+M location.
                                <br/>
                                <u>Format:</u> degrees, using + for Northern Hemisphere, relative to the equator - for Western Hemisphere, relative to the Greenwich Meridian
                                <br/>
                                <u>Example:</u> 41.835270, -71.461780
                                <br/>
                                To obtain coordinates, use the Google Maps “What’s here?” feature.
                                <br/>
                                See how here (link to: https://support.google.com/maps/answer/18539)
                                <br/>
                                Or, input address here: https://www.latlong.net/
                                <br/>
                                (note to team, how do we prevent someone  from entering 41° 50' 6.972'' N 71° 27' 42.408'' W?
                                ALSO:
                                Can someone just zoom on the map and select a point?
                                Trying to identify all of the ways that users will be able to input this info.)
                                <br/>
                                <br/>
                            </p>

                            <b>City</b>
                            <br/>
                            <p>
                                The city where M+M is located
                                <br/>
                                <u>Format:</u> Use common name of city, with punctuation if required
                                <br/>
                                <u>Example:</u> Providence
                                <br/>
                                <br/>
                            </p>

                            <b>State</b>
                            <br/>
                            <p>
                                The state or territory where M+M is located
                                <br/>
                                <u>Format:</u> Use common abbreviation of state – two letters, no punctuation
                                <br/>
                                <u>Example:</u> RI
                                <br/>
                                (note to team, does city/state pull from GPS  coordinates automatically? It doesn’t have to do that,  I just want to give clear instructions)
                                <br/>
                                <br/>
                            </p>

                            <b>Tags</b>
                            <br/>
                            <p>
                                Terms that are relevant to describe the M+M
                                <br/>
                                <u>Format:</u> Use terms from pre-defined list
                                <br/>
                                <u>Example:</u> woman artist, typhoid, Brown University
                                <br/>
                                (note to team, who can add tags?  Can any user suggest tag?  How should I explain this?)
                                <br/>
                                <br/>
                            </p>

                            <b>Reference</b>
                            <br/>
                            <p>
                                Location where reliable information was found
                                <br/>
                                <u>Format:</u> URL
                                <br/>
                                <u>Example:</u> https://siris-artinventories.si.edu/ipac20/ipac.jsp?&profile=ariall&source=~!siartinventories&uri=full=3100001~!12792~!0#focus
                                <br/>
                                <br/>
                            </p>

                            <b>Images</b>
                            <br/>
                            <p>
                                Upload an image that you have taken or from another location
                                <br/>
                                <u>Format:</u> .jpg						 <br/>(note to team, do we have size specs?)
                                <br/>
                                <br/>
                            </p>

                            <b>Temporary</b>
                            <br/>
                            <p>
                                Is this M+M temporary or permanent?
                            </p>
                        </p>
                    </div>
                </div>
            </>
        );
    }
}

export default withRouter(ResourcePage);