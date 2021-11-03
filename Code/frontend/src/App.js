import "./App.css";
import Form from "./components/Form.js";
import Header from "./components/Header";
import recipeDB from "./apis/recipeDB";
import RecipeList from "./components/RecipeList";
import React, { Component } from "react";

// Main component of the project
class App extends Component {
  // constructor for the App Component
  constructor() {
    super();

    this.state = {
      cuisine: "",
      //NoIngredients : 0,
      ingredients: new Set(),
      recipeList: [],
    };
  }

  // Function to get the user input from the Form component on Submit action
  handleSubmit = async (formDict) => {
    this.setState({
      // cuisine: cuisineInput,
      //NoIngredients: noIngredientsInput,
      ingredients: formDict["ingredient"],
      cuisine: formDict["cuisine"],
    });

    const items = Array.from(formDict["ingredient"]);
    const cuis = formDict["cuisine"];
    this.getRecipeDetails(items, cuis);
  //  alert(typeof(ingredientsInput["cuisine"]));
  };

  getRecipeDetails = async (ingredient, cuis) => {
    try {
      const response = await recipeDB.get("/recipes", {
        params: {
          CleanedIngredients: ingredient,
          Cuisine: cuis,
        },
      });
      this.setState({
        recipeList: response.data.recipes,
      });
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return (
      <div>
        <Header />

        {/* handleSubmit function is being sent as a prop to the form component*/}

        <Form sendFormData={this.handleSubmit} />

        {/* RecipeList is the component where results are displayed.
        App's recipeList state item is being sent as a prop
        */}

        <RecipeList recipes={this.state.recipeList} />
      </div>
    );
  }
}

export default App;
