import { render, cleanup, screen, fireEvent, waitFor } from "@testing-library/react";
import { useToast } from "@chakra-ui/react";
import RecipeCard from "../RecipeCard";
import recipeDB from "../../apis/recipeDB";

jest.mock("../../apis/recipeDB");

jest.mock("@chakra-ui/react", () => ({
    ...jest.requireActual("@chakra-ui/react"),
    useToast: jest.fn(),
}));

const mockToast = useToast;
mockToast.mockImplementation(() => mockToast);

const testRecipe = {
    _id: 123,
    TranslatedRecipeName: "Spicy Tomato Rice (Recipe)",
    TotalTimeInMins: 15,
    "Recipe-rating": 2,
    "Diet-type": "Vegan",
    "image-url": "https://example.com/image.jpg",
    TranslatedInstructions:
        "To make tomato puliogere, first cut the tomatoes...",
    youtube_videos:
        "https://www.youtube.com/results?search_query=Spicy Tomato Rice",
};

describe("RecipeCard Component", () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    afterEach(cleanup);

    // 1. basic rendering of recipe card
    test("renders recipe card with correct information", () => {
        render(<RecipeCard recipe={testRecipe} />);
        expect(screen.getByTestId("recipeName")).toHaveTextContent(
            "Spicy Tomato Rice"
        );
        expect(screen.getByTestId("time")).toHaveTextContent("15 mins");
        expect(screen.getByTestId("rating")).toHaveTextContent("2");
        expect(screen.getByTestId("diet")).toHaveTextContent("Vegan");
    });

    // 2. handling of recipe image
    test("displays fallback when image fails to load", () => {
        render(<RecipeCard recipe={testRecipe} />);
        const image = screen.getByTestId("recipeImg");
        fireEvent.error(image);
        expect(screen.getByText("Image not available")).toBeInTheDocument();
    });

    // 3. recipe name truncation
    test("truncates long recipe names correctly", () => {
        const longNameRecipe = {
            ...testRecipe,
            TranslatedRecipeName:
                "This is a very long recipe name that should be truncated because it exceeds the maximum length allowed",
        };
        render(<RecipeCard recipe={longNameRecipe} />);
        const nameElement = screen.getByTestId("recipeName");
        expect(nameElement).toHaveStyle({ WebkitLineClamp: "2" });
    });

    // 4. handling clicks
    test("calls handler function when card is clicked", () => {
        const mockHandler = jest.fn();
        render(<RecipeCard recipe={testRecipe} handler={mockHandler} />);
        fireEvent.click(screen.getByTestId("recipeCard"));
        expect(mockHandler).toHaveBeenCalledWith(testRecipe);
    });

    // 5. save failure
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

    // 6. login warning
    test("shows warning toast when user is not logged in and tries to save", async () => {
        render(<RecipeCard recipe={testRecipe} />);
        const saveButton = screen.getByLabelText("Save recipe");
        fireEvent.click(saveButton);
        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: "Please log in",
                    status: "warning",
                })
            );
        });
    });

    // 7. successfull save of bookmarks
    test("successfully saves recipe when logged in", async () => {
        localStorage.setItem("userName", "testUser");
        recipeDB.post.mockResolvedValueOnce({});
        render(<RecipeCard recipe={testRecipe} />);
        const saveButton = screen.getByLabelText("Save recipe");
        fireEvent.click(saveButton);
        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: "Recipe saved!",
                    status: "success",
                })
            );
        });
    });

    // 8. successful unsave of bookmarks
    test("successfully removes saved recipe", async () => {
        localStorage.setItem("userName", "testUser");
        recipeDB.get.mockResolvedValueOnce({ data: [testRecipe] });
        render(<RecipeCard recipe={testRecipe} />);
        await waitFor(() => {
            const saveButton = screen.getByLabelText("Save recipe");
            fireEvent.click(saveButton);
        });
        await waitFor(() => {
            expect(mockToast).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: "Bookmarks Updated!",
                    status: "success",
                })
            );
        });
    });

    // 9. loading icon when saving
    test("shows loading state while saving recipe", async () => {
        localStorage.setItem("userName", "testUser");
        let resolvePromise;
        const savePromise = new Promise((resolve) => {
            resolvePromise = resolve;
        });
        recipeDB.post.mockImplementationOnce(() => savePromise);
        render(<RecipeCard recipe={testRecipe} />);
        const saveButton = screen.getByLabelText("Save recipe");
        fireEvent.click(saveButton);
        expect(saveButton).toHaveAttribute("data-loading");
        resolvePromise({});
    });

    // testing of colors
    const ratingTestCases = [
        { rating: 4.7, expectedColor: "green.500" },
        { rating: 4.2, expectedColor: "teal.500" },
        { rating: 3.5, expectedColor: "yellow.500" },
        { rating: 2.8, expectedColor: "orange.500" },
    ];

    test.each(ratingTestCases)(
        "applies correct color for rating $rating",
        ({ rating, expectedColor }) => {
            const recipeWithRating = { ...testRecipe, "Recipe-rating": rating };
            render(<RecipeCard recipe={recipeWithRating} />);
            const ratingElement = screen.getByTestId("rating");
            expect(ratingElement).toHaveStyle({ color: expectedColor });
        }
    );

    // 14. event propagation
    test("prevents card click when clicking save button", () => {
        const mockHandler = jest.fn();
        render(<RecipeCard recipe={testRecipe} handler={mockHandler} />);
        const saveButton = screen.getByLabelText("Save recipe");
        fireEvent.click(saveButton);
        expect(mockHandler).not.toHaveBeenCalled();
    });

    // 15. initial bookmark state value check
    test("correctly sets initial bookmark state from API", async () => {
        localStorage.setItem("userName", "testUser");
        recipeDB.get.mockResolvedValueOnce({ data: [testRecipe] });
        render(<RecipeCard recipe={testRecipe} />);
        await waitFor(() => {
            const saveButton = screen.getByLabelText("Save recipe");
            expect(saveButton).toHaveClass(/green/);
        });
    });

    // 16. error handling of pulliing bookmarks state from db
    test("handles API error when fetching bookmark state", async () => {
        localStorage.setItem("userName", "testUser");
        const consoleSpy = jest
            .spyOn(console, "error")
            .mockImplementation(() => {});
        recipeDB.get.mockRejectedValueOnce(new Error("API Error"));
        render(<RecipeCard recipe={testRecipe} />);
        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalled();
        });
        consoleSpy.mockRestore();
    });

    // 17. color scheme check for diet type
    test("applies correct color scheme for vegetarian diet", () => {
        const vegRecipe = { ...testRecipe, "Diet-type": "Vegetarian" };
        render(<RecipeCard recipe={vegRecipe} />);
        const badge = screen.getByTestId("diet");
        expect(badge).toHaveClass(/green/);
    });

    // 18. hover card animation check
    test("applies hover styles on card hover", async () => {
        render(<RecipeCard recipe={testRecipe} />);
        const card = screen.getByTestId("recipeCard");
        fireEvent.mouseOver(card);
        expect(card).toHaveStyle({ transform: "translateY(-8px)" });
    });

    // 19. missing recipe data check
    test("handles missing recipe data gracefully", () => {
        const incompleteRecipe = {
            _id: 123,
            TranslatedRecipeName: "Incomplete Recipe",
        };
        render(<RecipeCard recipe={incompleteRecipe} />);
        expect(screen.getByTestId("recipeName")).toBeInTheDocument();
        expect(screen.getByTestId("time")).toHaveTextContent("0 mins");
    });

    // 20. multiple save clicks test
    test("prevents multiple simultaneous save attempts", async () => {
        localStorage.setItem("userName", "testUser");
        render(<RecipeCard recipe={testRecipe} />);
        const saveButton = screen.getByLabelText("Save recipe");

        fireEvent.click(saveButton);
        fireEvent.click(saveButton);
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(recipeDB.post).toHaveBeenCalledTimes(1);
        });
    });
});
