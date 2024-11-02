import express from "express";
import RecipesCtrl from "./recipes.controller.js";

const router = express.Router();

//URl to get the recipes
router.route("/").get(RecipesCtrl.apiGetRecipes);

router.route("/cuisines").get(RecipesCtrl.apiGetRecipeCuisines);

router.route("/addRecipe").post(RecipesCtrl.apiPostRecipe);

router.route("/callIngredients").get(RecipesCtrl.apiGetIngredients);

router.route("/signup").post(RecipesCtrl.apiAuthSignup);

router.route("/login").get(RecipesCtrl.apiAuthLogin);

router.route("/getBookmarks").get(RecipesCtrl.apiGetBookmarks);

router.route("/getBookmarkedRecipes").get(RecipesCtrl.apiGetBookmarkedRecipes);

router.route("/addRecipeToProfile").post(RecipesCtrl.apiPostRecipeToProfile);

router.route("/removeRecipeFromProfile").post(RecipesCtrl.apiRemoveRecipeFromProfile);

router.route("/getRecipeByName").get(RecipesCtrl.apiGetRecipeByName);

router.route("/generateRecipe").post(RecipesCtrl.apiGenerateRecipe);


export default router;