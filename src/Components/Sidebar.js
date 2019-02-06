import React from 'react'
import { slide as Menu } from 'react-burger-menu'

import escapeRegExp from 'escape-string-regexp'


// Venues Data
class Sidebar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
        query: '',
        venues: this.props.venues,
        menuOpen: false
    }
  }

  handleStateChange (state) {
    this.setState({menuOpen: state.isOpen})  
  }

  closeMenu () {
    this.setState({menuOpen: false})
  }

  toggleMenu () {
    this.setState({menuOpen: !this.state.menuOpen})
  }
    updateQuery = (query) => {
        this.setState({ query })
        
        let allVenues = this.props.venues
        let newVenues 

        if(this.state.query && (this.state.query !== '')) {
            const match = new RegExp(escapeRegExp(query), 'i');
            newVenues = allVenues.filter((availVenue) => match.test(availVenue.venue.name))
            this.setState({venues: newVenues})
            
        } else {
            this.setState({venues: allVenues})
        }
    }

    triggerMarkerClick = (venueTitle) => {
        this.props.markers.map((marker) => {
            if(marker.title === venueTitle) {
                window.google.maps.event.trigger(marker, 'click');
            }
        })
    }

    render() {
        
        return(
          <Menu 
          isOpen={this.state.menuOpen}
          onStateChange={(state) => this.handleStateChange(state)}
          >
            <aside>
                <div className="search-form">
                        <input 
                            id="searchQuery" 
                            type="text" 
                            placeholder=" Search" 
                            onChange={(e) => this.updateQuery(e.target.value)} 
                            value={this.state.query}
                        />
                </div>
                {this.state.venues.length !== 0 && (
                    <ul className="search-result">
                        {this.state.venues.map((availVenue, index) => (
                            <li 
                                key={index}
                                tabindex={index}
                                className="item" 
                                onClick={() => this.triggerMarkerClick(availVenue.venue.name)}
                            >
                                {availVenue.venue.name}
                            </li>
                        ))}
                    </ul>
                )}

                {this.state.venues === 0 && (
                    <ul className="search-result">
                        <li className="item">No Result..</li>
                    </ul>
                )}
            </aside>
            
            </Menu>
        )
    }
}

export default Sidebar