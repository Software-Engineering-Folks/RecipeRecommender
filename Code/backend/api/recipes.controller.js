import RecipesDAO from "../dao/recipesDAO.js";
import axios from "axios";

export default class RecipesController {
    static async apiAuthLogin(req, res) {
        let filters = {};
        filters.userName = req.query.userName;
        filters.password = req.query.password;
        const { success, user } = await RecipesDAO.getUser({
            filters,
        });
        res.json({ success, user });
    }
    static async apiAuthSignup(req, res) {
        if (req.body) {
            let data = {};
            data.userName = req.body.userName;
            data.password = req.body.password;
            const { success, user } = await RecipesDAO.addUser({
                data,
            });
            res.json({ success, user });
        }
    }

    static async apiGetBookmarks(req, res) {
        if (req.query.userName) {
            const bookmarks = await RecipesDAO.getBookmarks(req.query.userName);
            console.log(bookmarks);
            res.json({ bookmarks });
        } else {
            res.json("Username not given");
        }
    }

    static async apiGetBookmarkedRecipes(req, res) {
        const userName = req.query.userName;
        if (!userName)
            return res.status(400).json({ error: "Username required" });

        try {
            const response = await RecipesDAO.getBookmarkedRecipes(userName);
            res.json(response);
        } catch (e) {
            console.error(`Failed to retrieve bookmarks for ${userName}:`, e);
            res.status(500).json({ error: "Failed to retrieve bookmarks" });
        }
    }

    static async apiPostRecipeToProfile(req, res) {
        if (req.body) {
            const { userName, recipe } = req.body;
            try {
                const response = RecipesDAO.addRecipeToProfile(
                    userName,
                    recipe
                );
                res.json(response);
            } catch (e) {
                console.log(`error: ${e}`);
            }
        } else {
            res.json({ success: false });
        }
    }

    static async apiRemoveRecipeFromProfile(req, res) {
        if (req.body) {
            const { userName, recipe } = req.body;
            try {
                const response = await RecipesDAO.removeRecipeFromProfile(
                    userName,
                    recipe
                );
                res.json(response);
            } catch (e) {
                console.log(`error: ${e}`);
                res.status(500).json({ error: e.message });
            }
        } else {
            res.json({ success: false });
        }
    }

    static async apiGetRecipeByName(req, res) {
        let filters = {};
        //Checking the query to find the required results
        console.log(req.query);
        if (req.query.recipeName) {
            filters.recipeName = req.query.recipeName;
        }

        const { recipesList } = await RecipesDAO.getRecipeByName({
            filters,
        });

        let response = {
            recipes: recipesList,
        };
        res.json(response);
    }

    static async apiGetRecipes(req, res, next) {
        const recipesPerPage = req.query.recipesPerPage
            ? parseInt(req.query.recipesPerPage, 10)
            : 20;
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;

        let filters = {};
        //Checking the query to find the required results

        if (req.query.CleanedIngredients) {
            filters.CleanedIngredients = req.query.CleanedIngredients;
            filters.Cuisine = req.query.Cuisine;
            filters.Email = req.query.Email;
            filters.Flag = req.query.Flag;
        }

        const { recipesList, totalNumRecipes } = await RecipesDAO.getRecipes({
            filters,
            page,
            recipesPerPage,
        });

        let response = {
            recipes: recipesList,
            page: page,
            filters: filters,
            entries_per_page: recipesPerPage,
            total_results: totalNumRecipes,
        };
        res.json(response);
    }
    
    //Function to get the cuisines
    static async apiGetRecipeCuisines(req, res, next) {
        try {
            let cuisines = await RecipesDAO.getCuisines();
            res.json(cuisines);
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e });
        }
    }

    static async apiPostRecipe(req, res, next) {
        try {
            let response = await RecipesDAO.addRecipe(req.body);
            res.json(response);
        } catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e });
        }
    }

    static async apiGetIngredients(req, res, next) {
        console.log("received request for ingredients");
        try {
            let ingredients = await RecipesDAO.getIngredients();
            res.json(ingredients);
        } catch (e) {
            res.status(500).json({ error: e });
        }
    }
    
    static async apiGenerateRecipe(req, res) {
        const { recipeName, cookingTime, dietType, cuisine, ingredients } = req.body;

        if (!recipeName) {
            return res.status(400).json({ message: "Recipe name is required" });
        }

        try {   
            let prompt = `Generate detailed cooking instructions for ${recipeName}.`;
            
            if (cuisine) {
                prompt += ` This should be a ${cuisine} style recipe.`;
            }
            
            if (dietType) {
                prompt += ` The recipe should be suitable for ${dietType} diet.`;
            }
            
            if (ingredients && ingredients.length > 0) {
                prompt += ` Use these ingredients: ${ingredients.join(", ")}.`;
            }
            
            if (cookingTime) {
                prompt += ` The cooking time should be approximately ${cookingTime} minutes.`;
            }

            prompt += ` Please provide step-by-step cooking instructions.`;
            console.log("Prompt: ", prompt);

            const openaiResponse = await axios.post(
                "https://api.openai.com/v1/chat/completions",  
                {
                    model: "gpt-3.5-turbo",  
                    messages: [{
                        role: "user",
                        content: prompt
                    }],
                    temperature: 0.7,
                    max_tokens: 500
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const instructions = openaiResponse.data.choices[0].message.content.trim();
            console.log("Instructions: " ,instructions)
            res.json({ instructions });
        } catch (error) {
            console.error("Error generating recipe:", error.response?.data || error.message);
            res.status(500).json({ 
                message: "Failed to generate recipe",
                error: error.response?.data || error.message 
            });
        }
    }
}