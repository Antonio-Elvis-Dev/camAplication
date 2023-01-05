import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";

import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";

import { FontAwesome } from "@expo/vector-icons";

import { Camera } from "expo-camera";
export default function App() {
  const camRef = useRef(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      // setHasPermission(status === "granted");
      console.log(status);
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text> Acesso negado!! </Text>;
  }

  async function takePicture() {
    if (camRef) {
      const data = await camRef.current.takePictureAsync();
      setCapturedPhoto(data.uri);
      setOpen(true);
    }
  }

  async function savePicture() {
    const asset = await MediaLibrary.createAssetAsync(capturedPhoto)
      .then(() => {
        alert("Salvo");
      })
      .catch((error) => {
        console.log("err", error);
      });
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Camera style={styles.cameraStyle} type={type} ref={camRef}>
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            style={{ position: "absolute", bottom: 20, left: 20 }}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <Text style={{ fontSize: 20, color: "#fff", marginBottom: 13 }}>
              Trocar
            </Text>
          </TouchableOpacity>
        </View>
      </Camera>
      <TouchableOpacity style={styles.button} onPress={takePicture}>
        <FontAwesome name="camera" size={50} color="#fff" />
      </TouchableOpacity>

      {capturedPhoto && (
        <Modal animationType="slide" transparent={false} visible={open}>
          <View style={styles.modal}>
            <View style={styles.buttomModal}>
              <TouchableOpacity
                style={{ margin: 10 }}
                onPress={() => setOpen(false)}
              >
                <FontAwesome name="window-close" size={50} color="#ff0f25" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ margin: 10 }}
                onPress={savePicture}
              >
                <FontAwesome name="upload" size={50} color="#121212" />
              </TouchableOpacity>
            </View>
            <Image
              style={{ width: "100%", height: 450, borderRadius: 20 }}
              source={{ uri: capturedPhoto }}
            />
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  cameraStyle: {
    flex: 1,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#121212",
    margin: 20,
    borderRadius: 10,
    height: 70,
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 40,
  },
  buttomModal: {
    flexDirection: "row",
    alignItems: "baseline",
  },
});
