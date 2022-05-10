const gateway = [120101, 120102, 120103, 120104];
const common = [403];
const main = [
  1301005, 1301006, 1301004, 1605001, 1605002, 1605003, 1605004, 1604006,
];
export const errorcode_login = [...gateway, ...common, ...main];

export const verifyError_switch = (error_code, error_msg) => {
  switch (error_code) {
    case 1304010:
      return alert(`超出區間限制! 請選擇1-365日內`);
    case 1306008:
      return alert(`"名稱"不能為空白!`);
    case 1301009:
      return null;
    case 100109:
      return alert(`請填寫"系統商帳號"名稱!`);
    case 1310004:
      return alert(`查無此帳號!`);
    default:
      return alert(error_msg);
  }
};
