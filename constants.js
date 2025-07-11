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
    message: `Successfully Deleted ${itemType} With Id=${idVal}`,
    results: resultsJSON,
  };
};

export const ConsoleType = Object.freeze({
  HOME: 1,
  COMPUTER: 2,
  HANDHELD: 3,
  HYBRID: 4,
  FPGA_HOME: 5,
  FPGA_HANDHELD: 6,
  DEDICATED: 7,
});

export const DERIVE_CONSOLE_TYPE = function (consoleTypeString) {
  switch (consoleTypeString) {
    case "home":
      return ConsoleType.HOME;
    case "computer":
      return ConsoleType.COMPUTER;
    case "handheld":
      return ConsoleType.HANDHELD;
    case "hybrid":
      return ConsoleType.HYBRID;
    case "fpga home":
      return ConsoleType.FPGA_HOME;
    case "fpga handheld":
      return ConsoleType.FPGA_HANDHELD;
    case "dedicated":
      return ConsoleType.DEDICATED;
    default:
      return null;
  }
};

export const Region = Object.freeze({
  NTSC: 1,
  INTL: 2,
  PAL: 3,
  US: 4,
  NTSC_J: 5,
});

export const DERIVE_REGION = function (regionString) {
  switch (regionString) {
    case "NTSC":
      return Region.NTSC;
    case "INTL":
      return Region.INTL;
    case "PAL":
      return Region.PAL;
    case "US":
      return Region.US;
    case "NTSC-J":
      return Region.NTSC_J;
    default:
      return null;
  }
};

export const ProductCondition = Object.freeze({
  NEW: 1,
  VERY_GOOD: 2,
  GOOD: 3,
  FAIR: 4,
  OKAY: 5,
  POOR: 6,
});

export const DERIVE_PRODUCT_CONDITION = function (productConditionString) {
  switch (productConditionString) {
    case "new":
      return ProductCondition.NEW;
    case "very good":
      return ProductCondition.VERY_GOOD;
    case "good":
      return ProductCondition.GOOD;
    case "fair":
      return ProductCondition.FAIR;
    case "okay":
      return ProductCondition.OKAY;
    case "poor":
      return ProductCondition.POOR;
    default:
      return null;
  }
};

export const VALIDATE_CONSOLE_ENTRY_JSON = function (bodyVal) {
  var returnVal = null;
  if (bodyVal.name == null) {
    return MISSING_CONSOLE_NAME;
  }
  if (bodyVal.console_type == null) {
    return MISSING_CONSOLE_TYPE;
  }
  if (bodyVal.region == null) {
    return MISSING_REGION;
  }
  if (bodyVal.product_condition == null) {
    return MISSING_PRODUCT_CONDITION;
  }
  if (bodyVal.has_packaging == null) {
    return MISSING_HAS_PACKAGING;
  }
  if (bodyVal.is_duplicate == null) {
    return MISSING_IS_DUPLICATE;
  }
  if (bodyVal.has_cables == null) {
    return MISSING_HAS_CABLES;
  }
  if (bodyVal.has_console == null) {
    return MISSING_HAS_CONSOLE;
  }
  return returnVal;
};

export const VALIDATE_GAME_ENTRY_JSON = function (bodyVal) {
  var returnVal = null;
  if (bodyVal.name == null) {
    return MISSING_GAME_NAME;
  }
  if (bodyVal.console_id == null) {
    return MISSING_CONSOLE_ID;
  }
  if (bodyVal.digital == null) {
    return MISSING_DIGITAL;
  }
  if (bodyVal.region == null) {
    return MISSING_REGION;
  }
  if (bodyVal.product_condition == null) {
    return MISSING_PRODUCT_CONDITION;
  }
  if (bodyVal.has_box == null) {
    return MISSING_HAS_BOX;
  }
  if (bodyVal.is_duplicate == null) {
    return MISSING_IS_DUPLICATE;
  }
  if (bodyVal.has_manual == null) {
    return MISSING_HAS_MANUAL;
  }
  if (bodyVal.has_game == null) {
    return MISSING_HAS_GAME;
  }
  return returnVal;
};

export const ConsolesAndIds = {
  "atari 2600": 1,
  "atari 7800": 2,
  "atari 8-bit": 3,
  "ms-dos": 4,
  "windows 9x": 5,
  "windows nt (x86)": 6,
  "windows nt (x64)": 7,
  "commodore amiga 500": 8,
  "sega master system": 9,
  "sega genesis": 10,
  "sega game gear": 11,
  "nintendo entertainment system": 12,
  "nintendo game boy": 13,
  "super nintendo entertainment system": 14,
  "nintendo 64": 15,
  "nintendo gamecube": 16,
  "nintendo game boy advance": 17,
  "nintendo ds": 18,
  "nintendo wii": 19,
  "nintendo wii u": 20,
  "nintendo 3ds xl": 21,
  "nintendo switch": 22,
  "sony playstation": 23,
  "sony playstation 2": 24,
  "sony playstation 3": 25,
  "sony playstation 4": 26,
  "microsoft xbox 360": 27,
  "analogue super nt": 28,
  "analogue mega sg": 29,
  "analogue pocket": 30,
};

export const VALIDATE_ACCESSORY_ENTRY_JSON = function (bodyVal) {
  var returnVal = null;
  if (bodyVal.name == null) {
    return MISSING_ACCESSORY_NAME;
  }
  if (bodyVal.console_id == null) {
    return MISSING_CONSOLE_ID;
  }
  if (bodyVal.accessory_type == null) {
    return MISSING_ACCESSORY_TYPE;
  }
  if (bodyVal.product_condition == null) {
    return MISSING_PRODUCT_CONDITION;
  }
  if (bodyVal.has_packaging == null) {
    return MISSING_HAS_PACKAGING;
  }
  return returnVal;
};

export const AccessoryType = Object.freeze({
  CONTROLLER: 1,
});

export const DERIVE_ACCESSORY_TYPE = function (accessoryTypeString) {
  switch (accessoryTypeString) {
    case "controller":
      return ProductCondition.NEW;
    default:
      return null;
  }
};
