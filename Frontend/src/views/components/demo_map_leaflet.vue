<template>
  <div id="map"></div>
</template>

<script>
export default {
mounted() {
    setTimeout(() => {
        this.getMap()
    }, 100);
},
methods: {
    getMap(){

      let deemapLight = L.tileLayer(
        "https://www.deemap.com/DeeMap/gwc/service/tms/1.0.0/DeeMap2_THA_Map_No_POI@EPSG%3A900913@png8/{z}/{x}/{-y}.png8",
      );

      let deemapNigth = L.tileLayer.wms('https://www.deemap.com/DeeMap/gwc/service/wms?', {
        layers: "DeeMap2_THA_Map_Night",
        format: "image/png8"
      });

     var map = L.map('map', {
        center: [13.783278, 100.59288],
        zoom: 7,
        maxZoom: 20,
        layers: [deemapNigth],
        zoomControl: false
      })

        L.marker([13.783278, 100.59288])
        .addTo(map)
        .bindPopup('DTC Enterprise!')
        .openPopup();

      let baseLayers = {
        "<img src='assets/image/internet.png' width='20' height='20'>&nbsp;Deemap Dark": deemapNigth,
        "<img src='assets/image/worldwide.png' width='20' height='20'>&nbsp;Deemap Light": deemapLight
      };
        L.control
            .layers(baseLayers)
            .addTo(map);
            
        L.control.zoom({
            position: 'bottomright'
        }).addTo(map);

    },
},
}
</script>

<style scoped>
#map{
    width: 100%;
    height: calc(100vh - 50px);
}
</style>