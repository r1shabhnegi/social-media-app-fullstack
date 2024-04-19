export const EXPRESS_VALIDATION = 751;

// AUTH_CONTROLLER
export const AUTH_USER_NOT_FOUND = 800; //404
export const AUTH_INVALID_PW = 801; //401
export const AUTH_COOKIE_MISSING = 802; //403

// COMMUNITY_CONTROLLER
export const COM_COOKIE_MISSING = 902; //403
export const COM_ALREADY_EXISTS = 903; //403
export const COM_INVALID_RF_TOKEN = 905; //401
export const COM_INVALID_AC_TOKEN = 906; //403
export const COM_NOT_FOUND = 901; //404
export const COM_NOT_JOINED = 907; //403
export const COM_IMG_NOT_UPLOADED = 908; //403
export const COM_NOT_ALLOW_TO_EDIT = 909; //403
export const COM_ERROR_DELETE_COMMUNITY = 911; //401

// USER_CONTROLLER
export const USER_ALREADY_EXISTS = 701; //403
export const USER_ERROR_REGISTERING = 702; //404

// REFRESH_CONTROLLER
export const RF_COOKIE_MISSING = 881; //403
export const RF_INVALID_USER = 882; //401
export const RF_INVALID_RF_TOKEN = 883; //401

// POST_CONTROLLER
export const POST_COMMUNITY_NOT_EXIST = 871; //401
export const POST_NOT_CREATED = 872; //401
export const POST_NOT_FOUND = 873; //404
