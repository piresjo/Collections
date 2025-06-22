const MISSING_CONSOLE_NAME = {
  success: false,
  message: "Console Needs To Have A Name",
};

const MISSING_CONSOLE_TYPE = {
  success: false,
  message: "console_type Must Be Defined",
};

const MISSING_REGION = {
  success: false,
  message: "region Must Be Defined",
};

const MISSING_PRODUCT_CONDITION = {
  success: false,
  message: "product_condition Must Be Defined",
};

const MISSING_HAS_PACKAGING = {
  success: false,
  message: "has_packaging Must Be Defined",
};

const MISSING_IS_DUPLICATE = {
  success: false,
  message: "is_duplicate Must Be Defined",
};

const MISSING_HAS_CABLES = {
  success: false,
  message: "has_cables Must Be Defined",
};

const MISSING_HAS_CONSOLE = {
  success: false,
  message: "has_console Must Be Defined",
};

const MISSING_GAME_NAME = {
  success: false,
  message: "Game Needs To Have A Name",
};

const MISSING_DIGITAL = {
  success: false,
  message: "digital Must Be Defined",
};

const MISSING_CONSOLE_ID = {
  success: false,
  message: "console_id Must Be Defined",
};
const MISSING_HAS_BOX = {
  success: false,
  message: "has_box Must Be Defined",
};

const MISSING_HAS_MANUAL = {
  success: false,
  message: "has_manual Must Be Defined",
};

const MISSING_HAS_GAME = {
  success: false,
  message: "has_game Must Be Defined",
};

const MISSING_ACCESSORY_NAME = {
  success: false,
  message: "Accessory Needs To Have A Name",
};

const MISSING_ACCESSORY_TYPE = {
  success: false,
  message: "accessory_type Must Be Defined",
};

const GENERATE_500_ERROR_JSON = function (errorJSON) {
  return {
    success: false,
    message: "Unexpected error in backend. Please try again",
    error: errorJSON,
  };
};

const GENERATE_CREATED_JSON = function (itemType, resultsJSON) {
  return {
    success: true,
    message: `${itemType} Created`,
    results: resultsJSON,
  };
};

const GENERATE_GET_JSON = function (resultsJSON) {
  return {
    success: true,
    results: resultsJSON,
  };
};

const GENERATE_GET_NOT_FOUND_JSON = function (itemType) {
  return {
    success: false,
    message: `${itemType} Not Found`,
  };
};

const GENERATE_UPDATE_DELETE_NOT_FOUND_JSON = function (
  itemType,
  idVal,
  isUpdate,
) {
  const verbVal = isUpdate ? "Updated" : "Deleted";
  return {
    success: false,
    message: `${itemType} With id=${idVal} Not Found. Could Not Be ${verbVal}`,
  };
};

const GENERATE_UPDATE_JSON = function (itemType, idVal, resultsJSON) {
  return {
    success: true,
    message: `${itemType} With id=${idVal} Updated`,
    results: resultsJSON,
  };
};

const GENERATE_DELETE_JSON = function (itemType, idVal, resultsJSON) {
  return {
    success: true,
    message: `Successfully deleted ${itemType} with id=${idVal}`,
    results: resultsJSON,
  };
};

module.exports = {
  MISSING_CONSOLE_NAME,
  MISSING_CONSOLE_TYPE,
  MISSING_REGION,
  MISSING_PRODUCT_CONDITION,
  MISSING_HAS_PACKAGING,
  MISSING_IS_DUPLICATE,
  MISSING_HAS_CABLES,
  MISSING_HAS_CONSOLE,
  MISSING_GAME_NAME,
  MISSING_DIGITAL,
  MISSING_CONSOLE_ID,
  MISSING_HAS_BOX,
  MISSING_HAS_MANUAL,
  MISSING_HAS_GAME,
  MISSING_ACCESSORY_NAME,
  MISSING_ACCESSORY_TYPE,
  GENERATE_500_ERROR_JSON,
  GENERATE_CREATED_JSON,
  GENERATE_GET_JSON,
  GENERATE_GET_NOT_FOUND_JSON,
  GENERATE_UPDATE_DELETE_NOT_FOUND_JSON,
  GENERATE_UPDATE_JSON,
  GENERATE_DELETE_JSON,
};
