import React, { useState, useEffect, useRef } from "react";
import { View, FlatList, TouchableOpacity, StyleSheet } from "react-native";
// import { useKeyPress } from "@react-native-community";
import { web } from "./Platform";
import CustomText from "./CustomText";
// import SearchableDropdown from "react-native-searchable-dropdown";
import SelectDropdown from "react-native-select-dropdown";

const SearchDropdown = (props) => {
  let {
    options = [],
    label,
    onSelect = () => {},
    value = "",
    disabled = false,
  } = props;

  const countries = ["Egypt", "Canada", "Australia", "Ireland"];
  const [searchText, setSearchText] = useState("");
  //   const [selectedOption, setSelectedOption] = useState({ label: "" });
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef();
  const flatListRef = useRef(null);
  const [selectedItems, setSelectedItem] = useState({});
  const [filteredOption, setFilteredOption] = useState([]);
  useEffect(() => {
    if (true) {
      let option =
        searchText?.length > 0
          ? options?.filter(
              (item) =>
                item["label"]
                  .toLocaleLowerCase()
                  .indexOf(searchText?.toLocaleLowerCase()) > -1
            )
          : options;
      setFilteredOption(
        (option = option?.sort((a, b) => a["label"].localeCompare(b["label"])))
      );
    }
  }, [searchText]);
  const handleOptionPress = (item) => {
    // setSelectedOption(item);
    onSelect(item);
    setIsFocused(false);
    setSearchText(item["label"]);
    if (web) inputRef.current.value = item["label"]?.trim();
  };

  const handleKeyPress = (event) => {
    let { key, target } = event;
    if (key === "ArrowDown" && highlightedIndex < options.length - 1) {
      setHighlightedIndex((prevIndex) => prevIndex + 1);
    } else if (key === "ArrowUp" && highlightedIndex > 0) {
      setHighlightedIndex((prevIndex) => prevIndex - 1);
    } else if (key === "Enter" && highlightedIndex < options.length) {
      handleOptionPress(filteredOption[highlightedIndex]);
    }
    if (
      ["ArrowDown", "ArrowUp"].indexOf(key) > -1 &&
      highlightedIndex < options.length - 1
    ) {
      flatListRef.current.scrollToItem({
        animated: true,
        item: filteredOption[highlightedIndex],
        viewPosition: 0.5,
      });
    }
  };
  useEffect(() => {
    let item = options.filter((item) => item.value == value);
    if (item.length > 0) {
      setSelectedItem({ id: item["value"], name: item["label"] });
      item = item[0];
      setSearchText(item["label"]);
      if (web) {
        inputRef.current.value = item["label"]?.trim();
      }
      setIsFocused(false);
    }
    if (disabled && web) {
      inputRef.current.style.pointerEvents = "none";
      inputRef.current.style.opacity = 0.8;
    }
  }, [value]);

  return (
    <View style={Styles.container}>
      {web ? (
        <>
          <View
            style={[
              Styles.inputBoxContainer,
              {
                borderColor: "gray",
                width: "100%",
                borderColor: "silver",
                marginBottom: 5,
              },
            ]}
          >
            <CustomText bold={true} style={Styles.inputBoxLabel}>
              {label || ""}
            </CustomText>
            <View
              style={{
                flexDirection: "column",
                width: "97%",
              }}
            >
              <input
                type="text"
                ref={inputRef}
                style={Styles.inputBox}
                placeholder="Search..."
                onKeyUp={handleKeyPress}
                onInput={(event) => {
                  let { key, target } = event;
                  setSearchText(target["value"]);
                  setHighlightedIndex(0);
                  inputRef.current.value = target["value"].trim();
                  setIsFocused(true);
                }}
                onFocus={() => {
                  setIsFocused(true);
                  inputRef.current.setSelectionRange(
                    0,
                    inputRef.current.value.length
                  );
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setIsFocused(false);
                  }, 150);
                }}
              />
            </View>
          </View>
          {isFocused && !disabled && (
            <View
              style={{
                maxHeight: 300,
                marginTop: 0,
                borderWidth: 1,
                borderColor: "silver",
              }}
            >
              <FlatList
                ref={flatListRef}
                data={filteredOption}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={1}
                      style={[
                        Styles.optionItem,
                        highlightedIndex === index && Styles.highlightedOption,
                      ]}
                      onPress={() => handleOptionPress(item)}
                    >
                      <CustomText
                        style={highlightedIndex === index && { color: "#fff" }}
                      >
                        {item["label"]}
                      </CustomText>
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          )}
        </>
      ) : (
        <>
          <View
            style={[
              Styles.inputBoxContainer,
              {
                borderColor: "silver",
              },
            ]}
          >
            <CustomText bold={true} style={Styles.inputBoxLabel}>
              {label || ""}
            </CustomText>
            <View style={{ width: "100%" }}>
              {/* <SearchableDropdown
                  onItemSelect={(item) => {
                    handleOptionPress(item);
                    setSelectedItem(item);
                  }}
                  selectedItems={selectedItems}
                  itemStyle={{
                    padding: 10,
                    borderColor: "#bbb",
                    borderWidth: 1,
                    borderTopWidth: 0,
                  }}
                  defaultIndex={highlightedIndex}
                  resetValue={false}
                  itemTextStyle={{ color: "#222" }}
                  itemsContainerStyle={{ maxHeight: 300 }}
                  items={filteredOption
                    ?.sort((a, b) => a["label"].localeCompare(b["label"]))
                    .map((item) => {
                      return {
                        name: item["label"],
                        id: item["value"],
                      };
                    })}
                  textInputProps={{
                    placeholder: "Search...",
                    underlineColorAndroid: "transparent",
                    style: {
                      paddingHorizontal: 10,
                      paddingVertical: 9,
                      borderWidth: 1,
                      borderColor: "#ccc",
                      borderRadius: 5,
                    },
                    onTextChange: (text) => setSearchText(text),
                  }}
                /> */}
              <SelectDropdown
                search={true}
                disabled={disabled}
                defaultValueByIndex={options.indexOf(
                  options.filter((item) => item.value == value)[0]
                )}
                searchPlaceHolder="Search..."
                dropdownOverlayColor="transparent"
                buttonStyle={{
                  height: 35,
                  // borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 5,
                  width: "100%",
                }}
                buttonTextStyle={{ textAlign: "left", fontSize: 15 }}
                rowTextStyle={{
                  textAlign: "left",
                  fontSize: 15,
                }}
                rowStyle={{ padding: 0, height: 40, backgroundColor: "#fff" }}
                dropdownStyle={{
                  borderColor: "#bbb",
                  borderWidth: 1,
                  borderTopWidth: 0,
                  backgroundColor: "#fff",
                  // height: filteredOption.length * 40 + 42,
                }}
                selectedRowStyle={{
                  backgroundColor: "#2c86d1",
                }}
                selectedRowTextStyle={{ color: "#fff" }}
                searchInputStyle={{
                  height: 40,
                  borderWidth: 1,
                  borderRadius: 5,
                  width: "99%",
                  padding: 5,
                  backgroundColor: "#fff",
                }}
                data={options
                  ?.sort((a, b) => a["label"].localeCompare(b["label"]))
                  .map((item) => item["label"])}
                onSelect={(selectedItem, index) => {
                  handleOptionPress(options[index]);
                }}
                // onChangeSearchInputText={(text) => setSearchText(text)}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
              />
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  optionItem: {
    padding: 8,
    borderBottomColor: "silver",
    borderBottomWidth: 0.5,
  },
  highlightedOption: {
    backgroundColor: "#2c86d1",
  },
  inputBoxContainer: {
    flexDirection: "row",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  inputBoxLabel: {
    position: "absolute",
    backgroundColor: "#fff",
    top: -12,
    left: 3,
    fontSize: 14,
    color: "gray",
    paddingHorizontal: 3,
  },
  inputBox: {
    ...{
      borderWidth: 0,
      borderRadius: 5,
      fontSize: web ? 15 : 16,
      backgroundColor: "rgba(0,0,0,.04)",
      color: "#51575d",
      width: "100%",
      padding: 5,
      height: 25,
    },
  },
});

export default SearchDropdown;
