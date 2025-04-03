import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import { useEffect, useRef, useState } from "react";
import uuid from "react-native-uuid";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddCook({ setCameraActive, setPhotoName, setPhotoUri }) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  async function takePicture() {
    if (!cameraRef.current) {
      console.log("Camera not initialized correctly");
      return;
    }

    try {
      const uniqueId = uuid.v4();
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: false,
      });

      const directory = FileSystem.documentDirectory + "photos/";
      const dirInfo = await FileSystem.getInfoAsync(directory);

      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
      }

      const filePath = `${directory}photo_${uniqueId}.jpg`;
      await FileSystem.moveAsync({
        from: photo.uri,
        to: filePath,
      });

      setPhotoName(`photo_${uniqueId}.jpg`);
      setPhotoUri(filePath);
      setCameraActive(false);
    } catch (err) {
      console.error("Error taking photo:", err);
    }
  }

  return (
    <CameraView style={styles.camera} facing="back" ref={cameraRef}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setCameraActive(false)}>
          <Text style={styles.text}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={takePicture}>
          <Text style={styles.text}>Take Photo</Text>
        </TouchableOpacity>
      </View>
    </CameraView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});