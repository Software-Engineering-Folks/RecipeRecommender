/* MIT License

Copyright (c) 2023 Pannaga Rao, Harshitha, Prathima, Karthik  */

import { useEffect, useState } from "react";
import BookMarksRecipeList from "./BookMarksRecipeList";
import { Heading, Flex, Button, Spacer } from "@chakra-ui/react"
import recipeDB from "../apis/recipeDB";
import { useAuth0 } from "@auth0/auth0-react";

const UserProfile = (props) => {
    const [bookmarks, setBookmarks] = useState([]);
    const { user } = useAuth0();

    // useEffect(() => {
    //     const bks = recipeDB.get("/recipes/getBookmarks", {
    //         params: {
    //             userName: user.nickname,
    //         }
    //     })
    //     bks.then(res => {
    //         if (res.data.bookmarks) {
    //             console.log("BookMarks:", res.data.bookmarks)
    //             setBookmarks(res.data.bookmarks)
    //         }
    //     })
    // }, [user.nickname])

    // const handleDeleteRecipe = (recipeToDelete) => {
    //     console.log("Deleting Recipe:", recipeToDelete);
    //     setBookmarks((prevBookmarks) => {
    //         const updatedBookmarks = prevBookmarks.filter(
    //             (recipe) => recipe.id !== recipeToDelete.id
    //         );
    //         console.log("Updated Bookmarks:", updatedBookmarks);
    //         return updatedBookmarks;
    //     });
    // };

    // Function to fetch bookmarks
    const fetchBookmarks = async () => {
        try {
            const response = await recipeDB.get("/recipes/getBookmarks", {
                params: { userName: user.nickname },
            });
            if (response.data.bookmarks) {
                console.log("BookMarks:", response.data.bookmarks);
                setBookmarks(response.data.bookmarks);
            }
        } catch (error) {
            console.error("Error fetching bookmarks:", error);
        }
    };

    useEffect(() => {
        if (user?.nickname) {
            fetchBookmarks(); // Fetch bookmarks on component mount
        }
    }, [user?.nickname]);

    // Delete recipe and refetch bookmarks
    const handleDeleteRecipe = async (recipeToDelete) => {
        try {
            console.log("Deleting Recipe:", recipeToDelete);
            // Call backend to delete the recipe
            await recipeDB.post("/recipes/removeRecipeFromProfile", {
                userName: user.nickname,
                recipe: recipeToDelete, // Pass the recipe to the API
            });

            // Refetch bookmarks from backend
            await fetchBookmarks();
        } catch (error) {
            console.error("Error deleting recipe:", error);
        }
    };

    const handleClick = () => {
        props.handleProfileView()
    }
    
    return (
        <>
            <Flex >
                <Heading size={"md"} ml={10} mr={10}>Saved Recipes for {props.user.userName}</Heading>
                <Spacer />
                <Button onClick={handleClick} mr={10}>Go to HomePage</Button>
            </Flex>
            {bookmarks.length === 0 ?
                <></>
                :
                <BookMarksRecipeList
                    recipes={bookmarks}
                    currentUserName={user.userName}
                    onDelete={handleDeleteRecipe}
                />
            }
        </>
    )
}

export default UserProfile;