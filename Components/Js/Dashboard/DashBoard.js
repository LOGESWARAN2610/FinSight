import { RefreshControl, ScrollView, Text, View } from "react-native";
import {
  formatIndRs,
  generateBoxShadowStyle,
  getCurrentWeekDates,
  getFirstAndLastDateOfMonth,
  getPastMonthsArray,
  getTotalAmount,
  getWeekNumber,
  getWeeksArray,
  handleAPI,
} from "../Accessories/CommonFunction";
import Styles from "../../Style/Styles";
import Dropdown from "../Accessories/DropDown";
import { BarChart } from "react-native-gifted-charts";
import { Fragment, useCallback, useEffect, useState } from "react";
import { deviceDimensions } from "../Accessories/Accessories";
import moment from "moment";

const pastMonthArray = getPastMonthsArray(),
  weeksArray = [{ label: "All", value: 0 }, ...getWeeksArray()];

const TotalSummary = ({ amountDetails }) => {
  return (
    <View style={{ flexDirection: "row" }}>
      <View
        style={{
          paddingVertical: 25,
          paddingHorizontal: 20,
          borderRadius: 15,
          marginVertical: 20,
          backgroundColor: Styles.themeColor.color,
          flex: 1,
          borderWidth: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          ...generateBoxShadowStyle(0, 3, "#fff", 0.3, 5, 5, "#fff"),
        }}
      >
        {amountDetails.map((data, index) => {
          return (
            <Fragment key={index}>
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{ color: "#fff", fontSize: 11, fontWeight: "bold" }}
                >
                  {data["title"]}
                </Text>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 20,
                    marginTop: 10,
                    fontWeight: "bold",
                  }}
                >
                  ₹{formatIndRs(data["amount"])}
                </Text>
              </View>
              {index + 1 !== amountDetails.length && (
                <View
                  style={{
                    borderRightWidth: 1,
                    borderRightColor: "#fff",
                    marginVertical: 10,
                  }}
                ></View>
              )}
            </Fragment>
          );
        })}
      </View>
    </View>
  );
};

const Analytic = ({
  viewMode,
  viewValue,
  viewMonth,
  handleInputDetails = () => {},
  data = [],
  weeklyDailyOptions = {},
  xAxisLabel = null,
}) => {
  return (
    <>
      <View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 22,
              color: Styles.themeColor.color,
            }}
          >
            Analytic
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Dropdown
              shadow={false}
              fontSize={11}
              style={{ paddingVertical: 0, width: 80 }}
              options={pastMonthArray}
              placeholder="Select"
              valueObj={viewMonth}
              onChange={(value) => {
                handleInputDetails({ name: "viewMonth", value });
              }}
            />
            <Dropdown
              fontSize={11}
              shadow={false}
              style={{ paddingVertical: 0, width: 90 }}
              options={[
                { label: "Weekly", value: 2 },
                { label: "Daily", value: 1 },
              ]}
              placeholder="Select"
              valueObj={viewMode}
              onChange={(value) => {
                handleInputDetails({ name: "viewMode", value });
              }}
            />
            <Dropdown
              fontSize={11}
              shadow={false}
              style={{ paddingVertical: 0, width: 80 }}
              options={weeklyDailyOptions}
              placeholder="Select"
              valueObj={viewValue}
              onChange={(value) => {
                handleInputDetails({ name: "viewValue", value });
              }}
            />
          </View>
        </View>
        <View
          style={{
            borderWidth: 1,
            marginVertical: 10,
            borderRadius: 10,
            borderColor: "#d1d1d161",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={{ marginHorizontal: 5, alignSelf: "center" }}>₹</Text>
            <BarChart
              width={deviceDimensions["deviceWidth"] - 95}
              barWidth={22}
              noOfSections={3}
              barBorderRadius={4}
              frontColor="lightgray"
              hideRules
              data={data}
              yAxisThickness={0}
              xAxisThickness={0}
              showGradient
              gradientColor={Styles.themeColor.color}
              isAnimated
            />
          </View>
          {xAxisLabel && (
            <Text style={{ marginVertical: 5, textAlign: "center" }}>
              {xAxisLabel}
            </Text>
          )}
        </View>
      </View>
    </>
  );
};

const TransactionCard = ({ transactionArray = [] }) => {
  return (
    <>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 22,
          color: Styles.themeColor.color,
        }}
      >
        Transactions
      </Text>
      {transactionArray.map(({ title, dateTime, amount }, index) => {
        return (
          <View
            key={index}
            style={{
              backgroundColor: "#fafafa",
              paddingHorizontal: 20,
              paddingVertical: 15,
              borderRadius: 10,
              marginTop: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              borderColor: "#d1d1d161",
              borderWidth: 1,
            }}
          >
            <View>
              <Text style={{ fontSize: 16 }}>{title}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  marginBottom: 5,
                  color: "green",
                }}
              >
                ₹{formatIndRs(amount)}
              </Text>
              <Text style={{ fontSize: 11 }}>{dateTime}</Text>
            </View>
          </View>
        );
      })}
    </>
  );
};

