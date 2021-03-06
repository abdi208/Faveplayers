<div id ="map" style="width: 250%; height: 30em; right: 200px;"></div>
<script>
    mapboxgl.accessToken = '<%= mapkey %>'
    let map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/outdoors-v11',
        center: [-96, 40.8],
        zoom: 3
    })
    map.on('load', function(){
        map.addLayer({
        "id": "points",
        "type": "symbol",
        "source": {
            "type": "geojson",
            "data": {
            "type": "FeatureCollection",
            "features": [<%- markers %>]
            }
        },
        "layout": {
            "icon-image": "{icon}-15",
            "text-field": "{title}",
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, 0.6],
            "text-anchor": "top"
        }
        })
    })
</script>