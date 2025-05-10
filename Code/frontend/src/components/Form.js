import React, { Component } from "react";
import {
  HStack,
  Button,
  Input,
  InputGroup,
  Switch,
  Box,
  VStack,
  Text,
  InputRightElement,
  FormLabel,
  Badge,
} from "@chakra-ui/react";
import recipeDB from "../apis/recipeDB";
import TypeAheadDropDown from "./TypeAheadDropDown";

class Form extends Component {
  constructor() {
    super();

    this.state = {
      ingredients: new Set(),
      cuisineState: 0,
      cuisine: "",
      maxTime: "", // New state for max time
      type:"",
    };
  }

  async componentDidMount() {
    try {
      const response = await recipeDB.get("/recipes/callIngredients/");
      this.setState({
        ingredient_list: response.data,
        cuisine_list: [
          "Mexican",
          "South Indian",
          "Chinese",
          "Thai",
          "Japanese",
          "Gujarati",
          "North Indian",
          "Lebanese",
          "Mediterranean",
          "Middle East",
          "Italian",
          "Korean",
          "Continental",
          "Greek",
          "Latin",
          "American",
          "Other",
          "Swedish",
          "Latvian",
          "Italian",
          "Spanish",
          "American",
          "Scottish",
          "British",
          "Thai",
          "Japanese",
          "Indian",
          "Canadian",
          "Russian",
          "Jewish",
          "Polish",
          "German",
          "French",
          "Hawaiian",
          "Brazilian",
          "Peruvian",
          "Cuban",
          "Tibetian",
          "Salvadorian",
          "Egyptian",
          "Greek",
          "Belgian",
          "Irish",
          "Welsh",
          "Mormon",
          "Cajun",
          "Portugese",
          "Turkish",
          "Haitian",
          "Tahitian",
          "Kenyan",
          "Korean",
          "Algerian",
          "Nigerian",
          "Libyan",
        ],
      });
    } catch (err) {
      console.log(err);
    }
  }

  printHandler = () => {
    const items = [...this.state.ingredients];
    const list_items = items.map((item) => (
      <Badge
        id={item}
        m={1}
        _hover={{ cursor: "pointer" }}
        onClick={this.removeHandler}
        colorScheme="green"
      >
        {item}
      </Badge>
    ));
    return <ul class="addedIngredientList">{list_items}</ul>;
  };

  addHandler = (event) => {
    const ingredient = document.getElementById("ingredient").value;
    this.setState(
      {
        ingredients: new Set(this.state.ingredients).add(ingredient),
      },
      () => console.log(this.state)
    );
    document.getElementById("ingredient").value = "";
  };

  removeHandler = (event) => {
    var discardIngredient = event.target.id;
    var ingredientList = this.state.ingredients;
    ingredientList.delete(discardIngredient);

    this.setState(
      {
        ingredients: ingredientList,
      },
      () => console.log(this.state)
    );
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const dict = {
      ingredient: this.state.ingredients,
      cuisine: document.getElementById("cuisine").value,
      email_id: document.getElementById("email_id").value,
      flag: document.getElementById("Send_email").checked,
      TotalTimeInMins: document.getElementById("max_time").value, 
      type: document.getElementById("type").value
    };
    this.props.sendFormData(dict);
    console.log(dict);
    document.getElementById("cuisine").value = "";
    document.getElementById("email_id").value = "";
    
  };

  render() {
    return (
      <>
      
        <Box
          borderRadius={"lg"}
          border="2px"
          boxShadow={"lg"}
          borderColor={"gray.100"}
          fontFamily="regular"
          m={10}
          width={"23%"}
          height="fit-content"
          p={5}
        >
          <VStack spacing={"5"} alignItems={"flex-start"}>
            <Text fontSize={"larger"} fontWeight={"semibold"}>
              Get A Recipe
            </Text>
            <InputGroup variant={"filled"} zIndex={+2}>
              <TypeAheadDropDown
                iteams={this.state.ingredient_list}
                placeholder_inp={"Ingredients"}
                id_inp={"ingredient"}
              />
              <InputRightElement>
                <Button mt={2} mr={2} onClick={this.addHandler}>
                  Add
                </Button>
              </InputRightElement>
            </InputGroup>
            <HStack direction="row">{this.printHandler()}</HStack>
            <InputGroup variant={"filled"} zIndex={+1}>
              <TypeAheadDropDown
                iteams={this.state.cuisine_list}
                placeholder_inp={"Cuisine"}
                id_inp={"cuisine"}
              />
            </InputGroup>
            <InputGroup variant={"filled"}>
              <Input
                data-testid="email_id"
                type="text"
                id="email_id"
                color={"gray.500"}
                size={"lg"}
                placeholder="Email"
              />
            </InputGroup>
            <InputGroup variant={"filled"}>
              <FormLabel htmlFor="email-alerts" mb="0">
                Enable email alert?
                <Switch ml={2} id="Send_email" name="email" size="md" />
              </FormLabel>
            </InputGroup>
            <InputGroup variant={"filled"}>
              <Input
                data-testid="max_time"
                type="number"
                id="max_time"
                color={"gray.500"}
                size={"lg"}
                placeholder="Max Time (in minutes)"
                onChange={(event) =>
                  this.setState({ maxTime: event.target.value })
                }
              />
            </InputGroup>
            <InputGroup variant={"filled"}>
              <Input
                data-testid="type"
                type="string"
                id="type"
                color={"gray.500"}
                size={"lg"}
                placeholder="Vegetarian, Non-veg, Vegan"
                onChange={(event) =>
                  this.setState({ type: event.target.value })
                }
              />
            </InputGroup>
            <Button
              data-testid="submit"
              id="submit"
              onClick={this.handleSubmit}
              width={"100%"}
              _hover={{ bg: "black", color: "gray.100" }}
              color={"gray.600"}
              bg={"green.300"}
            >
              Search Recipes
            </Button>
          </VStack>
        </Box>
      </>
      
    );
  }
}

export default Form;
