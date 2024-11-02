import { render, cleanup, screen, fireEvent, waitFor } from "@testing-library/react";
import { useToast } from "@chakra-ui/react";
import RecipeCard from "../RecipeCard"
import recipeDB from "../../apis/recipeDB";

jest.mock("../../apis/recipeDB");

jest.mock("@chakra-ui/react", () => ({
    ...jest.requireActual("@chakra-ui/react"),
    useToast: jest.fn(),
}));

const mockToast = useToast;
mockToast.mockImplementation(() => mockToast);


const testRecipe= {
    _id: 123,
    TranslatedRecipeName: "Spicy Tomato Rice (Recipe)",
    TotalTimeInMins: 15,
    'Recipe-rating':2,
    'Diet-type': "Vegan", 
    'image-url': "https://www.archanaskitchen.com/images/archanaskitchen/1-Author/b.yojana-gmail.com/Spicy_Thakkali_Rice_Tomato_Pulihora-1_edited.jpg",
    TranslatedInstructions: "To make tomato puliogere, first cut the tomatoes.\r\nNow put in a mixer grinder and puree it.\r\nNow heat oil in a pan.\r\nAfter the oil is hot, add chana dal, urad dal, cashew and let it cook for 10 to 20 seconds.\r\nAfter 10 to 20 seconds, add cumin seeds, mustard seeds, green chillies, dry red chillies and curry leaves.\r\nAfter 30 seconds, add tomato puree to it and mix.\r\nAdd BC Belle Bhat powder, salt and mix it.\r\nAllow to cook for 7 to 8 minutes and then turn off the gas.\r\nTake it out in a bowl, add cooked rice and mix it.\r\nServe hot.\r\nServe tomato puliogre with tomato cucumber raita and papad for dinner.",
    youtube_videos: "https://www.youtube.com/results?search_query=Spicy Tomato Rice (Recipe)"
}

describe("RecipeCard Component", () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    afterEach(cleanup);

    test("renders recipe card with correct information", () => {
        render(<RecipeCard recipe={testRecipe} />);
        
        expect(screen.getByTestId("recipeName")).toHaveTextContent("Spicy Tomato Rice");
        expect(screen.getByTestId("time")).toHaveTextContent("15 mins");
        expect(screen.getByTestId("rating")).toHaveTextContent("4.5");
        expect(screen.getByTestId("diet")).toHaveTextContent("Vegetarian");
    })

    test("should render recipe details modal on click", ()=>{
        render(<RecipeCard recipes={testRecipe} />);
        const cardElement = screen.getByTestId('recipeCard')
        expect(cardElement).toBeInTheDocument()
        fireEvent.click(cardElement)
        const modalElement = screen.getByTestId('recipeModal')
        expect(modalElement).toBeInTheDocument()
    })

    test("displays fallback when image fails to load", () => {
        render(<RecipeCard recipe={testRecipe} />);

        const image = screen.getByTestId("recipeImg");
        fireEvent.error(image);

        expect(screen.getByText("Image not available")).toBeInTheDocument();
    });

    test("calls handler function when card is clicked", () => {
        const mockHandler = jest.fn();
        render(<RecipeCard recipe={testRecipe} handler={mockHandler} />);

        fireEvent.click(screen.getByTestId("recipeCard"));
        expect(mockHandler).toHaveBeenCalledWith(testRecipe);
    });

    test("handles error when saving recipe fails", async () => {
        localStorage.setItem("userName", "testUser");
        recipeDB.post.mockRejectedValueOnce(new Error("Network error"));

        render(<RecipeCard recipe={testRecipe} />);

        const saveButton = screen.getByLabelText("Save recipe");
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: "Error saving recipe",
                    status: "error",
                })
            );
        });
    });


});