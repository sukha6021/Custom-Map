import React, { Component } from "react";
import "./maps.css";
import { Link } from "react-router-dom";
import { Button, Input, Popconfirm, message, Spin, Popover } from "antd";
import { ShareAltOutline } from "@ant-design/icons";
import Axios from "axios";

/**
 * Todos
 * pagination
 *
 */
class MyMaps extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      maps: [],
      type: "",
      features: "",
      properties: "",
      geometry: "",
      input: "",
    };
  }

  handleChange = (e) => {
    this.setState({ input: e.target.value });
  };

  publishOnClick(id) {
    let url = "/api/geo/publish/" + id;

    // unpublish map then update state
    Axios.post(url, {
      headers: {
        Authorization: "authorizationToken",
      },
      data: {
        source: id,
      },
    })
      .then((res) => {
        console.log(res);
        let allMaps = this.state.maps;
        allMaps.map((item) => {
          if (item._id == id) {
            item.published = !item.published;
            item.published
              ? message.info("Map published!")
              : message.info("Now  its Private!");
          }
        });

        this.setState({ maps: allMaps });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  /**
   * delete map after being confimed
   *
   * @param {*} id  Map _id
   */
  deleteOnClick(id) {
    let url = "/api/geo/delete/" + id;
    console.log(id);
    let allMaps = this.state.maps;
    allMaps = allMaps.filter((item) => item._id != id);

    Axios.delete(url, {
      headers: {
        Authorization: "authorizationToken",
      },
      data: {
        source: id,
      },
    })
      .then((res) => {
        this.setState({ maps: allMaps });
        message.info("Map deleted!");
      })
      .catch((err) => {
        console.log(err);
      });

    console.log(allMaps);
    console.log(this.state.maps);
  }

  createMap = () => {
    let url = "/api/geo/new_map";
    Axios.post(url, {
      name: this.state.input.trim(),
      user_id: localStorage.userId,
    })
      .then((res) => {
        console.log(res.data.mapId);
        this.props.history.push("/map/" + res.data.mapId);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  async componentDidMount() {
    const map_url = "/api/geo/user_maps?user_id=" + localStorage.userId;
    const response = await fetch(map_url);
    const data = await response.json();
    //console.log(data);
    this.setState({ maps: data, loading: false });
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="container">
          <Spin />
        </div>
      );
    } else {
      return (
        <div className="container">
          <div id="addMapContainer">
            <Input
              onChange={this.handleChange}
              maxLength={20}
              placeholder="Map Name"
              style={{ width: 200, marginRight: 20 }}
            ></Input>
            <Button type="primary" onClick={() => this.createMap()}>
              Create Map
            </Button>
          </div>
          {this.state.maps.map((map, i) => (
            <div key={map._id} className="single-map-holder">
              <div>
                <h3> {map.name ? map.name : map._id}</h3>
              </div>
              <Link to={"/map/" + map._id}>
                {map.img && <img src={`data:image/jpeg;base64,${map.img}`} />}
              </Link>

              <Popconfirm
                title="Are you sure to delete this Map?"
                onConfirm={() => this.deleteOnClick(map._id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="danger" icon="delete">
                  Delete
                </Button>
              </Popconfirm>

              <Button
                icon="share-alt"
                type="primary"
                onClick={() => this.publishOnClick(map._id)}
              >
                {!map.published ? "Publish" : "Unpublish"}
              </Button>

              <Link to={"/map/" + map._id} key={map._id}>
                <Button icon="edit" type="primary">
                  Edit
                </Button>
              </Link>
            </div>
          ))}
        </div>
      );
    }
  }
}

export default MyMaps;
