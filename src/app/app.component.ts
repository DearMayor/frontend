import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { Marker } from './interfaces/markers'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  lat = 46.2275619;
  lng = 6.0560755;
  zoom = 14;
  infoWindowOpened = null;
  selectedFilters = {};

  data: any;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.fetchData().then((data) => {
      this.data = data;
    });
  }

  markerClicked(infoWindow) {
    if (this.infoWindowOpened === infoWindow) {
      return;
    }

    if (this.infoWindowOpened !== null) {
      this.infoWindowOpened.close();
    }

    this.infoWindowOpened = infoWindow;
  }

  handleFacetClick(field, value) {
    this.selectedFilters[field] = (this.selectedFilters[field] === undefined) ? [] : this.selectedFilters[field];
    let index = (this.selectedFilters[field]).indexOf(value);
    if (index === -1) {
      this.selectedFilters[field].push(value);
    } else {
      this.selectedFilters[field].splice(index, 1);
    }

    let filters = [];

    Object.keys(this.selectedFilters).forEach(key => {
      if (this.selectedFilters[key].length) {
        let filter = {};
        filter[key] = this.selectedFilters[key];

        filters.push(
          {
            terms: filter
          }
        );
      }
    });

    const query = {
        match_all: {}
    };

    const post_filter = {
        bool: {
          must : filters
        }
    };

    this.apiService.doQuery(query, post_filter).then((data) => {
      this.data = data;
    });

  }

  isFacetSelected(field, value) {
    if ( this.selectedFilters[field] && this.selectedFilters[field].indexOf(value) !== -1 ) {
      return true;
    }
    return false;
  }

  // getLocation() {
  //   if (navigator.geolocation) {
  //     const that = this;
  //     navigator.geolocation.getCurrentPosition(function (response) {
  //       that.lat = response.coords.latitude;
  //       that.lng = response.coords.longitude;
  //     }, function () {
  //       alert("Unable to get GPS Location");
  //     }, {
  //         enableHighAccuracy: true
  //       });
  //   } else {
  //     alert("Geolocation is not supported by this browser.");
  //   }
  // }
}
