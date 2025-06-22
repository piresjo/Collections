export const MISSING_CONSOLE_NAME = {
  success: false,
  message: "Console Needs To Have A Name",
};

export const MISSING_CONSOLE_TYPE = {
  success: false,
  message: "console_type Must Be Defined",
};

export const MISSING_REGION = {
  success: false,
  message: "region Must Be Defined",
};

export const MISSING_PRODUCT_CONDITION = {
  success: false,
  message: "product_condition Must Be Defined",
};

export const MISSING_HAS_PACKAGING = {
  success: false,
  message: "has_packaging Must Be Defined",
};

export const MISSING_IS_DUPLICATE = {
  success: false,
  message: "is_duplicate Must Be Defined",
};

export const MISSING_HAS_CABLES = {
  success: false,
  message: "has_cables Must Be Defined",
};

export const MISSING_HAS_CONSOLE = {
  success: false,
  message: "has_console Must Be Defined",
};

export const MISSING_GAME_NAME = {
  success: false,
  message: "Game Needs To Have A Name",
};

export const MISSING_DIGITAL = {
  success: false,
  message: "digital Must Be Defined",
};

export const MISSING_CONSOLE_ID = {
  success: false,
  message: "console_id Must Be Defined",
};
export const MISSING_HAS_BOX = {
  success: false,
  message: "has_box Must Be Defined",
};

export const MISSING_HAS_MANUAL = {
  success: false,
  message: "has_manual Must Be Defined",
};

export const MISSING_HAS_GAME = {
  success: false,
  message: "has_game Must Be Defined",
};

export const MISSING_ACCESSORY_NAME = {
  success: false,
  message: "Accessory Needs To Have A Name",
};

export const MISSING_ACCESSORY_TYPE = {
  success: false,
  message: "accessory_type Must Be Defined",
};

export const GENERATE_500_ERROR_JSON = function (errorJSON) {
  return {
    success: false,
    message: "Unexpected error in backend. Please try again",
    error: errorJSON,
  };
};

export const GENERATE_CREATED_JSON = function (itemType, resultsJSON) {
  return {
    success: true,
    message: `${itemType} Created`,
    results: resultsJSON,
  };
};

export const GENERATE_GET_JSON = function (resultsJSON) {
  return {
    success: true,
    results: resultsJSON,
  };
};

export const GENERATE_GET_NOT_FOUND_JSON = function (itemType) {
  return {
    success: false,
    message: `${itemType} Not Found`,
  };
};

export const GENERATE_UPDATE_DELETE_NOT_FOUND_JSON = function (
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

export const GENERATE_UPDATE_JSON = function (itemType, idVal, resultsJSON) {
  return {
    success: true,
    message: `${itemType} With id=${idVal} Updated`,
    results: resultsJSON,
  };
};

export const GENERATE_DELETE_JSON = function (itemType, idVal, resultsJSON) {
  return {
    success: true,
    message: `Successfully deleted ${itemType} with id=${idVal}`,
    results: resultsJSON,
  };
};
