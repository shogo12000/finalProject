import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useQuery } from "@apollo/client";
import { ThemedView } from "@/components/ThemedView";
import RecipeModal from "@/components/RecipeModal";
import { GET_CATEGORIES, GET_RECIPES } from "../../services/queries";
import { useEffect } from 'react';
import { useIsFocused } from "@react-navigation/native"; 

export default function TabTwoScreen() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const slideAnim = useRef(new Animated.Value(400)).current;

  const isFocused = useIsFocused();; 
  
  const {
    loading: categoriesLoading,
    error: categoriesError,
    data: categoriesData,
    refetch: refetchCategories
  } = useQuery(GET_CATEGORIES);

  const {
    loading: recipesLoading,
    error: recipesError,
    data: recipesData,
    refetch: refetchRecipes,
  } = useQuery(GET_RECIPES, {
    variables: {
      category: selectedCategory === "All" ? null : selectedCategory,
    },
    skip: !categoriesData,
  });

  useEffect(() => {
    if (isFocused) { 
      const fetchData = async () => {
        await refetchCategories();
        await refetchRecipes();
      };
  
      fetchData();
    }
  }, [isFocused]);
  
  if (categoriesLoading || recipesLoading) return <Text>Loading...</Text>;
  if (categoriesError || recipesError)
    return (
      <Text>Error: {categoriesError?.message || recipesError?.message}</Text>
    );

  // Abre o modal com animação
  const openModal = (recipe) => {
    setSelectedRecipe(recipe);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  // Fecha o modal com animação
  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 1000,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setSelectedRecipe(null));
  };

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <FlatList
        data={categoriesData.categories}
        keyExtractor={(item) => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={styles.categoryList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryItem,
              selectedCategory === item.name && styles.activeCategory,
            ]}
            onPress={() => {
              setSelectedCategory(item.name);
              refetchRecipes(); // Chama o refetch para atualizar as receitas com a nova categoria
            }}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={recipesData?.recipes || []}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        style={styles.recipeList}
        renderItem={({ item }) => (
          <View style={styles.recipeItemView}>
            <TouchableOpacity onPress={() => openModal(item)}>
              <View style={styles.recipeItem}>
                {item.image_url && (
                  <Image
                    source={{ uri: item.image_url }}
                    style={styles.recipeImage}
                  />
                )}
                <View style={styles.recipeTitleContainer}>
                  <Text style={styles.recipeTitle}>{item.title}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />

      <RecipeModal
        recipe={selectedRecipe}
        visible={!!selectedRecipe}
        onClose={closeModal}
        slideAnim={slideAnim}
        deleteBtn={true}
        refetchCategories={refetchCategories}
        refetchRecipes={refetchRecipes}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    paddingHorizontal: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "center",
  },
  categoryItem: {
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  activeCategory: {
    backgroundColor: "#4CAF50",
    borderColor: "#388E3C",
  },
  recipeItemView: {
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  recipeItem: {
    display: "flex",
    flexDirection: "row",
    gap: "15",
    alignItems: "center",
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    paddingEnd: "70",
  },
  recipeImage: {
    width: 100,
    height: 100,
  },
  recipeList: {
    marginTop: 20,
    marginBottom: 80,
  },
  categoryList: {
    height: 40,
    maxHeight:40,
    minHeight:40,
  }
});
