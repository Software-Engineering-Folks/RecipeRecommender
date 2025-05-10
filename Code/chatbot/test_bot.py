import sys
import os
import pytest
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes

from Bot import (
    get_csv_path, start, add_recipe, provide_ingredients, get_cuisines,
    show_dishes_by_cuisine, show_recipe_details, get_instructions_by_dish_name,
    get_recipes_by_ingredients, handle_message, app
)

@pytest.fixture
def bot_app():
    return app

def test_get_csv_path():
    assert get_csv_path('test.csv').endswith('Data\\test.csv')

@pytest.mark.asyncio
async def test_start(bot_app):
    update = Update(update_id=1, message=None)
    context = ContextTypes.DEFAULT_TYPE()
    await start(update, context)
    assert update.message.reply_text.called

@pytest.mark.asyncio
async def test_add_recipe(bot_app):
    update = Update(update_id=1, callback_query=None)
    context = ContextTypes.DEFAULT_TYPE()
    await add_recipe(update, context)
    assert update.callback_query.edit_message_text.called

@pytest.mark.asyncio
async def test_provide_ingredients(bot_app):
    update = Update(update_id=1, callback_query=None)
    context = ContextTypes.DEFAULT_TYPE()
    await provide_ingredients(update, context)
    assert update.callback_query.edit_message_text.called

@pytest.mark.asyncio
async def test_get_cuisines(bot_app):
    update = Update(update_id=1, callback_query=None)
    context = ContextTypes.DEFAULT_TYPE()
    await get_cuisines(update, context)
    assert update.callback_query.edit_message_text.called

@pytest.mark.asyncio
async def test_show_dishes_by_cuisine(bot_app):
    update = Update(update_id=1, callback_query=None)
    context = ContextTypes.DEFAULT_TYPE()
    await show_dishes_by_cuisine(update, context)
    assert update.callback_query.edit_message_text.called

@pytest.mark.asyncio
async def test_show_recipe_details(bot_app):
    update = Update(update_id=1, callback_query=None)
    context = ContextTypes.DEFAULT_TYPE()
    await show_recipe_details(update, context)
    assert update.callback_query.edit_message_text.called

@pytest.mark.asyncio
async def test_get_instructions_by_dish_name(bot_app):
    update = Update(update_id=1, callback_query=None)
    context = ContextTypes.DEFAULT_TYPE()
    await get_instructions_by_dish_name(update, context)
    assert update.callback_query.edit_message_text.called

@pytest.mark.asyncio
async def test_get_recipes_by_ingredients(bot_app):
    update = Update(update_id=1, callback_query=None)
    context = ContextTypes.DEFAULT_TYPE()
    await get_recipes_by_ingredients(update, context)
    assert update.callback_query.edit_message_text.called

@pytest.mark.asyncio
async def test_handle_message(bot_app):
    update = Update(update_id=1, message=None)
    context = ContextTypes.DEFAULT_TYPE()
    await handle_message(update, context)
    assert update.message.reply_text.called

def test_bot_initialization(bot_app):
    assert bot_app is not None

@pytest.mark.asyncio
async def test_command_handler_start(bot_app):
    update = Update(update_id=1, message=None)
    context = ContextTypes.DEFAULT_TYPE()
    await start(update, context)
    assert update.message.reply_text.called

@pytest.mark.asyncio
async def test_callback_handler_prov_ingred(bot_app):
    update = Update(update_id=1, callback_query=None)
    context = ContextTypes.DEFAULT_TYPE()
    await provide_ingredients(update, context)
    assert update.callback_query.edit_message_text.called

@pytest.mark.asyncio
async def test_callback_handler_get_cuisines(bot_app):
    update = Update(update_id=1, callback_query=None)
    context = ContextTypes.DEFAULT_TYPE()
    await get_cuisines(update, context)
    assert update.callback_query.edit_message_text.called

@pytest.mark.asyncio
async def test_callback_handler_add_recipe(bot_app):
    update = Update(update_id=1, callback_query=None)
    context = ContextTypes.DEFAULT_TYPE()
    await add_recipe(update, context)
    assert update.callback_query.edit_message_text.called

@pytest.mark.asyncio
async def test_message_handler_text(bot_app):
    update = Update(update_id=1, message=None)
    context = ContextTypes.DEFAULT_TYPE()
    await handle_message(update, context)
    assert update.message.reply_text.called

@pytest.mark.asyncio
async def test_callback_handler_cuisine(bot_app):
    update = Update(update_id=1, callback_query=None)
    context = ContextTypes.DEFAULT_TYPE()
    await show_dishes_by_cuisine(update, context)
    assert update.callback_query.edit_message_text.called

@pytest.mark.asyncio
async def test_callback_handler_recipe(bot_app):
    update = Update(update_id=1, callback_query=None)
    context = ContextTypes.DEFAULT_TYPE()
    await show_recipe_details(update, context)
    assert update.callback_query.edit_message_text.called

