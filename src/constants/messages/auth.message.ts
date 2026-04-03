export const AUTH_MESSAGE = {
  REGISTER: {
    SUCCESS:
      "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản",
    USER_EXISTED: "Tài khoản đã tồn tại trong hệ thống",
    NOT_EXIST: "Tài khoản không tồn tại",
    INVALID: "Email hoặc mật khẩu không đúng",
    BLOCKED: "Tài khoản đã bị khóa",
  },
  LOGIN: {
    SUCCESS: "Đăng nhập thành công",
    ERROR: "Login không thành công, vui lòng thử lại",
    INVALID_TOKEN: "Token không hợp lệ",
  },
  LOG_OUT: {
    SUCCESS: "Đăng xuất thành công",
    ERROR: "Đăng xuất thất bại, vui lòng thử lại sau",
  },
  REFRESH: {
    NOT_TOKEN_EXISTED: "Không tìm thấy refresh token",
    INVALID_SESSION: "Phiên đăng nhập không hợp lệ! Vui lòng đăng nhập lại",
    EXPIRED_SESSION: "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại",
  },
  FORGOT: {
    NOT_EXISTED: "Tài khoản không tồn tại trong hệ thống",
  },
  RESET: {
    INVALID_TOKEN: "Token không hợp lệ",
    TOKEN_EXPIRED: "Token đã hết hạn, vui lòng gửi lại email",
  },
};
