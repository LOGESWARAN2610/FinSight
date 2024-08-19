import { SafeAreaView, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import Styles from "./Components/Style/Styles";
import SignIn from "./Components/Js/SignIn/SignIn";
import Home from "./Components/Js/Home/Home";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { context } from "./Components/Js/Accessories/Accessories";
import { loadAsync } from "expo-font";
import DashBoard from "./Components/Js/Dashboard/DashBoard";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const Bar = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const screenOptions = {
  headerShown: false,
  tabBarActiveTintColor: Styles["themeColor"]["color"],
};

export default function App() {
  const [contextDetails, setContextDetails] = useState({ Path: "SignIn" });
  const [title, setTitle] = useState("SignIn");
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFont = async () => {
      await loadAsync({
        OpenSansRegular: require("./assets/fonts/OpenSansRegular.ttf"),
        OpenSansBold: require("./assets/fonts/OpenSansBold.ttf"),
        OpenSansItalic: require("./assets/fonts/OpenSans-Italic.ttf"),
        OpenBoldItalic: require("./assets/fonts/OpenSans-BoldItalic.ttf"),
        PlayFair: require("./assets/fonts/Playfair_9pt_SemiCondensed-Regular.ttf"),
        Regular: require("./assets/fonts/Helvetica-Regular.otf"),
      });
      setFontsLoaded(true);
    };
    loadFont();
  }, []);

  return !fontsLoaded ? (
    <></>
  ) : (
    <context.Provider value={{ contextDetails, setContextDetails }}>
      <NavigationContainer>
        <SafeAreaView style={Styles["droidSafeArea"]}>
          {contextDetails["authenticated"] ? (
            <Bar.Navigator
              initialRouteName={contextDetails["Path"]}
              screenOptions={screenOptions}
            >
              <Bar.Screen
                name="DashBoard"
                component={DashBoard}
                options={{
                  tabBarLabel: "DashBoard",
                  tabBarIcon: ({ color, size }) => (
                    <MaterialIcons
                      name="dashboard"
                      color={color}
                      size={size - 5}
                    />
                  ),
                }}
              />
              <Bar.Screen
                name="Home"
                component={Home}
                options={{
                  tabBarLabel: "Expenses",
                  tabBarIcon: ({ color, size }) => (
                    <FontAwesome name="home" color={color} size={size - 5} />
                  ),
                }}
              />
            </Bar.Navigator>
          ) : (
            <Stack.Navigator
              initialRouteName="SignIn"
              screenOptions={screenOptions}
            >
              <Stack.Screen name="SignIn" component={SignIn} />
            </Stack.Navigator>
          )}
        </SafeAreaView>
      </NavigationContainer>
    </context.Provider>
  );
}
