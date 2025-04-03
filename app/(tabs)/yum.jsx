import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Image,
  Animated,
  TouchableOpacity,
} from "react-native";
import { generateRecipe } from "../../services/openaiService";
import RecipeModal from "@/components/RecipeModal"; // Importando o modal

export default function RecipeScreen() {
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const slideAnim = useRef(new Animated.Value(400)).current;

  const handleGenerateRecipe = async () => {
    if (!ingredients.trim()) {
      setRecipes([{ title: "Please enter some ingredients." }]);
      return;
    }

    setRecipes([{ title: "Generating recipe... ⏳" }]);
    const response = await generateRecipe(ingredients);
    setRecipes(response);
  };

  const openModal = (recipe) => {
    setSelectedRecipe(recipe);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 1000,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setSelectedRecipe(null));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        Tell us what you have and find wonderful recipes!🍽️
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter ingredients (e.g. tomato, cheese, bread)"
        value={ingredients}
        onChangeText={setIngredients}
      />
      {/* <Button style={styles.btnRecipe} title="Generate Recipe" onPress={handleGenerateRecipe} /> */}
      
      <TouchableOpacity style={styles.btnRecipe} onPress={handleGenerateRecipe}>
        <Text style={styles.btnText}>Generate Recipe</Text>
      </TouchableOpacity>

      {recipes.length > 0 ? (
        recipes.map((recipe, index) => (
          <TouchableOpacity key={index} onPress={() => openModal(recipe)}>
            <View style={styles.recipeItem}>
              {recipe.image && (
                <Image
                  source={{ uri: recipe.image }}
                  style={styles.recipeImage}
                />
              )}
              <Text style={styles.recipeTitle}>{recipe.title}</Text>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text>No recipes found</Text>
      )}

      <RecipeModal
        recipe={selectedRecipe}
        visible={!!selectedRecipe}
        onClose={closeModal}
        slideAnim={slideAnim}
        saveBtn={true}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 40,
    alignItems: "center",
    paddingBottom: 80,
  },
  title: {
 
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  recipeItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
    width: "100%",
    maxWidth: 350, // Ajusta a largura dos itens
  },
  recipeImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flexGrow: 1,
    flexWrap: "wrap",
    paddingEnd: "100",
  },
  btnRecipe: {
    backgroundColor: "#007BFF",  // Cor de fundo azul
    paddingVertical: 12,  // Padding vertical
    paddingHorizontal: 25,  // Padding horizontal
    borderRadius: 5,  // Bordas arredondadas
    marginBottom: 20,  // Espaçamento abaixo do botão
    alignItems: "center",  // Centralizar o texto dentro do botão
    borderWidth: 1,  // Adiciona borda ao botão
    borderColor: "#0056b3", // Cor da borda quando o botão está em foco
  },
  btnText: {
    fontSize: 16,  // Tamanho da fonte
    fontWeight: "bold",  // Deixa o texto em negrito
    color: "white",  // Cor do texto branco
  },
});
