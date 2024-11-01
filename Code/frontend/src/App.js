import React, { Component } from "react";
import { Tabs, Tab, TabList, TabPanel, TabPanels, Box, Text, Center } from "@chakra-ui/react";
import { withAuth0 } from "@auth0/auth0-react";
import Form from "./components/Form.js";
import recipeDB from "./apis/recipeDB";
import RecipeList from "./components/RecipeList";
import AddRecipe from "./components/AddRecipe.js";
import RecipeLoading from "./components/RecipeLoading.js";
import SearchByRecipe from "./components/SearchByRecipe.js";
import UserProfile from "./components/UserProfile.js";
import LoginButton from './components/LoginButton';
import Nav from "./components/Navbar.js";

class App extends Component {
  constructor() {
    super();
    this.state = {
      cuisine: "",
      ingredients: new Set(),
      recipeList: [],
      recipeByNameList: [],
      email: "",
      flag: false,
      isLoading: false,
      isProfileView: false,
      userData: {}
    };
  }

  handleLogout = () => {
    const { logout } = this.props.auth0;
    logout({ returnTo: window.location.origin });
    this.setState({
      userData: {}
    });
    localStorage.removeItem("userName");
    alert("Successfully logged out!");
  }

  handleBookMarks = () => {
    this.setState({ isProfileView: true });
  };

  handleProfileView = () => {
    this.setState({ isProfileView: false });
  };

  handleSubmit = async (formDict) => {
    this.setState({
      isLoading: true,
      ingredients: formDict["ingredient"],
      cuisine: formDict["cuisine"],
      email: formDict["email_id"],
      flag: formDict["flag"],
    });

    // Fetch recipe data based on form input
    try {
      const response = await recipeDB.get("/recipes", {
        params: {
          CleanedIngredients: Array.from(formDict["ingredient"]),
          Cuisine: formDict["cuisine"],
          Email: formDict["email_id"],
          Flag: formDict["flag"],
        },
      });
      this.setState({
        recipeList: response.data.recipes,
        isLoading: false
      });
    } catch (err) {
      console.error(err);
      this.setState({ isLoading: false });
    }
  };

  handleRecipesByName = (recipeName) => {
    this.setState({ isLoading: true });

    recipeDB.get("/recipes/getRecipeByName", { params: { recipeName } })
      .then((res) => {
        this.setState({
          recipeByNameList: res.data.recipes,
          isLoading: false
        });
      })
      .catch((err) => {
        console.error(err);
        this.setState({ isLoading: false });
      });
  };

  // AddRecipe-related functionality (if needed)
  handleAddRecipe = async (recipeData) => {
    try {
      const response = await recipeDB.post("/recipes/add", recipeData);
      if (response.data.success) {
        alert("Recipe added successfully!");
      } else {
        alert("Failed to add recipe");
      }
    } catch (err) {
      console.error("Error adding recipe:", err);
    }
  };

  render() {
    const { isAuthenticated, user } = this.props.auth0;
    const { isProfileView, recipeList, recipeByNameList, isLoading, userData } = this.state;

    return (
      <div>
        <Nav 
          handleLogout={this.handleLogout} 
          handleBookMarks={this.handleBookMarks} 
          user={user || userData} 
        />

        {!isAuthenticated ? (
          <Center flexDirection="column" mt="100px">
            <Text fontSize="4xl" mb="20px">Welcome to Recipe Finder</Text>
            <Text fontSize="xl" mb="40px">Discover and share delicious recipes.</Text>
            <LoginButton />
          </Center>
        ) : (
          <>
            {isProfileView ? (
              <UserProfile handleProfileView={this.handleProfileView} user={user || userData} />
            ) : (
              <Tabs variant="soft-rounded" colorScheme="green">
                <TabList ml={10}>
                  <Tab>Search Recipe</Tab>
                  <Tab>Add Recipe</Tab>
                  <Tab>Search Recipe By Name</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Box display="flex">
                      <Form sendFormData={this.handleSubmit} />
                      {isLoading ? <RecipeLoading /> : <RecipeList recipes={recipeList} />}
                    </Box>
                  </TabPanel>
                  <TabPanel>
                    {/* Ensure that AddRecipe receives any necessary props */}
                    <AddRecipe handleAddRecipe={this.handleAddRecipe} />
                  </TabPanel>
                  <TabPanel>
                    <SearchByRecipe sendRecipeData={this.handleRecipesByName} />
                    {isLoading ? <RecipeLoading /> : <RecipeList recipes={recipeByNameList} />}
                  </TabPanel>
                </TabPanels>
              </Tabs>
            )}
          </>
        )}
      </div>
    );
  }
}

export default withAuth0(App);
