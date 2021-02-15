import React, { Component } from "react";
import "leaflet/dist/leaflet.css";
import L, { featureGroup, map } from "leaflet";
import "leaflet-draw";
import "./map.css";
import "../Sidebar/sidebar.css";

import axios from "axios";

import "leaflet-contextmenu/dist/leaflet.contextmenu.css";
import "leaflet-contextmenu";

import "leaflet-search";
import "leaflet-search/src/leaflet-search.css";
import { Button, Input, Popconfirm, message, Spin, Popover } from "antd";

//switch off logs for production
//console.log = function () {};

const style = {
  width: "100%",
  height: "100 vh ",
};

// import marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.4.0/dist/images/marker-shadow.png",
});

class LandingPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: "",
      features: "",
      properties: "",
      geometry: "",
    };

    this.layers = L.featureGroup();
    this.mapId = this.props.match.params.id;
  }

  onChangeType(e) {
    this.setState({ type: e.target.value });
  }

  onChangeGeometry(e) {
    this.setState({ geometry: e.target.value });
  }

  onSubmit(e) {
    console.log("test");
    console.log(this.state);
    e.preventDefault();

    const geo = this.state;

    console.log("on submit printing");
    console.log(geo);

    axios
      .post("/api/geo/create", geo)
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });

    ///this.setState({ type: '', features: '', properties: '', geometry: '' })
  }

  componentDidMount() {
    // center of the map
    console.log(this.props);

    //bot layers will be added to map later, first one should hold single item,
    //2nd one holds data synced with db  in a featurecollection
    var drawnItems = new L.FeatureGroup();
    var allLayers = new L.FeatureGroup();
    //passing refence fo drawnItems to class variable
    //this.layers = drawnItems;

    var mapId = this.mapId;
    var userId = null;
    var currentLayer = null;
    var map,
      ll2 = new L.LatLng(52.52, 13.41);

    function showCoordinates(e) {
      alert(e.latlng);
    }

    function centerMap(e) {
      map.panTo(e.latlng);
    }

    function zoomIn(e) {
      map.zoomIn();
    }

    function zoomOut(e) {
      map.zoomOut();
    }

    var osmLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>',
      thunLink = '<a href="http://thunderforest.com/">Thunderforest</a>';

    var osmUrl = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      osmAttrib = "&copy; " + osmLink + " Contributors",
      landUrl = "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
      thunAttrib = "&copy; " + osmLink + " Contributors & " + thunLink;

    var osmMap = L.tileLayer(osmUrl, { attribution: osmAttrib }),
      landMap = L.tileLayer(landUrl, { attribution: thunAttrib });

    map = L.map("map", {
      center: ll2,
      zoom: 15,
      contextmenu: true,
      contextmenuWidth: 140,
      layers: [osmMap],
      contextmenuItems: [
        {
          text: "Show coordinates",
          callback: showCoordinates,
        },
        {
          text: "Add Place",
          icon: "images/addmap.jpeg",
        },
        {
          text: "Center map here",
          callback: centerMap,
        },
        "-",
        {
          text: "Zoom in",
          icon: "images/zoom-in.png",
          callback: zoomIn,
        },
        {
          text: "Zoom out",
          icon: "images/zoom-out.png",
          callback: zoomOut,
        },
      ],
    });

    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    map.addLayer(drawnItems);
    map.addLayer(allLayers);

    /*
    L.marker(ll2, {
      contextmenu: true,
      contextmenuInheritItems: false,
      contextmenuItems: [
        {
          text:
            "<form id='popup-leaflet' ref='popup-leflet-form'>" +
            'Description:<br><input type="text" id="input_desc"><br>' +
            'Name:<br><input type="text" id="input_name" placeholder="Name" ><br>' +
            '<input type="button" value="Submit" id="popup-submit" ref="popup-submit">' +
            "</form>",
        },
      ],
    }).addTo(map);
    */

    //add layers

    var baseLayers = {
      "OSM Mapnik": osmMap,
      Satellite: landMap,
    };

    L.control.layers(baseLayers).addTo(map);

    function addPopup(feature, layer) {
      let bindStr = "";
      if (feature.properties)
        if (feature.properties.description || feature.properties.name)
          bindStr = `<div style='text-align:center'>${feature.properties.name}</div><br> Address: ${feature.properties.description}`;

      layer.bindPopup(bindStr);
    }

    /*
   
    const searchControl = new ELG.Geosearch().addTo(map);
    const results = new L.LayerGroup().addTo(map);

    searchControl.on("results", function (data) {
      results.clearLayers();
      for (let i = data.results.length - 1; i >= 0; i--) {
        results.addLayer(L.marker(data.results[i].latlng));
      }
    }); //end search
    */

    //search function
    map.addControl(
      new L.Control.Search({
        url: "https://nominatim.openstreetmap.org/search?format=json&q={s}",
        jsonpParam: "json_callback",
        propertyName: "display_name",
        propertyLoc: ["lat", "lon"],
        autoCollapse: true,
        autoType: false,
        minLength: 2,
      })
    );

    // FeatureGroup is to store editable layers

    var drawControl = new L.Control.Draw({
      edit: {
        featureGroup: allLayers,
      },
    });

    if (!this.props.location.search.includes("share"))
      map.addControl(drawControl);

    map.on("draw:created", function (event) {
      var layer = event.layer,
        feature = (layer.feature = layer.feature || {}); // Intialize layer.feature

      currentLayer = layer;

      console.log("print from draw:created");

      console.log(layer.toGeoJSON());

      feature.type = feature.type || "Feature"; // Intialize feature.type
      var props = (feature.properties = feature.properties || {}); // Intialize feature.properties

      drawnItems.addLayer(layer);
      let geojson = JSON.stringify(drawnItems.toGeoJSON());
      document.getElementById("geojsontext").value = geojson;

      console.log("printing from draw created event: ", drawnItems.toGeoJSON());

      /*
      drawnItems.eachLayer(function (layer) {
        console.log(layer.toGeoJSON());
      });
      */
      createFormPopup(event);
    });

    // On edit or delete - Close popup
    map.addEventListener("draw:editstart", function (e) {
      drawnItems.closePopup();
    });
    map.addEventListener("draw:deletestart", function (e) {
      drawnItems.closePopup();
    });
    map.addEventListener("draw:editstop", function (e) {
      drawnItems.openPopup();
    });
    map.addEventListener("draw:deletestop", function (e) {
      if (drawnItems.getLayers().length > 0) {
        drawnItems.openPopup();
      }
    });

    map.on(L.Draw.Event.DELETED, function (event) {
      saveAllItems();
      console.log("print from draw:deleted");
    });

    map.on(L.Draw.Event.EDITED, function (event) {
      console.log("print from edited");
      saveAllItems();
    });

    /**
     *
     * @param {*} popper optional paramenter an draw event is passed
     */
    function createFormPopup(event) {
      let popupContent =
        "<form>" +
        'Name:<br><input type="text" id="input_name" placeholder="Name" ><br>' +
        'Address:<br><input type="text" id="input_desc"><br>' +
        '<input type="button" value="Submit"  id="popup-submit">' +
        "</form>";

      //myPopup.setContent(popupContent).openOn(map);
      //myPopup.openOn(map);

      var popup = L.popup({
        keepInView: true,
        closeButton: true,
        autoClose: false,
        autoPan: true,
        closeOnClick: false,
      });

      popup.setContent(popupContent);

      if (
        event.layer instanceof L.Circle ||
        event.layer instanceof L.CircleMarker ||
        event.layer instanceof L.Marker
      ) {
        console.log("instance of 3 things");

        var popupCoords = event.layer.getLatLng();
        console.log(popupCoords);

        popup.setLatLng(popupCoords);
      } else {
        var popupCoords = event.layer.getCenter();

        popup.setLatLng([popupCoords.lat, popupCoords.lng]);
      }

      drawnItems.bindPopup(popup).openPopup();
    } //end of create popup

    //get all features

    /**
     * Show data from a single map, called from onlick submit buttons
     */
    showSingleMap();
    function showSingleMap() {
      //console.log(this.props);
      console.log("sending request to single api");
      axios
        .get("/api/geo/read_id/" + mapId, "", {
          headers: {
            "content-type": "application/json",
          },
        })
        .then((res) => {
          console.log(res.data);

          userId = res.data.user_id;
          //console.log(userId);

          console.log("userId: ", userId);
          console.log("localstore User: ", localStorage.userId);

          if (!res.data.published)
            if (userId !== localStorage.userId) {
              message.info("This map is private!");
              return;
            }

          if (res.data.center && res.data.zoom)
            map.setView(res.data.center, res.data.zoom);

          function addNonGroupLayers(sourceLayer, targetGroup, popup) {
            if (sourceLayer instanceof L.LayerGroup) {
              sourceLayer.eachLayer(function (layer) {
                addNonGroupLayers(layer, targetGroup);
              });
            } else {
              addPopup(sourceLayer.toGeoJSON(), sourceLayer);

              targetGroup.addLayer(sourceLayer);
            }
          }

          addNonGroupLayers(L.geoJSON(res.data), allLayers, addPopup);

          //L.geoJSON(element).addTo(map);
        })
        .catch((err) => {
          console.error(err);
        });
    }

    function saveAllItems() {
      let jsonData = allLayers.toGeoJSON();
      jsonData.user_id = localStorage.userId;
      let data = {
        data: jsonData,
        center: map.getCenter(),
        zoom: map.getZoom(),
        url: window.location.href,
        token: document.cookie,
        userId: userId,
      };

      console.log(data);

      axios
        .put("/api/geo/update/" + mapId, data, {
          headers: {
            "content-type": "application/json",
          },
        })
        .then(() => {
          console.log("geopoint updated");
          //showSingleMap();
        })
        .catch((err) => {
          console.error(err);
        });
    }

    // Submission
    function setData(e) {
      if (e.target && e.target.id == "popup-submit") {
        console.log("userId: ", userId);
        console.log("localstore User: ", localStorage.userId);
        if (userId !== localStorage.userId) {
          console.log(userId, ":", localStorage.userId);
          drawnItems.closePopup();
          message.info("You are not allowed to edit!");
          return;
        }

        // Get user name and description
        let enteredName = document.getElementById("input_name").value;
        let enteredDescription = document.getElementById("input_desc").value;

        // Print user name and description
        console.log(enteredName);
        console.log(enteredDescription);

        drawnItems.eachLayer(function (layer) {
          let layerData = layer.toGeoJSON();
          layerData.properties = {
            name: enteredName,
            description: enteredDescription,
          };
          L.geoJSON(layerData, { onEachFeature: addPopup }).addTo(allLayers);
          // inpsect this, allLayer.addLayer(layer) doesnt work
          console.log(allLayers.toGeoJSON);
          //layer.addTo(allLayers);
        });

        saveAllItems();

        /*
        // For each drawn layer
        drawnItems.eachLayer(function (layer) {
          // Create SQL expression to insert layer
          let drawing = JSON.stringify(layer.toGeoJSON().geometry);
          console.log(drawing);
        });
*/
        // Clear drawn items layer
        drawnItems.closePopup();
        drawnItems.clearLayers();
      }
    }

    // Click on 'submit' event listener
    document.addEventListener("click", setData);

    // On submit - display layer from GeoJSON
    function showGeojson() {
      featureGroup.clearLayers();
      let txt = document.getElementById("geojsontext").value;
      txt = JSON.parse(txt);
      L.geoJSON(txt).addTo(featureGroup);
    }
  } //end of component did mount

  handleInputChange = (e) => {
    console.log(e);
    this.setState(e);
  };

  handleSubmit = (e) => {
    console.log("after submit button clicked");
    let token = localStorage.getItem("token");
    console.log(token);
    e.preventDefault();

    /*
    this.layers.eachLayer((layer) => {
      
      console.log(layer.toGeoJSON());
    });
    */

    const textValue = document.getElementById("geojsontext").value;

    //console.log(drawnItems.toGeoJSON());
    return;
  };

  render() {
    if (this.props.location.search.includes("share")) {
      return <div id="map"></div>;
    }

    return (
      <div id="mapContainer">
        <br />
        <div id="map"></div>
        <div className="container" style={{ display: "none" }}>
          <form onSubmit={this.handleSubmit}>
            <div style={{ width: "30%" }} className="form-group">
              <textarea
                id="geojsontext"
                onChange={this.handleInputChange}
                style={{ display: "none" }}
              />
            </div>

            <div style={{ width: "30%" }}>
              <button id="create" className="btn btn-success" type="submit">
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default LandingPage;
