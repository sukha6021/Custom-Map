import React, { Component } from "react";
import "./maps.css";
import { useHistory } from "react-router-dom";
import axios from "axios";

class CreateMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      maps: [],
      type: "",
      features: "",
      properties: "",
      geometry: "",
    };
  }

  async componentDidMount() {
    const map_url = "/api/geo/user_maps?user_id=1";
    const response = await fetch(map_url);
    const data = await response.json();
    console.log(data);
    this.setState({ maps: data, loading: false });
  }

  handleClick = () => {
    let url = "/api/geo/create_map";
    axios
      .get(url)
      .then((res) => {
        console.log(res.data.mapId);
        this.props.history.push("/map/" + res.data.mapId);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <div className="container">
        <div className="create-map-form">
          <input type="text"></input>
          <br />
          <br />
          <button onClick={this.handleClick} type="submit">
            Create New
          </button>
        </div>
      </div>
    );
  }
}

export default CreateMap;
