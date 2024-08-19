import { StyleSheet, Platform, StatusBar } from "react-native";
import { android, web } from "../Js/Accessories/Platform";
import { generateBoxShadowStyle } from "../Js/Accessories/CommonFunction";

const themeColor = {
    color: "#2b3586", //"#5049f0", //"#0589a0",
  },
  shadow = {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 8,
  },
  Styles = {
    droidSafeArea: {
      flex: 1,
      backgroundColor: "#fff",
      paddingTop: android ? StatusBar.currentHeight + 5 : 0,
      justifyContent: "center",
    },

    loginContainer: {
      top: 50,
      padding: 10,
      // marginHorizontal: 30,
      borderRadius: 5,
      backgroundColor: "white",
      // margin: 10,
      maxWidth: 485,
    },
    loginTitleContainer: {
      marginBottom: 10,
      alignItems: "center",
      borderBottomWidth: 0.5,
      borderBlockColor: "#999",
      paddingBottom: 10,
      marginHorizontal: 30,
    },
    title: {
      fontSize: 18,
      color: themeColor["color"], //"#999",
      marginBottom: 10,
      fontWeight: "bold",
    },
    inputBoxContainer: {
      maxWidth: 450,
      flexDirection: "column",
      marginVertical: 10,
    },
    inputBoxLabel: {
      fontSize: 13,
      color: themeColor.color,
      marginBottom: 3,
    },
    inputBox: {
      height: 45,
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 5,
      backgroundColor: "#fff",
      // borderWidth: 0.2,
      // borderColor: "#999",
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 3, height: 3 },
      shadowRadius: 5,
      shadowOpacity: 0.1,
      ...generateBoxShadowStyle(0, 3, "black", 0.1, 5, 5, "black"),
    },

    spinnerContainer: {
      flex: 1,
      justifyContent: "center",
      textAlign: "center",
      paddingTop: 30,
      padding: 8,
      height: "100%",
    },
    spinnerTextStyle: {
      top: "49%",
      left: "52%",
      position: "absolute",
    },
    separator: {
      marginVertical: 12,
    },
    buttonContainer: {
      backgroundColor: themeColor.color,
      borderRadius: 5,
      paddingVertical: 10,
      paddingHorizontal: 20,
      flexDirection: "row",
      alignSelf: "center",
    },
    buttonText: {
      fontSize: 18,
      color: "#fff",
      alignSelf: "center",
    },
    themeColor: themeColor,
    tableWrapperHeader: {
      ...{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 15,
        borderRadius: 3,
      },
      ...shadow,
      ...{
        shadowOpacity: 0.5,
      },
    },
    tableHeader: {
      color: themeColor.color,
      width: "32%",
      textAlign: "center",
    },
    tableWrapperBody: {
      ...{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        // borderColor: "#999",
        // borderWidth: 1,
        // borderRadius: 3,
      },
      ...shadow,
      ...{
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
      },
    },
    tableRow: {
      width: "32%",
      textAlign: "center",
    },
    addPaymentBtn: {
      ...{
        flexDirection: "row",
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius: 25,
        alignSelf: "flex-end",
      },
      ...shadow,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#999",
      borderTopWidth: 8,
      borderTopColor: themeColor.color,
      overflow: "hidden",
      borderRadius: 5,
    },
    modalBody: { width: "98%", alignSelf: "center", paddingBottom: 10 },
    modalText: {
      marginBottom: 15,
      textAlign: "center",
    },
    modalFooter: {
      marginTop: 10,
      borderTopWidth: 1,
      borderTopColor: "#999",
      width: "100%",
    },
  };
export default StyleSheet.create(Styles);
