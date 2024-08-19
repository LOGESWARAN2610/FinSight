import * as React from "react";
import { Text, View, Button } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { WebView } from "react-native-webview";

export default function SocketTest() {
  const sendMessageToServer = async () => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      console.log("Connected to the server");
      socket.send("dsadasdasdasdas!");
    };

    socket.onmessage = (event) => {
      console.log("Message from server:", event.data);
    };

    socket.onclose = () => {
      console.log("Connection closed");
    };
  };
  React.useEffect(() => {
    sendMessageToServer();
  }, []);

  return <></>;
}
