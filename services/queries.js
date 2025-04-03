// queries.ts
import { gql } from "@apollo/client";

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;

export const GET_RECIPES = gql`
  query GetRecipes($category: String) {
    recipes(category: $category) {
      id
      title
      ingredients
      instructions
      category
      rating
      image_url
    }
  }
`;


export const ADD_CATEGORY = gql`
  mutation AddCategory($name: String!) {
    addCategory(name: $name) {
      id
      name
    }
  }
`;


export const REMOVE_RECIPE = gql`
  mutation RemoveRecipe($id: String!) {
    removeRecipe(id: $id) {
      id
      title
    }
  }
`;


export const ADD_RECIPE = gql`
  mutation AddRecipe(
    $title: String!
    $ingredients: String!
    $instructions: String!
    $category: String!
    $image_url: String!
  ) {
    addRecipe(
      title: $title
      ingredients: $ingredients
      instructions: $instructions
      category: $category
      image_url: $image_url
    ) {
      id
      title
      ingredients
      instructions
      category
      rating
      image_url
    }
  }
`;

 