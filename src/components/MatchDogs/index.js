import React, { Component } from "react";
import { getMatchDogs, onlyLike, isMatch } from "../../services/dogService";
import Modal from "../Modal";
import DogCard from "../DogCard";
import FloatingAction from "../FloatingAction";
import { getOwnerDogs } from "../../services/userService";
import Swal from 'sweetalert2';
import { withRouter } from 'react-router';

class MatchDogs extends Component {
  state = {
    dog: {},
    myDog: {},
    data: [],
    randomDogId: "",
    dogsShown: [],
  };

  componentDidMount() {
    getMatchDogs().then((res) => {
      let randomDog = res.data[Math.floor(Math.random() * res.data.length)];

      const currentCard = <DogCard {...randomDog} />;

      this.setState({
        currentCard,
        dog: randomDog,
        data: res.data,
        dogsShown: res.data,
        gender: res.data,
      });
    });

    getOwnerDogs()
      .then((res) => {
        let myDog = res.data.dogs[0];
        this.setState({ myDog });
      })
      .catch((err) => console.log(err));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id !== this.props.match.params.id) {
      let randomDog = this.state.dogsShown.results[
        Math.floor(Math.random() * this.state.dogsShown.results.length)
      ];

      const filter = this.state.dogsShown.results.filter(
        (dog) => dog._id !== randomDog._id
      );

      this.setState({ dog: randomDog, dogShown: filter });
    }
  }

  handleNewDog = () => {
    let { myDog } = this.state;
    let randomDog = this.state.dogsShown[
      Math.floor(Math.random() * this.state.dogsShown.length)
    ];

    if (randomDog.match.find((item) => item === myDog._id)) {
      this.handleNewDog();
      return true;
    }

    const filter = this.state.dogsShown.filter(
      (dog) => dog._id !== randomDog._id
    );

    const currentCard = <DogCard key={Math.random()} {...randomDog} />;

    this.setState({ dog: randomDog, dogShown: filter, currentCard });
  };

  handleLike = () => {
    let { dog, myDog } = this.state;
    let data = {
      myDogId: myDog._id,
      likedDogId: dog._id,
    };

    if (dog.liked.find((item) => item === myDog._id)) {
      if (myDog.match.find((item) => item === dog._id)) {
        this.handleNewDog();
        return true;
      }

      isMatch(data)
        .then((res) => {
          myDog = res.data.dog;
          this.handleNewDog();
          this.setState({ myDog });
          Swal.fire({
            title: "Yay! It's a match!",
            text: "Checkout your matches.",
            confirmButtonText: "See your Matches",
          }).then((result) => {
            this.props.history.push("/my-matches");
          });
        })
        .catch((err) => console.log(err));
    } else {
      if (myDog.liked.find((item) => item === dog._id)) {
        this.handleNewDog();
        return true;
      }

      onlyLike(data)
        .then((res) => {
          myDog = res.data.dog;
          this.handleNewDog();
          this.setState({ myDog });
        })
        .catch((err) => console.log(err));
    }
  };

  render() {
    return (
      <section>
        <Modal
          id="modal-success"
          title="Yay! I'ts a Match"
          text="You can now contact the dog's owner to arrange a meeting"
          label="Get in touch"
          //action="" que se vaya a la vista de match
        />
        <h1 className="uk-margin-medium-top uk-text-bold uk-text-primary uk-text-center">
          Match a dog
        </h1>
        <p className="uk-text-center">Find the ideal match for your dog</p>

        <div className="card-container uk-margin-large-bottom">
          {this.state.currentCard}

          <div className="uk-button-group floating-group uk-position-bottom-center">
            <FloatingAction icon="refresh" action={this.handleNewDog} />
            <FloatingAction
              icon="heart"
              action={this.handleLike}
              // toggle="target: #modal-success"
            />
            <div>
              {}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default withRouter(MatchDogs);
