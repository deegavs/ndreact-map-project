import React, { Component } from 'react';
import axios from 'axios'
import './App.css';

import Sidebar from './Components/Sidebar';
import Map from './Components/Map'
import Header from './Components/Header'
import Footer from './Components/Footer'

class App extends Component {

  state = {
    allVenues: [],
    venues: [],
    markers: [],
    
  }

  componentDidMount () {
    this.getVenues("food", "cologne")
  }
  
  renderMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyDBUPwvZP16oEeG1GvFk3hx0FwJVOWQdEM&callback=initMap")
    window.initMap = this.initMap
  }

  getVenues = (query, location) => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?"
    const myParams = {
      client_id: "MXYUTHBT3IRIRWB4F5P5GRNW1QDJT3BU0FW313MDR0YE1M5J",
      client_secret: "YK5KJ4SPJXT5DC3SXZPTOVERDK14D0SPNGLPXSH3OLTM5LIY",
      query: query,
      near: location,
      v: "20190702"
    }

    axios.get(endPoint + new URLSearchParams(myParams))
      .then(response => {
        this.setState ({
          allVenues:response.data.response.groups[0].items,
          venues: response.data.response.groups[0].items
        }, this.renderMap())
        
      })
      .catch(error => {
        console.log("error!" + error)
      })
  }

  initMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 50.9411975, lng: 6.9562132},
      zoom: 13
    })

    // create infoWindow
    let infowindow = new window.google.maps.InfoWindow()

    this.state.venues.map(availVenue => {

      // create dynamic markers
      let marker = new window.google.maps.Marker({ 
        position: {lat: availVenue.venue.location.lat , lng: availVenue.venue.location.lng},
        map: map,
        animation: window.google.maps.Animation.DROP,
        title: availVenue.venue.name
      })

      // Create InfoWindow
      let contentString = `
          <h1>${availVenue.venue.name}</h1>
          <p>Address: ${availVenue.venue.location.formattedAddress[0]} 
          ${availVenue.venue.location.formattedAddress[1]} ${availVenue.venue.location.formattedAddress[2]}</p>
          </p>`

      // Add each created marker to the 'markers' array
      this.state.markers.push(marker)
      
      // open an infoWindow on click
      marker.addListener('click', function() {
        // change infoWindow content
        infowindow.setContent(contentString)
        // open an infoWindow
        infowindow.open(map, marker)

        // set marker animation
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(window.google.maps.Animation.BOUNCE);
          setTimeout(function(){ marker.setAnimation(null); }, 750);
      }

      })

    })

  }

  render() {
    return (
      <div id="App">
        
          <Header/>
          <main id="page-wrap">
            <Sidebar 
              venues={this.state.allVenues} 
              markers={this.state.markers} 
              updateVenues={this.updateVenues}
            />

            <Map />
          </main>  
          <Footer />
      </div>
    );
  }
}

  function loadScript(url) {
   const index = window.document.getElementsByTagName("script")[0]
   const script = window.document.createElement("script")
   script.src = url
   script.async = true
   script.defer = true
   index.parentNode.insertBefore(script, index)
  }

export default App;
