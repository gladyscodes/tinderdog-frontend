import React, { Component } from "react";
import AppContext from "../../AppContext";
import Card from "./Card";
import { updateUser } from "../../services/profileServices";

class EditProfile extends Component {
  static contextType = AppContext;
  state = {
    user: {},
  };

  handleChange = (e) => {
    let { user } = this.state;
    user = { ...user, [e.target.name]: e.target.value };
    this.setState({ user });
  };

  componentDidMount() {
    let { user } = this.state;
    user = this.context.user;
    this.setState({ user });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let { user } = this.state;
    updateUser(user)
      .then((res) => {
        const { result } = res.data;
        localStorage.setItem("user", JSON.stringify(result));
        this.context.setUser(result);

        //usuario esta actualizado (feedback)
        //tenemos que usar la funcion setUser del context para actualizar el usuario en el context
      })
      .catch((res) => console.error(res.response));
  };

  render() {
    let { user } = this.state;
    return (
      <div>
        <Card
          image={user.avatar}
          name={user.name}
          email={user.email}
          phoneNumber={user.phoneNumber}
          description={user.description}
        />
        <div className="uk-width-1-4@l uk-width-1-4@m uk-width-1-2@s uk-align-center">
          <form
            onSubmit={this.handleSubmit}
            className="uk-width-1-1 uk-form-stacked uk-flex uk-flex-center uk-flex-column"
          >
            <div className="uk-inline">
              <label className="uk-form-label" htmlFor="avatar">
                Profile picture:
              </label>
              <div className="uk-inline">
                <span
                  className="uk-form-icon uk-form-icon-flip"
                  uk-icon="icon: pencil"
                ></span>
                <input
                  onChange={this.handleChange}
                  id="avatar"
                  name="avatar"
                  className="uk-input"
                  type="text"
                  placeholder="URL"
                  required
                />
              </div>
            </div>
            <div className="uk-margin-small">
              <label className="uk-form-label" htmlFor="name">
                Name:
              </label>
              <div className="uk-inline">
                <span
                  className="uk-form-icon uk-form-icon-flip"
                  uk-icon="icon: pencil"
                ></span>
                <input
                  onChange={this.handleChange}
                  id="name"
                  name="name"
                  className="uk-input"
                  type="text"
                  required
                  placeholder="Update your user name"
                  value={user["name"] !== undefined ? user["name"] : ""}
                />
              </div>
            </div>
            <div className="uk-margin-small">
              <label className="uk-form-label" htmlFor="phoneNumber">
                Phone number:
              </label>
              <div className="uk-inline">
                <span
                  className="uk-form-icon uk-form-icon-flip"
                  uk-icon="icon: pencil"
                ></span>
                <input
                  onChange={this.handleChange}
                  id="phoneNumber"
                  name="phoneNumber"
                  className="uk-input"
                  type="text"
                  required
                  placeholder="Update your phone number"
                  value={
                    user["phoneNumber"] !== undefined ? user["phoneNumber"] : ""
                  }
                />
              </div>
            </div>
            <div className="uk-margin-small">
              <label className="uk-form-label" htmlFor="description">
                Description:
              </label>
              <div className="uk-inline">
                <span
                  className="uk-form-icon uk-form-icon-flip"
                  uk-icon="icon: pencil"
                ></span>
                <input
                  onChange={this.handleChange}
                  id="description"
                  name="description"
                  className="uk-input"
                  type="text"
                  placeholder="Add a description"
                  required
                  value={
                    user["description"] !== undefined ? user["description"] : ""
                  }
                />
              </div>
            </div>

            <button className="uk-button uk-button-primary uk-margin-medium">
              Update
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default EditProfile;
