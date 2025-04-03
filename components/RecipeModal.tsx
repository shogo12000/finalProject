import React from "react";
import {
  View,
  Text,
  Image,
  Modal,
  Button,
  Animated,
  StyleSheet,
  PanResponder,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import HTML from "react-native-render-html";
import {
  ADD_CATEGORY,
  REMOVE_RECIPE,
  GET_CATEGORIES,
  ADD_RECIPE,
} from "../services/queries";
import { useMutation, useQuery } from "@apollo/client";

interface Recipe {
  id?: string;
  title?: string;
  image_url?: string;
  image?: string;
  instructions?: string;
  ingredients?: string;
  category?: string;
  categories?: string;
  rating?: string;
}

interface RecipeModalProps {
  recipe: Recipe | null;
  visible: boolean;
  onClose: () => void;
  slideAnim: Animated.Value;
  saveBtn: boolean;
  deleteBtn: boolean;
  refetchCategories: () => void;
  refetchRecipes: () => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({
  recipe,
  visible,
  onClose,
  slideAnim,
  saveBtn,
  deleteBtn,
  refetchCategories,
  refetchRecipes,
}) => {
  const [addRecipe, { loading: isSaving }] = useMutation(ADD_RECIPE);
  const [addCategory, { loading: isAddingCategory }] = useMutation(ADD_CATEGORY);
  const [removeRecipe, { loading: isDeleting }] = useMutation(REMOVE_RECIPE);
  const { data: categoriesData } = useQuery(GET_CATEGORIES);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 10,
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 50) {
        Animated.timing(slideAnim, {
          toValue: 1000,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onClose());
      }
    },
  });

  const handleSaveBtn = async () => {
    if (!recipe?.categories) {
      console.error("Categoria não definida.");
      return;
    }

    try {
      const existingCategory = categoriesData?.categories?.find(
        (cat: { name: string }) => cat.name === recipe.categories
      );

      if (!existingCategory) {
        await addCategory({ variables: { name: recipe.categories } });
        refetchCategories();
      }

      await addRecipe({
        variables: {
          title: recipe.title,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          category: recipe.categories,
          image_url: recipe.image_url || recipe.image,
        },
      });

      refetchRecipes();
    } catch (err) {
      console.error("Erro ao adicionar receita:", err);
    } finally {
      onClose();
    }
  };

  const handleDeleteBtn = async () => {
    if (!recipe?.id) {
      console.error("Erro: ID da receita é inválido!");
      return;
    }

    try {
      await removeRecipe({ variables: { id: recipe.id } });
      refetchRecipes();
    } catch (err) {
      console.error("Erro ao deletar a receita:", err);
    } finally {
      onClose();
    }
  };

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}
          {...panResponder.panHandlers}
        >
          <View style={styles.modalBody}>
            <Text style={styles.recipeTitle}>{recipe?.title}</Text>

            {recipe?.image_url || recipe?.image ? (
              <Image
                source={{ uri: recipe.image_url || recipe.image }}
                style={styles.recipeImageLarge}
              />
            ) : null}

            <ScrollView style={styles.scrollContainer}>
              {recipe?.ingredients && <Text style={styles.modalText}>Ingredients: {recipe.ingredients}</Text>}
              {recipe?.category && <Text style={styles.modalText}>Category: {recipe.category}</Text>}
              {recipe?.categories && <Text style={styles.modalText}>Categories: {recipe.categories}</Text>}
              {recipe?.rating && <Text style={styles.modalText}>Rating: {recipe.rating}</Text>}

              {recipe?.instructions && (
                <HTML source={{ html: recipe.instructions }} contentWidth={200} />
              )}
            </ScrollView>
          </View>

          <View style={styles.modalFooter}>
            {isSaving || isAddingCategory || isDeleting ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <>
                {saveBtn && <Button title="Save" onPress={handleSaveBtn} />}
                {deleteBtn && <Button title="Delete" onPress={handleDeleteBtn} />}
                <Button title="Close" onPress={onClose} />
              </>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    width: "90%",
    borderRadius: 10,
    padding: 20,
    minHeight: "75%",
    maxHeight: "85%",
  },
  modalBody: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  recipeImageLarge: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 24,
  },
  scrollContainer: {
    maxHeight: 350,
  },
  modalFooter: {
    marginTop: 10,
    alignItems: "center",
  },
});

export default RecipeModal;