const DashBoard = (props) => {
  const transactionArray = [
    { title: "Office Supplies", dateTime: "Mar 2024", amount: 500 },
    { title: "Internet Bill", dateTime: "Mar 2024", amount: 1200 },
    { title: "Electricity Bill", dateTime: "Mar 2024", amount: 800 },
    { title: "Office Rent", dateTime: "Mar 2024", amount: 3000 },
    { title: "Maintenance", dateTime: "Mar 2024", amount: 600 },
  ];
  const [chartData, setChartData] = useState([]);
  const [inputDetails, setInputDetails] = useState({
      viewMonth: pastMonthArray[0],
      viewMode: { label: "Weekly", value: 2 },
      viewValue: { label: "All", value: 0 },
    }),
    [totalSummaryDetails, setTotalSummaryDetails] = useState([]);

  useEffect(() => {
    handleGetTotalSummaryDetails();
  }, [props]);

  const handleGetTotalSummaryDetails = async () => {
    const { endDate: wEndDate, startDate: wStartDate } = getCurrentWeekDates(),
      { endDate: mEndDate, startDate: mStartDate } =
        getFirstAndLastDateOfMonth(),
      toDayDetails = await handleAPI("getPaymentDetails", {
        date: moment(new Date()).format("DD/MM/YYYY"),
      }),
      weekDetails = await handleAPI("getPaymentDetailsForDates", {
        sDate: moment(wStartDate).format("YYYY-MM-DD"),
        eDate: moment(wEndDate).format("YYYY-MM-DD"),
      }),
      monthDetails = await handleAPI("getPaymentDetailsForDates", {
        sDate: moment(mStartDate).format("YYYY-MM-DD"),
        eDate: moment(mEndDate).format("YYYY-MM-DD"),
      });

    setChartData(
      monthDetails["data"].map(({ date, amount }, index) => ({
        label: index,
        date,
        value: amount,
      }))
    );

    setTotalSummaryDetails([
      {
        title: "Today",
        amount: getTotalAmount(toDayDetails["data"] || []) || 0,
      },
      {
        title: "This Week",
        amount: getTotalAmount(weekDetails["data"] || []) || 0,
      },
      {
        title: "This Month",
        amount: getTotalAmount(monthDetails["data"] || []) || 0,
      },
    ]);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };

  const handleInputDetails = ({ name, value }) => {
    setInputDetails((prevInputDetails) => {
      return { ...prevInputDetails, [name]: value };
    });
  };

  const [weeklyDailyOptions, setWeeklyDailyOptions] = useState(
    weeksArray || []
  );

  const filterDataBetweenDates = (data, startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const filteredData = data.filter((item) => {
      const date = new Date(item.date);
      return date >= start && date <= end;
    });

    return filteredData;
  };

  const filterDataWeekWise = (chartData, weeksArray) => {
    return weeksArray.slice(1).map(({ startDate, endDate }, index) => {
      const weekData = filterDataBetweenDates(chartData, startDate, endDate);
      return {
        label: index + 1,
        value: weekData.reduce((total, obj) => Number(obj.value) + total, 0),
      };
    });
  };

  useEffect(() => {
    let options = weeksArray || [];
    const { value: viewModeValue } = inputDetails["viewMode"];
    if (viewModeValue === 1) {
      options = [{ label: "All", value: 0 }, ...chartData];
    }
    setWeeklyDailyOptions(options);
    handleInputDetails({
      name: "viewValue",
      value: { label: "All", value: 0 },
    });
  }, [inputDetails["viewMode"]]);

  useEffect(() => {
    let iChartData = chartData;
    const {
        value: viewValueValue,
        startDate = "",
        endDate = "",
      } = inputDetails["viewValue"],
      { value: viewModeValue } = inputDetails["viewMode"];

    if (viewModeValue === 2) {
      if (viewValueValue !== 0)
        iChartData = filterDataBetweenDates(chartData, startDate, endDate);
      else iChartData = filterDataWeekWise(chartData, weeksArray);
    }
    setChartData(iChartData);
  }, [inputDetails]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    handleGetTotalSummaryDetails();
  }, []);

  return (
    <View style={{ paddingHorizontal: 20, backgroundColor: "#fff", flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <TotalSummary amountDetails={totalSummaryDetails} />
        <Analytic
          data={chartData}
          viewMonth={inputDetails["viewMonth"]}
          viewMode={inputDetails["viewMode"]}
          viewValue={inputDetails["viewValue"]}
          weeklyDailyOptions={weeklyDailyOptions}
          handleInputDetails={handleInputDetails}
          xAxisLabel={
            inputDetails["viewMode"]["value"] === 2
              ? inputDetails["viewValue"]["value"] === 0
                ? "Week"
                : "Day"
              : inputDetails["viewMode"]["value"] === 1
              ? inputDetails["viewValue"]["value"] === 0
                ? "Day"
                : " "
              : ""
          }
        />
        <TransactionCard
          transactionArray={transactionArray}
          handleInputDetails={handleInputDetails}
        />
      </ScrollView>
    </View>
  );
};

export default DashBoard;
