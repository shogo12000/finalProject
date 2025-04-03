import { useCameraPermissions } from "expo-camera";
import Camera from "../../components/camera/Camera";
import { useState, useEffect } from "react";
import AddCookForm from "../../components/AddCookForm";
import { Button, StyleSheet, Text, View } from "react-native";

export default function AddCook() {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraActive, setCameraActive] = useState(false);
  const [photoUri, setPhotoUri] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {cameraActive ? (
        <Camera
          setPhotoName={setPhotoName}
          setCameraActive={setCameraActive}
          setPhotoUri={setPhotoUri}
        />
      ) : (
        <>
          <AddCookForm
            photoName={photoName}
            photoUri={photoUri}
            setPhotoUri={setPhotoUri}
            title={title}
            setTitle={setTitle}
            ingredients={ingredients}
            setIngredients={setIngredients}
            instructions={instructions}
            setInstructions={setInstructions}
            category={category}
            setCategory={setCategory}
          />
          <Button title="Take Food Photo" onPress={() => setCameraActive(true)} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 80,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
 
});
