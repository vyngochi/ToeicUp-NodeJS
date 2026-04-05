export const AUTH_MESSAGE = {
  REGISTER: {
    SUCCESS:
      "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản",
    USER_EXISTED: "Tài khoản đã tồn tại trong hệ thống",
    NOT_EXIST: "Tài khoản không tồn tại",
    INVALID: "Email hoặc mật khẩu không đúng",
    BLOCKED:
      "Tài khoản của bạn đã bị khóa, vui lòng liên hệ admin để biết thêm thông tin",
  },
  LOGIN: {
    SUCCESS: "Đăng nhập thành công",
    ERROR: "Login không thành công, vui lòng thử lại",
    INVALID_TOKEN: "Token không hợp lệ",
    REMIND:
      "Chúng tôi đã gửi email xác thực tài khoản đến bạn. Vui lòng xác thực email để đăng nhập",
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
    NOT_VERIFIED: "Vui lòng xác thực tài khoản để đổi mật khẩu",
    BLOCKED:
      "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ admin để biết thêm thông tin",
  },
  RESET: {
    INVALID_TOKEN: "Token không hợp lệ",
    TOKEN_EXPIRED: "Token đã hết hạn, vui lòng gửi lại email",
  },
  VERIFY: {
    SUCCESS: "Tài khoản đã được xác thực",
  },
  SET_PASSWORD: {
    INVALID_TOKEN: "Token không hợp lệ, vui lòng thử lại",
    NOT_TOKEN: "Token không tồn tại, vui lòng thử lại",
    TOKEN_EXPIRED: "Token đã hết hạn, vui lòng đăng nhập lại",
    SUCCESS: "Mật khẩu được thêm thành công",
    MAIL: "Tài khoản được đăng ký bằng Google, chúng tôi đã gửi email đặt mật khẩu cho tài khoản của bạn",
  },
};
