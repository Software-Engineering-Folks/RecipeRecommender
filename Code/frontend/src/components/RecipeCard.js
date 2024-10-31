import React, { useState, useEffect } from "react";
import { Box, Card, CardHeader, Heading, Text, CardBody, Image, useToast, Flex, Badge, IconButton, Skeleton, Stack} from "@chakra-ui/react";
import { ClockIcon, StarIcon, BookmarkIcon } from "lucide-react";
import recipeDB from "../apis/recipeDB";

const RecipeCard = ({ recipe, handler }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [imageError, setImageError] = useState(false);
    const toast = useToast();

    useEffect(() => {
        const fetchBookmarkedRecipes = async () => {
            const userName = localStorage.getItem("userName");
            if (!userName) return;

            try {
                const { data } = await recipeDB.get(`/recipes/getBookmarkedRecipes`,
                    {
                        params: { userName },
                    }
                );

                const isRecipeBookmarked = data.some(
                    (bookmarkedRecipe) => bookmarkedRecipe._id === recipe._id
                );

                setIsSaved(isRecipeBookmarked);
            } catch (error) {
                console.error("Error fetching bookmarked recipes:", error);
            }
        };

        fetchBookmarkedRecipes();
    }, [recipe._id]);

    const handleClick = () => {
        if (handler) {
            handler(recipe);
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        const userName = localStorage.getItem("userName");

        if (!userName) {
            toast({
                title: "Please log in",
                description: "You need to be logged in to save recipes",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            setIsLoading(false);
            return;
        }

        try {
            if (!isSaved) {
                console.log("recipe:", recipe)
                await recipeDB.post("/recipes/addRecipeToProfile", {
                    userName,
                    recipe,
                });

                setIsSaved(true);
                toast({
                    title: "Recipe saved!",
                    description: "Recipe has been added to your profile",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            }

            else {
                await recipeDB.post("/recipes/removeRecipeFromProfile", {
                    userName,
                    recipe,
                });
                setIsSaved(false);
                toast({
                    title: "Bookmarks Updated!",
                    description: "Recipe has been removed from your profile",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            }

        } catch (error) {
            console.error(`Error saving recipe for user ${userName}:`, error);
            toast({
                title: "Error saving recipe",
                description: "Please try again later",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageError = () => {
        setImageError(true);
    };

    const getRatingColor = (rating) => {
        if (rating >= 4.5) return "green.500";
        if (rating >= 4.0) return "teal.500";
        if (rating >= 3.0) return "yellow.500";
        return "orange.500";
    };

    return (
        <Card
            data-testid="recipeCard"
            overflow="hidden"
            transition="all 0.3s"
            _hover={{
                transform: "translateY(-8px)",
                boxShadow: "xl",
                cursor: "pointer",
            }}
        >
            <Box position="relative">
                {!imageError ? (
                    <Image
                        data-testid="recipeImg"
                        src={recipe["image-url"]}
                        alt={recipe.TranslatedRecipeName}
                        objectFit="cover"
                        height="200px"
                        width="100%"
                        onError={handleImageError}
                        fallback={<Skeleton height="200px" />}
                    />
                ) : (
                    <Box
                        height="200px"
                        bg="gray.100"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Text color="gray.500">Image not available</Text>
                    </Box>
                )}

                <IconButton
                    icon={<BookmarkIcon />}
                    position="absolute"
                    top="4"
                    right="4"
                    colorScheme={isSaved ? "green" : "gray"}
                    isLoading={isLoading}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleSave();
                    }}
                    aria-label="Save recipe"
                />
            </Box>

            <CardHeader onClick={handleClick} pb="2">
                <Heading data-testid="recipeName" size="md" noOfLines={2}>
                    {recipe.TranslatedRecipeName}
                </Heading>
            </CardHeader>

            <CardBody pt="0">
                <Stack spacing="3">
                    <Flex align="center" justify="space-between">
                        <Flex align="center">
                            <ClockIcon size={16} />
                            <Text data-testid="time" ml="2" fontSize="sm">
                                {recipe.TotalTimeInMins} mins
                            </Text>
                        </Flex>
                        <Flex align="center">
                            <StarIcon size={16} />
                            <Text
                                data-testid="rating"
                                ml="2"
                                color={getRatingColor(recipe["Recipe-rating"])}
                                fontWeight="bold"
                            >
                                {recipe["Recipe-rating"]}
                            </Text>
                        </Flex>
                    </Flex>

                    <Badge
                        data-testid="diet"
                        colorScheme={
                            recipe["Diet-type"]?.toLowerCase() === "vegetarian"
                                ? "green"
                                : "purple"
                        }
                        alignSelf="flex-start"
                    >
                        {recipe["Diet-type"]}
                    </Badge>
                </Stack>
            </CardBody>
        </Card>
    );
};

export default RecipeCard;
