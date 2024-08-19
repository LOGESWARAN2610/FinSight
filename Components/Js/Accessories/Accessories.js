import React, { useState, createContext, useLayoutEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import CustomTextInput from "./CustomTextInput";
import { WebView } from "react-native-webview";
// import { REDIRECT_URL } from "@env";
import { android, web } from "./Platform";
import Styles from "../../Style/Styles";
import useKeyboardHeight from "./KeyboardHeight";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {
  requestCameraPermissionsAsync,
  launchImageLibraryAsync,
  MediaTypeOptions,
} from "expo-image-picker";
import DocumentScanner from "react-native-document-scanner-plugin";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window"),
  deviceDimensions = { deviceWidth, deviceHeight };

const Separator = () => <View style={Styles.separator} />;
//======================================================
const Button = ({
  onPress,
  title,
  style = {},
  textStyle = {},
  icon = null,
}) => (
  <TouchableOpacity
    activeOpacity={1}
    onPress={onPress}
    style={[Styles.buttonContainer, style]}
  >
    <Text style={[Styles.buttonText, textStyle, { fontWeight: "bold" }]}>
      {title}
    </Text>
    {icon && (
      <Text style={{ marginLeft: 10, alignSelf: "center" }}>{icon}</Text>
    )}
  </TouchableOpacity>
);
//======================================================
const InputBox = (props) => {
  const {
    value,
    type,
    placeholder,
    ref,
    secureTextEntry,
    onKeyPress = () => {},
    isValid = false,
  } = props;
  return (
    <View style={[Styles.inputBoxContainer]}>
      <CustomTextInput
        secureTextEntry={secureTextEntry || false}
        value={value || ""}
        placeholder={placeholder || ""}
        keyboardType={type || "default"}
        style={[
          Styles.inputBox,
          isValid && { borderWidth: 1, borderColor: "red" },
        ]}
        autoCapitalize={"none"}
        ref={ref || null}
        {...props}
        onKeyPress={onKeyPress}
      />
    </View>
  );
};
//======================================================
const WebPageView = (props) => {
  let { url } = props;

  if (web) {
    url = url
      .replace("https://www.directcorp.com/", "../../../")
      .replace("https://www.solutioncenter.biz/", "../../../")
      .replace("http://www.solutioncenter.biz/", "../../../");
  } else {
    url = url.replace("../../../", REDIRECT_URL || "");
  }

  if (web) {
    return (
      <iframe
        src={url}
        style={[{ width: "100%", border: "none" }, props["style"] || {}]}
      />
    );
  }
  return (
    <>
      <WebView
        javaScriptEnabled={true}
        source={{ uri: url }}
        style={{
          flex: 1,
        }}
      />
    </>
  );
};
//======================================================
const context = createContext();
//======================================================
const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
};
//======================================================
const DrawerView = (props) => {
  const {
      isShow = false,
      headerText = <></>,
      body = <></>,
      onClose = () => {},
      bodyStyle = {},
      footer = <></>,
    } = props,
    keyboardHeight = useKeyboardHeight() || 0,
    isMobileWeb = Dimensions.get("window").width <= 480;

  return (
    <Modal visible={isShow} transparent animationType="slide">
      <TouchableOpacity
        activeOpacity={1}
        style={[
          {
            height: "100%",
            flex: 1,
            backgroundColor: "#535252a3",
          },
          web
            ? {
                width: isMobileWeb ? "100%" : 750,
                right: 0,
                position: "absolute",
                height: "100%",
              }
            : {},
        ]}
        onPress={() => onClose()}
      ></TouchableOpacity>
      <View
        style={[
          {
            backgroundColor: "#fff",
            zIndex: 2,
            width: "99%",
            // borderColor: "#d3dadf",
            // borderWidth: 2,
            borderRadius: 5,
            // boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
            alignSelf: "center",
            justifyContent: "center",
            position: "absolute",
            bottom: android ? 0 : keyboardHeight,
            overflow: "hidden",
          },
        ]}
      >
        <View>
          <TouchableOpacity
            style={Styles.modalHeader}
            activeOpacity={1}
            onPress={onClose}
          >
            {headerText}
            <FontAwesome
              name={"close"}
              size={20}
              style={{
                color: "red",
                marginBottom: 0,
                marginRight: 5,
              }}
            />
          </TouchableOpacity>
          <View
            style={[
              {
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderBottomWidth: 1.5,
                maxHeight:
                  Dimensions.get("window").height - (keyboardHeight + 150),
                borderBottomColor: "#f5f5f5",
              },
              bodyStyle,
            ]}
          >
            <ScrollView showsVerticalScrollIndicator={false}>{body}</ScrollView>
            {footer}
          </View>
        </View>
      </View>
    </Modal>
  );
};
//======================================================
const scanDocument = async (isPickFile) => {
  try {
    const { status } = await requestCameraPermissionsAsync();
    let result;
    if (status !== "granted") {
      console.error("Sorry, we need camera permissions to make this work!");
    } else {
      if (isPickFile) {
        result = await launchImageLibraryAsync({
          mediaTypes: MediaTypeOptions.All,
          allowsEditing: true,
          quality: 1,
          base64: true,
        });
        result = result["assets"];
      } else {
        try {
          const { scannedImages } = await DocumentScanner.scanDocument({
            maxNumDocuments: 1,
          });
          if (scannedImages?.length > 0) {
            result = scannedImages.map((uri) => ({
              uri: uri,
            }));
          }
        } catch (error) {
          Alert.alert("Error form DocumentScanner", error.message);
        }
      }
    }
    return result;
  } catch (error) {
    Alert.alert("Error form requestCameraPermissionsAsync", error.message);
    return null;
  }
};
//======================================================
const Divider = () => {
  return (
    <Text
      style={{
        color: Styles.themeColor.color,
        fontSize: 12,
        marginHorizontal: 5,
        alignSelf: "center",
        fontWeight: "bold",
      }}
    >
      |
    </Text>
  );
};
//======================================================
const TextLink = ({ text, onPress = () => {}, style = {} }) => {
  return (
    <Text
      style={{
        ...{
          color: Styles.themeColor.color,
          fontSize: 12,
          alignSelf: "center",
          fontWeight: "bold",
        },
        ...style,
      }}
      onPress={onPress}
    >
      {text}
    </Text>
  );
};
//======================================================

export {
  Separator,
  Button,
  Divider,
  InputBox,
  TextLink,
  WebPageView,
  context,
  useWindowSize,
  deviceDimensions,
  DrawerView,
  scanDocument,
};
