import React, { useEffect, useState, useContext, useRef } from "react";
import {
  View,
  Image,
  ScrollView,
  Dimensions,
  Text,
  StyleSheet,
} from "react-native";
// import Text from "../Accessories/Text";
import Styles from "../../Style/Styles";
import {
  Button,
  Divider,
  InputBox,
  Separator,
  TextLink,
  context,
} from "../Accessories/Accessories";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {
  generateBoxShadowStyle,
  handleAPI,
  handleGetStoredCredential,
  handleSetStoredCredential,
} from "../Accessories/CommonFunction";
import SocketTest from "./SocketTest";

const { log, error } = console,
  width = Dimensions.get("window").width - 20;

const Title = ({ text = "" }) => {
  return <Text style={Styles.title}>{text}</Text>;
};

const FooterContent = ({ leftContent = <></>, rightContent = <></> }) => {
  return (
    <>
      <Separator />
      <View
        style={{
          justifyContent: "flex-end",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignSelf: "center" }}>
          {leftContent}
        </View>
        {rightContent}
      </View>
      <Separator />
    </>
  );
};

const LogInPage = (props) => {
  const { navigation } = props;
  const { contextDetails, setContextDetails } = useContext(context); //Get value from context
  const [userDetails, setUserDetails] = useState({
    staySignedIn: true,
    autoDirect: false,
  });
  const [errors, setErrors] = useState({});
  const scrollViewRef = useRef(null),
    [index, setIndex] = useState(0);

  const [passwordType, setPasswordType] = useState(true);

  const [welcomeHeader] = useState([
    "Hello Again",
    "Welcome Again",
    "Welcome Back, Friend",
    "Back to the FinSight",
    "Welcome Back, [Name]",
    "Reconnecting with FinSight",
    "Welcome Back to FinSight",
    "It's Good to Have You Back",
    "Back and Ready to Go",
    "Ready for Next Round",
    "You're Back!",
    "Familiar Faces Return",
    "Returning to FinSight",
    "Back in the Swing of Things",
    "Welcome Back, Explorer",
  ]);
  const [headerText, setHeaderText] = useState("");

  const handleSliderPage = (event) => {
    const { x } = event.nativeEvent.contentOffset,
      indexOfNextScreen = Math.round(x / width);

    setIndex(indexOfNextScreen);
  };
  useEffect(() => {
    scrollViewRef.current.scrollTo({
      animated: true,
      x: width * index,
      y: 0,
    });
  }, [index]);

  const handleClearState = () => {
    setUserDetails({
      staySignedIn: true,
      autoDirect: false,
      userName: "LogesNew@abt.com",
      password: "Cool@111",
    });
    setIndex(0);
  };
  useEffect(() => {
    const prePare = async () => {
      setHeaderText(
        "Sign In Now!" ||
          `${welcomeHeader[
            Math.floor(Math.random() * welcomeHeader["length"])
          ].replace("[Name]", userDetails["Name"])}...`
      );
      const iUserDetails = await handleGetStoredCredential(
        "logInDetails",
        userDetails
      );
      handleNextAction(iUserDetails);
    };
    prePare();
  }, []);

  const handleChangeText = ({ name, value }) => {
    setUserDetails({ ...userDetails, [name]: value });
  };
  const handleNextAction = (iUserDetails) => {
    if (iUserDetails) {
      setContextDetails((prevContentDetails) => {
        return { ...prevContentDetails, ...iUserDetails };
      });
      setUserDetails((prevUserDetails) => {
        return { ...prevUserDetails, ...iUserDetails };
      });
    }
    if (iUserDetails["autoDirect"]) {
      // navigation.navigate("DashBoard"); //Home
      setContextDetails((prevContentDetails) => {
        return { ...prevContentDetails, Path: "Home" };
      });
      handleClearState();
    }
  };
  const handleSavePassword = () => {
    const {
      newPassword = null,
      confirmPassword = undefined,
      emailId,
    } = userDetails;
    if (newPassword === confirmPassword) {
      handleAPI("updatePassword", {
        newPassword,
        emailId,
      }).then(function (response) {
        const { status } = response["data"];
        log(status);
        handleNextAction({ autoDirect: true });
      });
    } else {
      error("Password not matching.");
    }
  };
  const handleResendOTP = (directIndex = null) => {
    const { userName: emailId = "" } = userDetails;
    handleAPI("resendOTP", {
      emailId,
    }).then(function (response) {
      const { OTP } = response.data;
      setUserDetails((prevUserDetails) => {
        return { ...prevUserDetails, OTP };
      });

      directIndex && setIndex(directIndex);

      log("Resent OTP Successfully.", " ===> ", OTP);
    });
  };
  const handleValidateOTP = () => {
    const { OTP = null, enteredOTP = undefined } = userDetails;
    if (OTP == enteredOTP) {
      setIndex(3);
    } else {
      error("Invalid OTP");
    }
  };
  const handleRegister = () => {
    const {
      firstName = "",
      lastName = "",
      phoneNumber = "",
      userName: emailId = "",
    } = userDetails;
    handleAPI("signUp", {
      firstName,
      lastName,
      phoneNumber,
      emailId,
    }).then(function (response) {
      const { OTP } = response.data;
      setUserDetails((prevUserDetails) => {
        return { ...prevUserDetails, OTP };
      });
      setIndex(2);
    });
  };
  const handleSubmit = () => {
    // Your handleSubmit logic
    const { userName: emailId = "", password = "" } = userDetails;
    //
    handleAPI("signIn", {
      emailId,
      password,
    })
      .then(function (response) {
        // const {
        //     firstName = "",
        //     lastName = "",
        //     emailId: userName = "",
        //   } = response.data,
        //   Name = `${firstName} ${lastName}`.trim();
        setContextDetails((prevContextDetails) => {
          return { ...prevContextDetails, authenticated: true };
        });
        const Name = "LogesNew",
          userName = "LogesNew@abt.com";
        if (userName) {
          let iUserDetails = {
            ...userDetails,
            Name,
            userName,
            autoDirect: true,
          };
          handleSetStoredCredential(false, "logInDetails", iUserDetails);
          handleNextAction(iUserDetails);
        } else {
          log("not exist");
        }
      })
      .catch((error) => error("Error from signIn ===> ", error));
  };

  con = () => {
    setPasswordType(!passwordType);
  };

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <SocketTest />
      <View style={[Styles.loginContainer]}>
        <View style={Styles.loginTitleContainer}>
          <Image
            source={require("../../../assets/AB-Logo.png")}
            alt="AB Logo"
            style={{ width: 50, height: 50 }}
          />
          <Text
            style={{
              color: Styles.themeColor.color,
              fontSize: 25,
              marginVertical: 10,
              fontWeight: "bold",
            }}
          >
            Analytic Brains
          </Text>
        </View>
        <ScrollView
          horizontal={true}
          scrollEventThrottle={100}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          // onMomentumScrollEnd={handleSliderPage}
          ref={scrollViewRef}
          scrollEnabled={false}
        >
          <View style={iStyles["containerWindow"]}>
            <Title text={headerText} />
            <View
              style={
                userDetails["autoDirect"]
                  ? { opacity: 0.1, borderWidth: 0.3 }
                  : {}
              }
            >
              <>
                <InputBox
                  isValid={false}
                  label="User Name"
                  autoFocus={true}
                  placeholder="username@analyticbrains.com"
                  name="userName"
                  onBlur={() => {}}
                  onChangeText={(item) => {
                    handleChangeText(item);
                  }}
                  value={userDetails["userName"]}
                />
                <InputBox
                  isValid={false}
                  label="Password"
                  placeholder="Password"
                  name="password"
                  onBlur={() => {}}
                  onChangeText={handleChangeText}
                  value={userDetails["password"]}
                  secureTextEntry={passwordType}
                />
              </>
              <FooterContent
                leftContent={
                  <>
                    <TextLink
                      text="Lost Password?"
                      onPress={() => setIndex(4)}
                    />
                    <Divider />
                    <TextLink text="Register?" onPress={() => setIndex(1)} />
                  </>
                }
                rightContent={
                  <Button
                    title="Sign In"
                    icon={
                      <>
                        <FontAwesome
                          name="arrow-circle-o-right"
                          size={14}
                          color="#fff"
                        />
                      </>
                    }
                    onPress={handleSubmit}
                    style={{
                      borderRadius: 25,
                      paddingVertical: 8,
                      ...generateBoxShadowStyle(
                        0,
                        3,
                        "black",
                        0.3,
                        5,
                        5,
                        "black"
                      ),
                    }}
                    textStyle={{ fontSize: 11 }}
                  />
                }
              />
            </View>
          </View>

          <View style={iStyles["containerWindow"]}>
            <Title text="Sign Up Now" />
            <>
              <InputBox
                label="First Name"
                placeholder="First Name"
                name="firstName"
                autoFocus={true}
                onBlur={() => {}}
                onChangeText={handleChangeText}
                value={userDetails["firstName"]}
              />
              <InputBox
                label="Last Name"
                placeholder="Last Name"
                name="lastName"
                onBlur={() => {}}
                onChangeText={handleChangeText}
                value={userDetails["lastName"]}
              />
              <InputBox
                label="Phone Number"
                placeholder="XXXXX XXXXX"
                name="phoneNumber"
                type="numeric"
                onBlur={() => {}}
                onChangeText={handleChangeText}
                value={userDetails["phoneNumber"]}
              />
              <InputBox
                label="Email Id"
                placeholder="name@analyticbrains.com"
                name="emailId"
                onBlur={() => {}}
                onChangeText={handleChangeText}
                value={userDetails["emailId"]}
              />
            </>
            <FooterContent
              leftContent={
                <>
                  <TextLink text="Sign In?" onPress={() => setIndex(0)} />
                </>
              }
              rightContent={
                <>
                  <Button
                    title="Register"
                    icon={
                      <>
                        <FontAwesome
                          name="arrow-circle-o-right"
                          size={14}
                          color="#fff"
                        />
                      </>
                    }
                    onPress={handleRegister}
                    style={{
                      borderRadius: 25,
                      paddingVertical: 8,
                      ...generateBoxShadowStyle(
                        0,
                        3,
                        "black",
                        0.3,
                        5,
                        5,
                        "black"
                      ),
                    }}
                    textStyle={{ fontSize: 11 }}
                  />
                </>
              }
            />
          </View>

          <View style={iStyles["containerWindow"]}>
            <Title text="One Time Password" />
            <>
              <InputBox
                label="OTP"
                placeholder="XXXXXX"
                name="enteredOTP"
                type="numeric"
                onBlur={() => {}}
                onChangeText={handleChangeText}
                value={userDetails["enteredOTP"]}
              />
            </>
            <FooterContent
              leftContent={
                <>
                  <TextLink text="Resend OTP" onPress={handleResendOTP} />
                </>
              }
              rightContent={
                <>
                  <Button
                    title="Validate OTP"
                    icon={
                      <>
                        <FontAwesome
                          name="arrow-circle-o-right"
                          size={14}
                          color="#fff"
                        />
                      </>
                    }
                    onPress={handleValidateOTP}
                    style={{
                      borderRadius: 25,
                      paddingVertical: 8,
                      ...generateBoxShadowStyle(
                        0,
                        3,
                        "black",
                        0.3,
                        5,
                        5,
                        "black"
                      ),
                    }}
                    textStyle={{ fontSize: 11 }}
                  />
                </>
              }
            />
          </View>

          <View style={iStyles["containerWindow"]}>
            <Title text="Set Account Password" />
            <>
              <InputBox
                label="Password"
                placeholder="Enter your Password"
                name="newPassword"
                onBlur={() => {}}
                secureTextEntry={true}
                onChangeText={handleChangeText}
                value={userDetails["newPassword"]}
              />
              <InputBox
                label="Confirm Password"
                placeholder="Confirm Password"
                name="confirmPassword"
                onBlur={() => {}}
                secureTextEntry={true}
                onChangeText={handleChangeText}
                value={userDetails["confirmPassword"]}
              />
            </>
            <FooterContent
              rightContent={
                <>
                  <Button
                    title="Save"
                    icon={
                      <>
                        <FontAwesome
                          name="arrow-circle-o-right"
                          size={14}
                          color="#fff"
                        />
                      </>
                    }
                    onPress={handleSavePassword}
                    style={{
                      borderRadius: 25,
                      paddingVertical: 8,
                      ...generateBoxShadowStyle(
                        0,
                        3,
                        "black",
                        0.3,
                        5,
                        5,
                        "black"
                      ),
                    }}
                    textStyle={{ fontSize: 11 }}
                  />
                </>
              }
            />
          </View>

          <View style={iStyles["containerWindow"]}>
            <Title text="Recover Your Password here" />
            <>
              <InputBox
                label="User Name"
                autoFocus={true}
                placeholder="username@analyticbrains.com"
                name="userName"
                onBlur={() => {}}
                onChangeText={(item) => {
                  handleChangeText(item);
                }}
                value={userDetails["userName"]}
              />
            </>
            <FooterContent
              leftContent={
                <>
                  <TextLink text="Sign In?" onPress={() => setIndex(0)} />
                  <Divider />
                  <TextLink text="Register?" onPress={() => setIndex(1)} />
                </>
              }
              rightContent={
                <>
                  <Button
                    title="Send OTP"
                    icon={
                      <>
                        <FontAwesome
                          name="arrow-circle-o-right"
                          size={14}
                          color="#fff"
                        />
                      </>
                    }
                    onPress={() => handleResendOTP(2)}
                    style={{
                      borderRadius: 25,
                      paddingVertical: 8,
                      ...generateBoxShadowStyle(
                        0,
                        3,
                        "black",
                        0.3,
                        5,
                        5,
                        "black"
                      ),
                    }}
                    textStyle={{ fontSize: 11 }}
                  />
                </>
              }
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const iStyles = StyleSheet.create({
  containerWindow: {
    marginVertical: 10,
    paddingHorizontal: 30,
    minWidth: width,
  },
});

export default LogInPage;
