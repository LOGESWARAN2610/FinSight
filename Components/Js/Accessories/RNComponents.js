let Pdf; //, Share;
if (!__DEV__) {
  Pdf = require("react-native-pdf").default; //Don't Change the line - 3
  Share = require("react-native-share").default; //Don't Change the line - 4
}
import { Dimensions } from "react-native";
import * as FileSystem from "expo-file-system";

const PDFViewer = ({ url }) => {
  return (
    <>
      {Pdf ? (
        <Pdf
          trustAllCerts={false}
          source={{
            uri: url,
            cache: true,
          }}
          onLoadComplete={(numberOfPages, filePath) => {
            // log(`PDFViewer-Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            // log(`PDFViewer-Current page: ${page}`);
          }}
          onError={(error) => {
            // log("PDFViewer-Error", JSON.stringify(error));
          }}
          onPressLink={(uri) => {
            // log(`PDFViewer-Link pressed: ${uri}`);
          }}
          style={{
            flex: 1,
            width: Dimensions.get("window").width - 10,
            height: Dimensions.get("window").height,
            borderWidth: 1,
            borderColor: "#999",
            borderRadius: 5,
          }}
        />
      ) : (
        <></>
      )}
    </>
  );
};
const shareContent = async (documentUri, callBack = () => {}) => {
  if (documentUri) {
    try {
      const { uri } = await FileSystem.downloadAsync(
          documentUri,
          FileSystem.documentDirectory + documentUri.split("/").pop() ||
            "Document.pdf"
        ),
        shareOptions = {
          title: "Share via",
          message: "Share the document to",
          url: uri,
        };
      Share.open(shareOptions);
      callBack("success");
    } catch (error) {
      console.error("Error while sharing:", error);
    }
  }
};

export { PDFViewer, shareContent };
