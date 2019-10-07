import React from 'react';
import './App.css';
import Header from './components/Header/Header';

function App() {
  return (
    <div className="App">
      <Header/>
      <div className="gmaps">
        <div className="mapouter">
          <div className="gmap_canvas">
            <iframe id="gmap_canvas"
                    title="gmaps-iframe"
                    src="https://maps.google.com/maps?q=lincoln%20memorial&t=&z=13&ie=UTF8&iwloc=&output=embed"
                    frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0"></iframe>
            Google Maps Generator by <a href="https://www.embedgooglemap.net">embedgooglemap.net</a></div>
        </div>
      </div>
    </div>
  );
}

export default App;
