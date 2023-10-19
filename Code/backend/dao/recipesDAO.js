import mongodb from "mongodb";
import nodemailer from "nodemailer";
import password from "./mail_param.js";
const pass = password.password;

const ObjectId = mongodb.ObjectId;
let recipes;
//Function to connect to DB
export default class RecipesDAO {
  static async injectDB(conn) {
    if (recipes) {
      return;
    }
    try {
      recipes = await conn.db(process.env.RECIPES_NS).collection("recipe");
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in recipesDAO: ${e}`
      );
    }
  }
  //Function to get the Recipe List
  static async getRecipes({
    filters = null,
    page = 0,
    recipesPerPage = 10,
  } = {}) {
    let query;
    if (filters) {
      if ("CleanedIngredients" in filters) {
        var str = "(?i)";

        for (var i = 0; i < filters["CleanedIngredients"].length; i++) {
          const str1 = filters["CleanedIngredients"][i];
          str += "(?=.*" + str1 + ")";
        }
        console.log(str);
        query = { "Cleaned-Ingredients": { $regex: str } };
        query["Cuisine"] = filters["Cuisine"];

        var email = filters["Email"];
        var flagger = filters["Flag"];
        console.log(email);
        console.log(flagger);
      }
    }

    let cursor;

    try {
      cursor = await recipes
        .find(query)
        .collation({ locale: "en", strength: 2 });
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { recipesList: [], totalNumRecipess: 0 };
    }

    const displayCursor = cursor.limit(recipesPerPage);
    try {
      const recipesList = await displayCursor.toArray();
      const totalNumRecipes = await recipes.countDocuments(query);

      var str_mail = "";
      for (var j = 1; j <= recipesList.length; j++) {
        str_mail += "\nRecipe " + j + ": \n";
        str_mail += recipesList[j - 1]["TranslatedRecipeName"] + "\n";
        str_mail +=
          "Youtube Link: https://www.youtube.com/results?search_query=" +
          recipesList[j - 1]["TranslatedRecipeName"].replace(/ /g, "+") +
          "\n\n";
      }

      if (flagger == "true") {
        var transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: "group12recipe@gmail.com",
            pass: pass,
          },
        });

        var mailOptions = {
          from: "group12recipe@gmail.com",
          to: email,
          subject: "Recommended Recipes! Enjoy your meal!!",
          text: str_mail,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      }

      return { recipesList, totalNumRecipes };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`
      );
      return { recipesList: [], totalNumRecipes: 0 };
    }
  }

  //Function to get the list of Cuisines
  static async getCuisines() {
    let cuisines = [];
    try {
      cuisines = await recipes.distinct("Cuisine");
      return cuisines;
    } catch (e) {
      console.error(`Unable to get cuisines, ${e}`);
      return cuisines;
    }
  }

  // Function to add a recipe
  static async addRecipe(recipe) {
    console.log("Inside addRecipe");
    console.log(recipe);
    let inputRecipe = {};
    inputRecipe["TranslatedRecipeName"] = recipe["recipeName"];
    inputRecipe["TotalTimeInMins"] = recipe["cookingTime"];
    inputRecipe["Diet-type"] = recipe["dietType"];
    inputRecipe["Recipe-rating"] = recipe["recipeRating"];
    inputRecipe["Cuisine"] = recipe["cuisine"];
    inputRecipe["image-url"] = recipe["imageURL"];
    inputRecipe["URL"] = recipe["recipeURL"];
    inputRecipe["TranslatedInstructions"] = recipe["instructions"];
    var ingredients = "";
    for (var i = 0; i < recipe["ingredients"].length; i++) {
      ingredients += recipe["ingredients"][i] + "%";
    }
    inputRecipe["Cleaned-Ingredients"] = ingredients;
    var restaurants = "";
    var locations = "";
    for (var j = 0; j < recipe["restaurants"].length; j++) {
      restaurants += recipe["restaurants"][j] + "%";
      locations += recipe["locations"][j] + "%";
    }
    inputRecipe["Restaurant"] = restaurants;
    inputRecipe["Restaurant-Location"] = locations;
    console.log("Input Recipe");
    console.log(inputRecipe);
    let response = {};
    // Add ingredients to the ingredient list collection if not already present
    try{
      // Loop over all ingredients
      for(let i = 0; i < recipe["ingredients"].length; i++){
        // Check if ingredient already exists in the collection
        let ingredient = await ingredients.findOne({item_name: recipe["ingredients"][i]});
        // If not, add it
        if(!ingredient){
          response = await ingredients.insertOne({item_name: recipe["ingredients"][i]});
        }
      }
    } catch(e){
      console.error(`Unable to add ingredients, ${e}`);
      return response;
    }

    try{
      response = await recipes.insertOne(inputRecipe);
      return response;
    } catch(e){
      console.error(`Unable to add recipe, ${e}`);
      return response;
    }
  }
}
