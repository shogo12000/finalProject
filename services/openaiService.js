// services/openaiService.js
import axios from 'axios';
//3c4c2fd278334951a313ac5c153ff4f0
//aa6b902b1ef94a15898fb0f5d85449bf
const API_KEY = 'aa6b902b1ef94a15898fb0f5d85449bf';   
const API_URL = 'https://api.spoonacular.com/recipes/findByIngredients';
const RECIPE_INFO_URL = 'https://api.spoonacular.com/recipes/{id}/information';   


export const generateRecipe = async (ingredients) => {
  try { 
    const response = await axios.get(API_URL, {
      params: {
        ingredients: ingredients,  
        number: 5,   
        apiKey: API_KEY,
      },
    });

    if (response.data && response.data.length > 0) { 
      const recipesWithDetails = await Promise.all(
        response.data.map(async (recipe) => { 
          const recipeDetailResponse = await axios.get(RECIPE_INFO_URL.replace('{id}', recipe.id), {
            params: {
              apiKey: API_KEY,
            },
          }); 

          const categories = recipeDetailResponse.data.dishTypes ? recipeDetailResponse.data.dishTypes[0] : 'others';
 
          if (!recipeDetailResponse.data.instructions) {
            return null;  
          }

          return {
            title: recipeDetailResponse.data.title,
            ingredients: recipeDetailResponse.data.extendedIngredients.map(ingredient => ingredient.name).join(', '),
            image: recipeDetailResponse.data.image,
            instructions: recipeDetailResponse.data.instructions,
            categories,  // Only the first category
          };
        })
      );

 
      return recipesWithDetails.filter(recipe => recipe !== null);
    } else {
      return [{ title: 'No recipes found', ingredients: '', image: '', instructions: 'Try with different ingredients.', categories: 'Unknown' }];
    }
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return [{ title: 'Error', ingredients: '', image: '', instructions: 'Could not generate a recipe at the moment.', categories: 'Unknown' }];
  }
};
