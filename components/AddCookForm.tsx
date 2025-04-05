import { useMutation, useQuery } from "@apollo/client";
import { Button, StyleSheet, TextInput, Image, View, Alert } from "react-native";
import { useState, useEffect } from "react";
import { ADD_CATEGORY, GET_CATEGORIES, ADD_RECIPE } from "@/services/queries";

interface AddCookFormProps {
  photoUri: string;
  setPhotoUri: (value: string) => void;
  title: string;
  setTitle: (value: string) => void;
  ingredients: string;
  setIngredients: (value: string) => void;
  instructions: string;
  setInstructions: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
}

export default function AddCookForm({
  photoUri,
  setPhotoUri,
  title,
  setTitle,
  ingredients,
  setIngredients,
  instructions,
  setInstructions,
  category,
  setCategory,
}: AddCookFormProps) {
  const [addRecipe] = useMutation(ADD_RECIPE);
  const { data: categoriesData } = useQuery(GET_CATEGORIES);
  const [addCategory, { loading, error }] = useMutation(ADD_CATEGORY);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", "Failed to add category");
    }
  }, [error]);

  const handleSaveRecipe = async () => {
    try {
      const existingCategory = categoriesData?.categories.find(
        (cat: { name: string }) => cat.name === category
      );

      if (!existingCategory) {
        await addCategory({ variables: { name: category || "others" } });
      }

      await addRecipe({
        variables: {
          title,
          ingredients,
          instructions,
          category: category || "others",
          image_url: photoUri,
        },
      });

      // Reset form fields
      setTitle("");
      setIngredients("");
      setInstructions("");
      setCategory("");
      setPhotoUri("");
    } catch (err) {
      console.error("Error saving recipe:", err);
      Alert.alert("Error", "Failed to save recipe");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Ingredients" value={ingredients} onChangeText={setIngredients} />
      <TextInput style={styles.input} placeholder="Instructions" value={instructions} onChangeText={setInstructions} />
      <TextInput style={styles.input} placeholder="Category" value={category} onChangeText={setCategory} />
      {photoUri && <Image source={{ uri: photoUri }} style={styles.preview} />}
      <Button title={loading ? "Saving..." : "Save Recipe"} onPress={handleSaveRecipe} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
 
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    width: "100%",
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  preview: {
    width: 150,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
});


// https://github.com/shogo12000/finalProject
// https://github.com/shogo12000/finalProjectBack