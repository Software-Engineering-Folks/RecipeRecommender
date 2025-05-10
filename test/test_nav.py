import requests;
def test_1() :
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=egg").text
    assert result.find("egg") != -1

def test_2() :
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=Mango&Cuisine=Indian").json()
    assert result['recipes'] != 0


def test_3() :
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=Mango&Cuisine=Indian&maxTime=40").json()
    assert result['recipes'] != 0
    

def test_4() :
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=Mango&Cuisine=Indian&maxTime=40").json()
    assert result['recipes'] != 0


def test_5():
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=Cheese").text
    assert result.find("Cheese") != -1

def test_6() :
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=Mango&Cuisine=Indian&maxTime=40&type=vegan").json()
    assert result['recipes'] != 0

def test_7() :
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=Mango&Cuisine=Indian&maxTime=40&type=Non-Vegetarian").json()
    assert result['entries_per_page'] != 0

def test_8():
    result = requests.get("http://localhost:1000/api/v1/recipes?Cuisine=Inidan")
    assert result is not None

def test_9() :
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=egg&Cuisine=Indian&maxTime=5&type=vegan").json()
    assert result is not None


def test_10() :
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=milk,rice&Cuisine=Indian&maxTime=5&type=Vegetarian").text
    assert result.find("Vegetarian")!=-1

def test_11() :
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=chicken&Cuisine=Indian&maxTime=5&type=Non-Vegetarian").text
    assert result.find("5")!=-1

def test_12() :
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=poark&Cuisine=American&maxTime=15&type=Non-Vegetarian").json()
    assert result['total_results'] >4


def test_13() :
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=egg&Cuisine=Indian&maxTime=50&type=Non-Vegetarian").json()
    assert result['total_results'] !=0


def test_14():
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=fish")
    assert result.status_code == 200

def test_15():
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=fish&&maxTime=5")
    assert result.status_code == 200

def test_16() :
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=chicken&Cuisine=Indian&maxTime=5&type=Non-Vegetarian").json()
    assert result is not None
def test_17() :
    result = requests.get("http://localhost:1000/api/v1/recipes?CleanedIngredients=chicken").json()
    assert result['recipes'] != 0