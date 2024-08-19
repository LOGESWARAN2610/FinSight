import React, { useContext, useEffect } from "react";
import { View, BackHandler, Dimensions, TouchableOpacity } from "react-native";
import WebView from "react-native-webview";
import { context } from "./Accessories/";
import CustomText from "./CustomText";
import Icon from "react-native-vector-icons/FontAwesome";
import { ios, web } from "./Platform";
import { REDIRECT_URL } from "@env";

const { height, width } = Dimensions.get("window");

const ExternalSourceViewer = (props) => {
  const { route, children, onBack } = props,
    { contextDetails, setContextDetails } = useContext(context), //Get value from context
    { navigation = props.navigation, SessionId = "" } = contextDetails,
    { params = {} } = route || {},
    { backTo, GoToNav } = params,
    isNeedBack = params.isNeedBack || props.isNeedBack;
  let url = params.url || props.url || "";

  if (!web || window.location.host === "localhost:19006") {
    url = url.replace("../../../", REDIRECT_URL);
  }

  const handleBackAction = () => {
    onBack
      ? onBack()
      : navigation.navigate(backTo, {
          GoToNav: GoToNav || 0,
        });
    return true;
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackAction
    );
    return () => backHandler.remove();
  }, []);

  return (
    <>
      <View style={{ flex: 1, flexDirection: "column" }}>
        {isNeedBack && (
          <TouchableOpacity activeOpacity={1} onPress={handleBackAction}>
            <CustomText
              bold={true}
              style={{ paddingVertical: 10, paddingHorizontal: 10 }}
            >
              <Icon name="angle-left" size={16} /> Back
            </CustomText>
          </TouchableOpacity>
        )}
        <>
          {children ? (
            <>{children}</>
          ) : !web ? (
            <WebView
              javaScriptEnabled={true}
              originWhitelist={["*"]}
              source={{
                uri: ios
                  ? url
                  : url.indexOf(".pdf") > -1
                  ? `http://docs.google.com/gview?embedded=true&url=${url}`
                  : url,
              }}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: "#888",
                marginHorizontal: 5,
              }}
            />
          ) : (
            <iframe src={url} style={{ border: "none", height: "92vh" }} />
          )}
        </>
      </View>
    </>
  );
};

export default ExternalSourceViewer;
