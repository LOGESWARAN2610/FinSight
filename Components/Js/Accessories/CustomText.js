import { Text } from "react-native";

import { web } from "./Platform";

export default function CustomText(props) {
  let { children, style = {}, bold, onPress, italic, PlayFair } = props;
  try {
    if (!style["color"]) style["color"] = "#3b3c41";
  } catch (error) {
    style = (style || []).reduce((result, obj) => {
      return { ...result, ...obj };
    }, {});
    if (!style["color"]) style["color"] = "#3b3c41";
  }
  let fontFamily = "OpenSansRegular",
    webStyle = {};
  if (bold) fontFamily = "OpenSansBold";
  if (italic) fontFamily = "OpenSansItalic";
  if (bold && italic) fontFamily = "OpenBoldItalic";
  if (PlayFair) fontFamily = "PlayFair";

  if (web) {
    fontFamily = `"Helvetica Neue",Helvetica,Arial,sans-serif`;
    if (bold) webStyle["fontWeight"] = "bold";
    if (italic) webStyle["fontStyle"] = "italic";
    if (PlayFair) {
      fontFamily = "'Open Sans'";
      webStyle["fontSize"] = "14px";
    }
  }

  bold = bold ? bold : false;

  return (
    <Text
      {...props}
      style={[style, webStyle, { fontFamily: fontFamily }]}
      onPress={onPress || null}
    >
      {children}
    </Text>
  );
}
