var image1 = new ol.style.Circle({
  radius: 10,
  fill: null,
  stroke: new ol.style.Stroke({ color: "#7b3728", width: 2 }),
  fill: new ol.style.Fill({
    color: "yellow"
  })
});
var image2 = new ol.style.Circle({
  radius: 10,
  fill: null,
  stroke: new ol.style.Stroke({ color: "#319FD3", width: 2 }),
  fill: new ol.style.Fill({
    color: "rgba(255,255,255,0.6)"
  })
});
var image3 = new ol.style.Circle({
  radius: 10,
  fill: null,
  stroke: new ol.style.Stroke({ color: "white", width: 2 }),
  fill: new ol.style.Fill({
    color: "#319FD3"
  })
});
var PStyle = new ol.style.Style({
  image: image1
});
var PStyle2 = new ol.style.Style({
  image: image2
});
var PStyle3 = new ol.style.Style({
  image: image3
});
var PolStyle = new ol.style.Style({
  fill: new ol.style.Fill({
    color: "rgba(255,55,55,0.2)"
  }),
  stroke: new ol.style.Stroke({
    color: "#319FD3",
    width: 1
  })
});
var tabla = document.getElementById('infot')
function getStyle(feature) {
  const cat = feature.get("SInCategor");
  if (cat == 1) {
    return PStyle;
  } else return PStyle2;
}
var baseMapLayer = new ol.layer.Tile({
  source: new ol.source.OSM()
});
var VectorLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: "datos/SitioInteres2.geojson",
    format: new ol.format.GeoJSON()
  }),
  style: function(feature) {
    return getStyle(feature);
  }
});

var map = new ol.Map({
  target: "map",
  layers: [baseMapLayer, VectorLayer],
  controls: ol.control
    .defaults({
      zoom: true,
      atribution: true,
      rotate: false
    })
    .extend([new ol.control.ScaleLine()]),
  view: new ol.View({
    center: ol.proj.fromLonLat([-74.058, 4.65]),
    zoom: 15
  })
});
map.addControl(new ol.control.ZoomSlider());
var select = new ol.interaction.Select();
map.addInteraction(select);

var selectedFeatures = select.getFeatures();

var dragBox = new ol.interaction.DragBox({});
map.addInteraction(dragBox);


dragBox.on("boxend", function() {
  header = document.createElement('tr')
  nheader = document.createElement('th')
  dheader = document.createElement('th')
  nheader.innerText='Nombre'
  dheader.innerText='Direccion'
  header.append(nheader)
  header.append(dheader)
  tabla.append(header)
  var extent = dragBox.getGeometry().getExtent();

  VectorLayer.getSource().forEachFeatureIntersectingExtent(extent, function(feature) {
    selectedFeatures.push(feature);
    fila= document.createElement("tr")
    dnombre= document.createElement("td")
    ddir= document.createElement("td")
    f =feature.getProperties()
    dnombre.innerText = f.SInNombre
    ddir.innerText = f.SInDirecci
    fila.append(dnombre)
    fila.append(ddir)
    tabla.append(fila)
  });
  selectedFeatures.forEach(function(feature) {
    feature.setStyle(PStyle3);
  });

  // when the view is obliquely rotated the box extent will
  // exceed its geometry so both the box and the candidate
  // feature geometries are rotated around a common anchor
  // to confirm that, with the box geometry aligned with its
  // extent, the geometries intersect

});

var infoBox = document.getElementById("info");
// clear selection when drawing a new box and when clicking on the map
dragBox.on("boxstart", function() {
  selectedFeatures.forEach(function(feature) {
    feature.setStyle(getStyle(feature));
  });
  selectedFeatures.clear();
  tabla.innerHTML='';
});

/* 
function onCharge() {
  var tabla = document.createElement("table");
  var text = " ";

  var feature = VectorLayer.getSource().getFeatures();
  var headers = feature[0].getKeys();
  var cabezal = document.createElement("tr");
  for (head of headers) {
    if (head == "geometry") {
      continue;
    }
    let header = document.createElement("th");
    header.innerText = head;
    cabezal.append(header);
  }
  tabla.append(cabezal);

  for (f of feature) {
    row = document.createElement("tr");
    var text;

    var objeto = f.getProperties(),
      propiedades;

    for (propiedades in objeto) {
      if (propiedades == "geometry") {
        continue;
      }
      let dato = document.createElement("td");
      dato.innerText = objeto[propiedades];
      row.append(dato);
    }
    tabla.append(row);
  }

  document.body.appendChild(tabla);
}
setTimeout(onCharge, 1000); */