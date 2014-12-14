var chrono = true;
var legend_chrono = $('#chrono_legend').html()+$('#source_legend').html();
var legend_mandatures = $('#mandatures_legend').html()+$('#source_legend').html();

// Create a map in the div #map
var map = L.mapbox.map('map', '',{
	legendControl: {
        position: 'bottomleft'
    },
	shareControl: true,
	infoControl: true,
	maxZoom: 17,
	minZoom: 13
	}).setView([45.1805, 5.7247], 13);

L.control.fullscreen().addTo(map);
var hash = L.hash(map);

//on charge le calque avec l'interaction
var chrono_gridLayer = L.mapbox.gridLayer('julesbonnard.xqs62yb9');
map.addLayer(chrono_gridLayer);
 
//on ajoute la fenêtre interactive qui s'affichera automatiquement
map.addControl(L.mapbox.gridControl(chrono_gridLayer));

var tile_chrono = L.mapbox.tileLayer('julesbonnard.xqs62yb9',{zIndex: 10}).on('load',function() {
	if(chrono == false) {
		chrono = true;
		map.legendControl.addLegend(legend_chrono);
		map.legendControl.removeLegend(legend_mandatures);
	}
	});
var tile_mandatures = L.mapbox.tileLayer('julesbonnard.lw1rwwmi',{zIndex: 10}).on('load',function() {
	if(chrono == true) {
		chrono = false;
		map.legendControl.addLegend(legend_mandatures);
		map.legendControl.removeLegend(legend_chrono);
	}
    });

map.legendControl.addLegend(legend_chrono);
map.on('movestart',function() {
	if(chrono == false) {
		map.legendControl.removeLegend(legend_chrono);
	}
	else {
		map.legendControl.removeLegend(legend_mandatures);
	}
});

var tile_labels = L.mapbox.tileLayer('julesbonnard.hihhbaip',{zIndex: 100});

L.control.layers({
    'Chronologie': tile_chrono.addTo(map),
    'Mandatures': tile_mandatures
}, { 'Labels': tile_labels.addTo(map)
   
},{position: 'topleft',collapsed: false}).addTo(map);



var lati = 0,
lngi = 0;
function onMapClick(e) {
	if (confirm("Souhaitez-vous corriger la date de construction sur la parcelle "+e.PARCEL_NOM+" ?")) {
    	$.magnificPopup.open({
		  items: {
		    src: 'https://docs.google.com/forms/d/1TgLVh57zJtOV70hWhFllakenNVJlJcM5qtzKvcTW2s8/viewform', // can be a HTML string, jQuery object, or CSS selector
		    type: 'iframe'
		  }
		});
	}
}
map.on('click', function(e) {
	lati = e.latlng.lat;
	lngi = e.latlng.lng;
	chrono_gridLayer.getData(e.latlng,onMapClick)
});