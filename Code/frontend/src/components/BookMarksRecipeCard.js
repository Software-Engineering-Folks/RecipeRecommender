/* MIT License

Copyright (c) 2023 Pannaga Rao, Harshitha, Prathima, Karthik  */

import React, { useState } from "react";
import { Box, Card, CardHeader, Heading, Text, CardBody, Image, Flex, Badge, Skeleton, Stack} from "@chakra-ui/react";
import { ClockIcon, StarIcon } from "lucide-react";

const BookMarksRecipeCard = ({ recipe, handler }) => {
    const [imageError, setImageError] = useState(false);

    const handleClick = ()=> {
        if (handler) {
            handler(recipe);
        }
    }

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
}

export default BookMarksRecipeCard;