from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes, CallbackQueryHandler
from telegram import InlineKeyboardButton, InlineKeyboardMarkup
import pandas as pd
import os
import random

# Method to get correct CSV file path
def get_csv_path(filename=''):
    return os.path.dirname(__file__).replace('Code\\chatbot', 'Data\\') + filename 

bot_token = '8047457125:AAGn6jFUjw3pQT1Wi3AtVEJ59eHKtid61kw'
app = Application.builder().token(bot_token).build()
recipe_df = pd.read_csv(get_csv_path('final_recipe_recommender.csv'))
cuisine_df = pd.read_csv(get_csv_path('Cuisine.csv'))

# Methods to reply to the user
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [
        [InlineKeyboardButton("Get Cuisines", callback_data='get_cuisines')],
        [InlineKeyboardButton("Provide Available Ingredients", callback_data='prov_ingred')],
        [InlineKeyboardButton("Share Your Own Recipe", callback_data='add_recipe')],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text('What do you want to do?', reply_markup=reply_markup)

async def add_recipe(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.edit_message_text(text="Visit https://www.google.com/ to add recipes!") 

async def provide_ingredients(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.edit_message_text(text="Please enter the ingredients separated by commas: \n(eg: egg,milk,oil)")
    context.user_data['awaiting_ingredients_input'] = True

async def get_cuisines(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    cuisines = cuisine_df['Cuisine'].unique()
    keyboard = [[InlineKeyboardButton(cuisine, callback_data=f'cuisine_{cuisine}')] for cuisine in cuisines]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await query.edit_message_text(text="Select a cuisine:", reply_markup=reply_markup)

async def show_dishes_by_cuisine(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    selected_cuisine = query.data.split('_')[1]
    dishes = recipe_df[recipe_df['Cuisine'] == selected_cuisine]['TranslatedRecipeName'].tolist()
    random_dishes = random.sample(dishes, min(20, len(dishes)))
    keyboard = [[InlineKeyboardButton(dish, callback_data=f'recipe_{i}')] for i, dish in enumerate(random_dishes)]
    context.user_data['random_dishes'] = random_dishes
    reply_markup = InlineKeyboardMarkup(keyboard)
    await query.edit_message_text(text=f"Recipes for {selected_cuisine}:", reply_markup=reply_markup)

async def show_recipe_details(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    recipe_index = int(query.data.split('_')[1])
    recipe_name = context.user_data['random_dishes'][recipe_index]
    ingredients, instructions = get_instructions_by_dish_name(recipe_name)
    await query.edit_message_text(text=f"Ingredients:\n{ingredients}\n\nInstructions:\n{instructions}")

def get_instructions_by_dish_name(dish_name):
    selected_recipe = recipe_df[recipe_df['TranslatedRecipeName'] == dish_name].iloc[0]
    ingredients = selected_recipe['TranslatedIngredients']
    instructions = selected_recipe['TranslatedInstructions']
    return ingredients, instructions

def get_recipes_by_ingredients(ingredients):
    ingredients_set = set(ingredients)
    matching_recipes = []

    for _, row in recipe_df.iterrows():
        recipe_ingredients = set(row['TranslatedIngredients'].split(','))
        for ingredient in ingredients:
            if any(ingredient in recipe_ingredient for recipe_ingredient in recipe_ingredients):
                matching_recipes.append(row['TranslatedRecipeName'])
    
    return matching_recipes

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if context.user_data.get('awaiting_ingredients_input'):
        ingredients = update.message.text.split(',')
        ingredients = [ingredient.strip().lower() for ingredient in ingredients]
        context.user_data['awaiting_ingredients_input'] = False
        viable_recipes = get_recipes_by_ingredients(ingredients)
        if len(viable_recipes) == 0:
            await update.message.reply_text(f"Sorry, we could not find anything you can make with only those ingredients :(")
        else:
            ingredients, instructions = get_instructions_by_dish_name(viable_recipes[random.randint(0,len(viable_recipes))])
            await update.message.reply_text(f"Ingredients:\n{ingredients}\n\nInstructions:\n{instructions}")
    else:
        await update.message.reply_text("Please use the provided buttons to interact with the bot.")

# Linking above methods to the bot/app
app.add_handler(CommandHandler("start", start))
app.add_handler(CallbackQueryHandler(provide_ingredients, pattern='prov_ingred'))
app.add_handler(CallbackQueryHandler(get_cuisines, pattern='get_cuisines'))
app.add_handler(CallbackQueryHandler(add_recipe, pattern='add_recipe'))
app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
app.add_handler(CallbackQueryHandler(show_dishes_by_cuisine, pattern='cuisine_'))
app.add_handler(CallbackQueryHandler(show_recipe_details, pattern='recipe_'))


# Running the bot
if __name__ == "__main__":
    app.run_polling()