@pytest.mark.asyncio
async def test_response_no_ingredients(bot_app):
    update = Update(update_id=1, callback_query=None)
    context = ContextTypes.DEFAULT_TYPE()
    await provide_ingredients(update, context)
    assert update.callback_query.edit_message_text.called

@pytest.mark.asyncio
async def test_response_no_recipes_found(bot_app):
    update = Update(update_id=1, callback_query=None)
    context = ContextTypes.DEFAULT_TYPE()
    await get_recipes_by_ingredients(update, context)
    assert update.callback_query.edit_message_text.called
async def test_provide_ingredients(bot_app):
    update = Update(update_id=1, callback_query=None)
    context = ContextTypes.DEFAULT_TYPE()
    await provide_ingredients(update, context)
    assert update.callback_query.edit_message_text.called

@pytest.mark.asyncio
async def test_get_cuisines(bot_app):
    update = Update(update_id=1, callback_query=None)
    context = ContextTypes.DEFAULT_TYPE()
    await get_cuisines(update, context)
    assert update.callback_query.edit_message_text.called

@pytest.mark.asyncio
async def test_show_dishes_by_cuisine(bot_app):
    update = Update(update_id=1, callback_query=None)
    context = ContextTypes.DEFAULT_TYPE()
    await show_dishes_by_cuisine(update, context)
    assert update.callback_query.edit_message_text.called

@pytest.mark.asyncio
async def test_show_recipe_details(bot_app):
    update = Update(update_id=1, callback_query=None)
    context = ContextTypes.DEFAULT_TYPE()
    await show_recipe_details(update, context)
    assert update.callback_query.edit_message_text.called

@pytest.mark.asyncio
async def test_get_instructions_by_dish_name(bot_app):
    update = Update(update_id=1, callback_query=None)
    context = ContextTypes.DEFAULT_TYPE()
    await get_instructions_by_dish_name(update, context)
    assert update.callback_query.edit_message_text.called

@pytest.mark.asyncio
async def test_get_recipes_by_ingredients(bot_app):
    update = Update(update_id=1, callback_query=None)
    context = ContextTypes.DEFAULT_TYPE()
    await get_recipes_by_ingredients(update, context)
    assert update.callback_query.edit_message_text.called

@pytest.mark.asyncio
async def test_handle_message(bot_app):
    update = Update(update_id=1, message=None)
    context = ContextTypes.DEFAULT_TYPE()
    await handle_message(update, context)
    assert update.message.reply_text.called

def test_bot_initialization(bot_app):
    assert bot_app is not None

@pytest.mark.asyncio
async def test_command_handler_start(bot_app):
    update = Update(update_id=1, message=None)
    context = ContextTypes.DEFAULT_TYPE()
    await start(update, context)
    assert update.message.reply_text.called

@pytest.mark.asyncio
async def test_callback_handler_prov_ingred(bot_app):
    update = Update(update_id=1, callback_query=None)
    context = ContextTypes.DEFAULT_TYPE()
    await provide_ingredients(update, context)
    assert update.callback_query.edit_message_text.called

@pytest.mark.asyncio
async def test_callback_handler_get_cuisines(bot_app):
    update = Update(update_id=1, callback_query=None)
    context = ContextTypes.DEFAULT_TYPE()
    await get_cuisines(update, context)
    assert update.callback_query.edit_message_text.called

@pytest.mark.asyncio
async def test_callback_handler_add_recipe(bot_app):
    update = Update(update_id=1, callback_query=None)
    context = ContextTypes.DEFAULT_TYPE()
    await add_recipe(update, context)
    assert update.callback_query.edit_message_text.called

@pytest.mark.asyncio
async def test_message_handler_text(bot_app):
    update = Update(update_id=1, message=None)
    context = ContextTypes.DEFAULT_TYPE()
    await handle_message(update, context)
    assert update.message.reply_text.called

@pytest.mark.asyncio
async def test_callback_handler_cuisine(bot_app):
    update = Update(update_id=1, callback_query=None)
    context = ContextTypes.DEFAULT_TYPE()
    await show_dishes_by_cuisine(update, context)
    assert update.callback_query.edit_message_text.called

@pytest.mark.asyncio
async def test_callback_handler_recipe(bot_app):
    update = Update(update_id=1, callback_query=None)
    context = ContextTypes.DEFAULT_TYPE()
    await show_recipe_details(update, context)
    assert update.callback_query.edit_message_text.called

@pytest.mark.asyncio
async def test_response_no_ingredients(bot_app):
    update = Update(update_id=1, callback_query=None)
    context = ContextTypes.DEFAULT_TYPE()
    await provide_ingredients(update, context)
    assert update.callback_query.edit_message_text.called

@pytest.mark.asyncio
async def test_response_no_recipes_found(bot_app):
    update = Update(update_id=1, callback_query=None)
    context = ContextTypes.DEFAULT_TYPE()
    await get_recipes_by_ingredients(update, context)
    assert update.callback_query.edit_message_text.called