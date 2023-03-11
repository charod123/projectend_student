/* jshint plusplus: false */
/* globals L */
import $ from 'jquery';
L.Control.SimpleMarkers = L.Control.extend({
    options: {
        position: 'topleft',
        add_control: true,
        delete_control: true,
        allow_popup: true,
        marker_icon: undefined,
        marker_draggable: false,
        add_marker_callback: undefined
    },
    map: undefined,
    markerList: [],

    onAdd: function(map) {
        "use strict";
        this.map = map;
        var marker_container = L.DomUtil.create('div', 'marker_controls');

        if (this.options.add_control) {
            var add_marker_div = L.DomUtil.create('div', 'add_marker_control', marker_container);
            add_marker_div.title = 'Add a marker';
            L.DomEvent.addListener(add_marker_div, 'click', L.DomEvent.stopPropagation)
                .addListener(add_marker_div, 'click', L.DomEvent.preventDefault)
                .addListener(add_marker_div, 'click', this.enterAddMarkerMode.bind(this));
        }
        if (this.options.delete_control) {
            var del_marker_div = L.DomUtil.create('div', 'del_marker_control', marker_container);
            del_marker_div.title = 'Delete a marker';


            L.DomEvent.addListener(del_marker_div, 'click', L.DomEvent.stopPropagation)
                .addListener(del_marker_div, 'click', L.DomEvent.preventDefault)
                .addListener(del_marker_div, 'click', this.enterDelMarkerMode.bind(this));
        }

        return marker_container;
    },

    enterAddMarkerMode: function() {
        "use strict";
        if (this.markerList !== '') {
            for (var marker = 0; marker < this.markerList.length; marker++) {
                if (typeof(this.markerList[marker]) !== 'undefined') {
                    this.markerList[marker].removeEventListener('click', this.onMarkerClickDelete.bind(this));
                }
            }
        }
        this.map._container.style.cursor = 'crosshair';
        this.map.addEventListener('click', this.onMapClickAddMarker.bind(this));
    },

    enterDelMarkerMode: function() {
        "use strict";
        for (var marker = 0; marker < this.markerList.length; marker++) {
            if (typeof(this.markerList[marker]) !== 'undefined') {
                this.markerList[marker].addEventListener('click', this.onMarkerClickDelete.bind(this));
                this.map._container.style.cursor = 'crosshair';
            }
        }
    },




    onMapClickAddMarker: function(e) {

        var parcelUTMB = L.layerGroup();
        parcelUTMB.addTo(this.map);



        "use strict";
        this.map.removeEventListener('click');
        this.map._container.style.cursor = 'auto';

        var marker_options = { draggable: this.options.marker_draggable };
        if (this.options.marker_icon) {
            marker_options.icon = this.options.marker_icon;
        }
        var marker = L.marker(e.latlng, marker_options);
        // console.log('L.marker(e.latlng) =', e.latlng.lat);
        // console.log('L.marker(e.latlng) =', e.latlng);
        var LAT = e.latlng.lat;
        var LON = e.latlng.lng;
        // console.log('LAT =', LAT);
        // console.log('LON =', LON);
        ///ฟังก์ชั่นในการแปลงเป็น DMS
        function toDegreesMinutesAndSeconds(coordinate) {
            var absolute = Math.abs(coordinate);
            var degrees = Math.floor(absolute);
            var minutesNotTruncated = (absolute - degrees) * 60;
            var minutes = Math.floor(minutesNotTruncated);
            var seconds = Math.floor((minutesNotTruncated - minutes) * 60);

            return degrees + '°' + minutes + "'" + seconds + '"';
        }
        ///////////////////////////

        var LATlatitude = toDegreesMinutesAndSeconds(LAT);
        var latitudeCardinal = LAT >= 0 ? "N" : "S";

        var LONlongitude = toDegreesMinutesAndSeconds(LON);
        var longitudeCardinal = LON >= 0 ? "E" : "W";

        // console.log(('ฟังก์ชั่นการแปลง DMS'), latitudeCardinal + ' ' + LATlatitude + "\n" + longitudeCardinal + ' ' + LONlongitude);
        // console.log(('LATlatitude ='), LATlatitude);
        // console.log(('latitudeCardinal ='), latitudeCardinal);
        // console.log(('LONlongitude ='), LONlongitude);
        // console.log(('longitudeCardinal ='), longitudeCardinal);
        var nlat = LAT.toFixed(6);
        var nlon = LON.toFixed(6);
        if (this.options.allow_popup) {
            var popupContent = "<b>" + "ตำแหน่งนี้คือ " + "</b>" + '<br>' + "<b>" + "Degrees : " + "</b>" +
                "<b>" + 'latitude :  ' + nlat + "</b>" + "<b>" + " " + 'longitude :  ' + nlon + "</b>" + '<br>' +
                "<b>" + "DMS : " + "</b>" +
                "<b>" + latitudeCardinal + ' ' + LATlatitude + "\n" + longitudeCardinal + ' ' + LONlongitude + "</b>" + '<br>'
                // +"<br/>" + "<input type='button' id='dpoint' value='ลบจุดนี้ 'style='width: 150px;' class='marker-delete-button'/>"
            ;
            var the_popup = L.popup();
            the_popup.setContent(popupContent);
            marker.bindPopup(the_popup).openPopup();
        }
        if (this.options.add_marker_callback) {
            this.options.add_marker_callback(marker);
        }
        // marker.addTo(this.map).openPopup();
        marker.addTo(this.map).openPopup();
        this.markerList.push(marker);

        // $('.marker-delete-button').on('click', () => {
        //     map.removeLayer(parcelUTMB);
        //     parcelUTMB.clearLayers();
        //     console.log('clear marker');

        // });
        const map = this.map

        $(".marker-delete-button").click(function() {
            map.removeLayer(marker);
            console.log('clear marker');


        });
        $(".add_marker_control").click(function() {
            map.removeLayer(marker);
            console.log('clear marker');


        });

        $(".del_marker_control").click(function() {
            map.removeLayer(marker);
            console.log('clear marker');


        });

        // marker._popup._closeButton.onclick = function() {
        //     console.log("click closed marker");
        //     map.removeLayer(marker);
        // }

        return false;
    },

    onMarkerClickDelete: function(e) {
        "use strict";
        this.map._container.style.cursor = 'auto';
        if (this.markerList.indexOf(e.target)) {
            this.map.removeLayer(e.target);
            var marker_index = this.markerList.indexOf(e.target);
            delete this.markerList[marker_index];
            console.log('delete this.markerList[marker_index]')
            for (var marker = 0; marker < this.markerList.length; marker++) {
                if (typeof(this.markerList[marker]) !== 'undefined') {
                    this.markerList[marker].removeEventListener('click', this.onMarkerClickDelete);

                }
            }
            return false;
        }
    }
});