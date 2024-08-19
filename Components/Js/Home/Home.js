import React, {
  useState,
  useContext,
  Fragment,
  useEffect,
  useCallback,
} from "react";
import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  Alert,
  LayoutAnimation,
  ScrollView,
  RefreshControl,
} from "react-native";
import {
  Button,
  Divider,
  DrawerView,
  InputBox,
  TextLink,
  context,
  scanDocument,
} from "../Accessories/Accessories";
import {
  formatIndRs,
  generateBoxShadowStyle,
  handleAPI,
  handleSetStoredCredential,
} from "../Accessories/CommonFunction";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Moment from "moment";
import Styles from "../../Style/Styles";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import moment from "moment";

const Home = (props) => {
  const { navigation } = props;
  const { contextDetails, setContextDetails } = useContext(context);
  const [dateDetails, setDateDetails] = useState({
    isVisible: false,
    date: new Date(),
  });
  const [newPaymentDetails, setNewPaymentDateDetails] = useState({
    isVisible: false,
    amount: 0.0,
    purpose: null,
    invoice: [],
    paidBy: null,
    invoiceFiles: [],
  });
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    handleGetPaymentDetails();
  }, []);

  useEffect(() => {
    handleGetPaymentDetails();
  }, [dateDetails["date"]]);

  const handleGetPaymentDetails = async () => {
    const { date } = dateDetails;
    if (date) {
      const result = await handleAPI("getPaymentDetails", {
        date: moment(date).format("DD/MM/YYYY"),
      });

      setPaymentDetails(result["data"]);
      setTimeout(() => {
        setRefreshing(false);
      }, 500);
    }
  };
  const handleLogOut = (isClear) => {
    isClear && handleSetStoredCredential(isClear, "logInDetails");
    navigation.navigate("SignIn");
    setContextDetails({});
  };
  const handleConfirm = (iDate) => {
    setDateDetails({ ...{ date: iDate, isVisible: false } });
  };
  const handleToggleDatePicker = () => {
    setDateDetails({ ...{ isVisible: !dateDetails["isVisible"] } });
  };
  const handleAddPayment = async (isUpdate) => {
    try {
      let iPaymentDetails = paymentDetails,
        {
          amount,
          purpose,
          invoice = [],
          paidBy,
          invoiceFiles = [],
          index = null,
          _id,
        } = newPaymentDetails,
        invoiceDetails = await handleAPI("storeInvoice", {
          file: invoiceFiles,
        }),
        payment = {
          amount,
          purpose,
          invoice: [...(invoice || []), ...(invoiceDetails["data"] || [])],
          paidBy,
          date: new Date(dateDetails["date"]),
          _id,
        };

      if (index)
        iPaymentDetails[index] = { ...iPaymentDetails[index], ...payment };
      else iPaymentDetails = [...iPaymentDetails, payment];

      setPaymentDetails([...iPaymentDetails]);

      setNewPaymentDateDetails({
        ...newPaymentDetails,
        ...{
          purpose: null,
          invoice: null,
          paidBy: null,
          amount: null,
          isVisible: false,
          invoiceFiles: [],
        },
      });

      handleAPI(isUpdate ? "UpdatePayment" : "addPayment", {
        ...payment,
      }).then(function (response) {});
    } catch (error) {
      console.error(error);
    }
  };
  const onChangeText = ({ name, value }) => {
    setNewPaymentDateDetails({ ...newPaymentDetails, [name]: value });
  };
  const handleInvoiceUpload = async (isScan) => {
    const file = await scanDocument(isScan);

    if (file) {
      setNewPaymentDateDetails((prevNewPaymentDetails) => {
        try {
          const { invoiceFiles = [] } = prevNewPaymentDetails;
          return {
            ...prevNewPaymentDetails,
            invoiceFiles: [...invoiceFiles, ...file],
          };
        } catch (error) {
          console.error("Error form setNewPaymentDateDetails ====> ", error);
          return prevNewPaymentDetails;
        }
      });
    }
  };

  return (
    <>
      <View
        style={{
          ...Styles.loginContainer,
          ...{ marginHorizontal: 10, top: 0, flex: 1 },
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={{
            padding: 10,
            backgroundColor: Styles.themeColor.color,
            paddingHorizontal: 10,
            marginVertical: 10,
            borderRadius: 5,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
          onPress={handleToggleDatePicker}
        >
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                fontWeight: "bold",
                color: "#fff",
                fontSize: 16,
                alignSelf: "center",
              }}
            >
              {/* Payment  */}
              Date :{" "}
            </Text>
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                fontSize: 16,
                alignSelf: "center",
              }}
            >
              {Moment(dateDetails["date"]?.toString()).format("DD/MM/YYYY") ||
                ""}
              {"  "}
              <AntDesign
                name="calendar"
                size={18}
                // color={Styles.themeColor.color}
              />
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              setNewPaymentDateDetails({
                ...newPaymentDetails,
                isVisible: true,
              })
            }
            style={[
              Styles.addPaymentBtn,
              {
                paddingRight: 10,
                borderTopWidth: 5,
                borderTopColor: "red",
                borderRadius: 5,
              },
            ]}
          >
            <>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 12,
                  paddingLeft: 10,
                  paddingRight: 5,
                }}
              >
                Add Payment
              </Text>
              <Entypo
                name="circle-with-plus"
                size={16}
                color={Styles.themeColor.color}
              />
            </>
          </TouchableOpacity>
        </TouchableOpacity>

        <View
          style={{
            borderTopWidth: 1,
            borderColor: "#999",
          }}
        ></View>
        {paymentDetails.length > 0 ? (
          <>
            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  paddingBottom: 5,
                  color: Styles.themeColor.color,
                }}
              >
                Today's Expenses
              </Text>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              {paymentDetails.map((payment, index) => {
                const {
                  purpose,
                  amount,
                  paidBy,
                  isViewInvoice = false,
                  invoice = [],
                } = payment;
                return (
                  <View
                    key={index}
                    style={{
                      backgroundColor: "#fafafa",
                      paddingHorizontal: 20,
                      paddingVertical: 10,
                      borderRadius: 10,
                      marginTop: 10,
                      justifyContent: "space-between",
                      borderColor: "#d1d1d161",
                      borderWidth: 1,
                      flexDirection: "row",
                    }}
                  >
                    <View style={{ flex: 2 }}>
                      <Text style={{ fontSize: 16 }}>{purpose}</Text>
                      {isViewInvoice && (
                        <View
                          style={{
                            marginTop: 10,
                            flexDirection: "row",
                            flexWrap: "wrap",
                            gap: 5,
                          }}
                        >
                          {invoice.map((file, index) => {
                            return (
                              <Text
                                onPress={() => {}}
                                key={index}
                                style={{
                                  fontSize: 9,
                                  textAlign: "center",
                                  paddingHorizontal: 6,
                                  paddingVertical: 3,
                                  borderWidth: 1,
                                  borderRadius: 8,
                                }}
                              >
                                {file}
                              </Text>
                            );
                          })}
                        </View>
                      )}
                      <View style={{ flexDirection: "row", marginTop: 10 }}>
                        {invoice?.length && (
                          <>
                            <TextLink
                              onPress={() => {
                                setTimeout(() => {
                                  setPaymentDetails((prevPaymentDetails) => {
                                    prevPaymentDetails[index]["isViewInvoice"] =
                                      !isViewInvoice;
                                    return [...prevPaymentDetails];
                                  });
                                }, 100);
                              }}
                              style={{
                                fontSize: 11,
                              }}
                              text={
                                isViewInvoice ? (
                                  <>
                                    Hide Invoice{" "}
                                    <Entypo name="chevron-up" size={12} />
                                  </>
                                ) : (
                                  <>
                                    View Invoice{" "}
                                    <Entypo name="chevron-down" size={12} />
                                  </>
                                )
                              }
                            />

                            <Divider />
                          </>
                        )}

                        <TextLink
                          style={{
                            fontSize: 11,
                          }}
                          text={
                            <>
                              Add Invoice{" "}
                              <Entypo
                                name="circle-with-plus"
                                size={10}
                                color={Styles.themeColor.color}
                              />
                            </>
                          }
                          onPress={() => {
                            setNewPaymentDateDetails({
                              ...payment,
                              isVisible: true,
                              isUpdate: true,
                              index,
                            });
                          }}
                        />
                      </View>
                    </View>
                    <View style={{ alignItems: "flex-end", flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "bold",
                          color: "green",
                        }}
                      >
                        ₹{formatIndRs(amount)}
                      </Text>
                      <Text style={{ fontSize: 11, marginTop: 10 }}>
                        Paid By:{" "}
                        <Text style={{ fontWeight: "bold" }}>{paidBy}</Text>
                      </Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </>
        ) : (
          <View
            style={{
              width: "100%",
            }}
          >
            <View
              style={{
                margin: 25,
                borderRadius: 5,
                padding: 5,
                backgroundColor: "#f5dade",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 13 }}>No Payment's found</Text>
            </View>
          </View>
        )}
      </View>
      <DateTimePickerModal
        isVisible={dateDetails["isVisible"]}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={handleToggleDatePicker}
      />

      <DrawerView
        isShow={newPaymentDetails?.["isVisible"] || false}
        onClose={() => {
          setNewPaymentDateDetails({
            isVisible: false,
            amount: 0.0,
            purpose: null,
            invoice: [],
            paidBy: null,
          });
        }}
        headerText={
          <Text
            style={{ paddingHorizontal: 15, fontSize: 16, fontWeight: "bold" }}
          >
            {newPaymentDetails?.isUpdate ? "Update " : "Add New "}
            Payment
          </Text>
        }
        body={
          <View style={Styles.modalBody}>
            <InputBox
              label="Purpose"
              placeholder="Purpose"
              name="purpose"
              disable={newPaymentDetails?.isUpdate}
              onBlur={() => {}}
              onChangeText={onChangeText}
              value={newPaymentDetails["purpose"]}
            />
            <InputBox
              label="Amount (₹)"
              placeholder="0.00"
              disable={newPaymentDetails?.isUpdate}
              name="amount"
              onBlur={() => {}}
              onChangeText={onChangeText}
              value={newPaymentDetails["amount"]}
            />
            <InputBox
              label="Paid By"
              placeholder="Paid By"
              disable={newPaymentDetails?.isUpdate}
              name="paidBy"
              onBlur={() => {}}
              onChangeText={onChangeText}
              value={newPaymentDetails["paidBy"]}
            />
            <View
              style={{
                marginTop: 10,
                marginBottom: 10,
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 5,
              }}
            >
              {newPaymentDetails["invoice"]?.map((file, index) => {
                return (
                  <Text
                    onPress={() => {}}
                    key={index}
                    style={{
                      fontSize: 9,
                      textAlign: "center",
                      paddingHorizontal: 6,
                      paddingVertical: 3,
                      borderWidth: 1,
                      borderRadius: 8,
                    }}
                  >
                    {file}
                  </Text>
                );
              })}
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <Button
                title="Scan Invoice"
                icon={<AntDesign name="scan1" size={16} color="#fff" />}
                onPress={() => {
                  handleInvoiceUpload(false);
                }}
                style={{
                  borderRadius: 25,
                  paddingVertical: 8,
                  paddingHorizontal: 10,
                  ...generateBoxShadowStyle(0, 3, "black", 0.3, 5, 5, "black"),
                }}
                textStyle={{ fontSize: 11, paddingLeft: 5 }}
              />
              <Button
                title="Upload Invoice"
                icon={<Entypo name="circle-with-plus" size={16} color="#fff" />}
                onPress={() => {
                  handleInvoiceUpload(true);
                }}
                style={{
                  borderRadius: 25,
                  paddingVertical: 8,
                  paddingHorizontal: 10,
                  ...generateBoxShadowStyle(0, 3, "black", 0.3, 5, 5, "black"),
                }}
                textStyle={{ fontSize: 11, paddingLeft: 5 }}
              />
            </View>
          </View>
        }
        footer={
          <View style={Styles.modalFooter}>
            <TouchableOpacity
              activeOpacity={1}
              style={[
                Styles.addPaymentBtn,
                {
                  margin: 10,
                  borderTopWidth: 5,
                  borderTopColor: Styles.themeColor.color,
                  borderRadius: 5,
                },
              ]}
              onPress={() => handleAddPayment(newPaymentDetails?.isUpdate)}
            >
              <>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 12,
                    paddingHorizontal: 20,
                  }}
                >
                  {newPaymentDetails?.isUpdate ? "Update" : "Save"}
                </Text>
              </>
            </TouchableOpacity>
          </View>
        }
      />
    </>
  );
};

export default Home;
