import axios from "axios";
import { TOKEN } from "./configs/index";
import { API_URL } from "./configs/APIUrl";
import fetchFunc from "./Utils/useFetchData";
import get from "lodash/get";
import { errorcode_login, verifyError_switch } from "src/constants/errorcode";
import noop from "lodash";

const verifyError_code = (error_code) => {
  return errorcode_login.includes(error_code);
};
let isCancel = false;
axios.defaults.withCredentials = true;
axios.interceptors.request.use(
  (config) => {
    config.headers.Token = TOKEN;
    config.headers.Authorization = `Bearer ${localStorage.getItem(
      "authorization"
    )}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  (res) => {
    const error_code = get(res, ["data", "error_code"]);
    const error_msg = get(res, ["data", "error_msg"]);
    if (error_code !== 1 && !isCancel && !verifyError_code(error_code)) {
      verifyError_switch(error_code, error_msg);
    }
    return res;
  },
  (error) => {
    alert(error);
    return error;
  }
);
// api func return {isLoading , fetchApiFunc, fetchData}
const fetchDataFunc = ({ url, params }) => {
  return fetchFunc({
    params,
    fetchDataFunction({ resolve }) {
      axios({ url, params }).then((res) => {
        resolve(get(res, ["data", "result"]));
      });
    },
  });
};
export const resolveFunc = ({
  res: { result, error_code, error_msg },
  resolve = noop,
  reject = noop,
}) => {
  if (error_code === 1) {
    resolve(result);
  } else {
    reject();
  }
};
const errorFetch = (error) => {
  alert(error);
  console.error(error);
};
// 會員中心登入驗證
// ------------------------------------------------------------------------------------------------------------------
export const apiAdminUser_info = () =>
  fetchDataFunc({ url: `${API_URL}/backend/admin/user_info` });

export const apiPutLogout = () =>
  axios
    .put(`${API_URL}/logout`)
    .then((res) => {
      const preview = res.data;
      const SUCCESS = preview.error_msg === "SUCCESS";
      if (SUCCESS) {
        localStorage.setItem("authorization", "");
        localStorage.setItem("isLogin", "false");
        window.location.reload();
      }
    })
    .catch((error) => errorFetch(error));

// get
// ------------------------------------------------------------------------------------------------------------------
// menu
export const apiGetMeunList = () =>
  fetchDataFunc({ url: `${API_URL}/backend/menu/list` });
// 反饋統計
export const apiAnalysis = (params) =>
  fetchDataFunc({ url: `${API_URL}/backend/feedback/analysis`, params });
// 反饋封存清單
export const apiArchiveList = (params) =>
  fetchDataFunc({ url: `${API_URL}/backend/feedback/deleted/list`, params });
// 反饋清單
export const apiFeedbackList = (params) =>
  fetchDataFunc({ url: `${API_URL}/backend/feedback/list`, params });
// 取標籤列表
export const apiTagList = () =>
  fetchDataFunc({ url: `${API_URL}/backend/tag/list` });
// 取得帳號清單
export const apiGetAdminList = () =>
  fetchDataFunc({ url: `${API_URL}/backend/admin/admin_list` });
// 帳號權限限制列表
export const apiGetLimitList = () =>
  fetchDataFunc({ url: `${API_URL}/backend/admin/limit_list` });
// 取得遊戲完整列表
export const apiGetGameList = () =>
  fetchDataFunc({ url: `${API_URL}/backend/game/cy_game_list` });
// 取得過濾遊戲列表
export const apiGetFilterGameList = () =>
  fetchDataFunc({ url: `${API_URL}/backend/game/list` });
// 匯出csv
export const apiGetExport_csv = (params) =>
  axios({ url: `${API_URL}/backend/feedback/export_csv`, params });
// 取得評分列表
export const apiRateList = () =>
  fetchDataFunc({ url: `${API_URL}/backend/rate/list` });
// 取得白名單
export const apiWhitelist = () =>
  fetchDataFunc({ url: `${API_URL}/backend/whitelist/list` });
// 取得設定清單
export const apiSetting = () =>
  fetchDataFunc({ url: `${API_URL}/backend/setting/list` });

// put
// ------------------------------------------------------------------------------------------------------------------
// 編輯帳號
export const apiAccountUpdate = (data) =>
  axios.put(`${API_URL}/backend/admin/update`, data);
// 編輯遊戲設定
export const apiGameUpdate = (data) =>
  axios.put(`${API_URL}/backend/game/update`, data);
// 更新反饋開關
export const apiGameSwtich = (data) =>
  axios.put(`${API_URL}/backend/game/game_swtich`, data);
// 復原反饋標籤
export const apiFeedbackRecover = (data) =>
  axios.put(`${API_URL}/backend/feedback/recover`, data);
// 編輯評分
export const apiRateUpdate = (data) =>
  axios.put(`${API_URL}/backend/rate/update`, data);
// 編輯設定清單
export const apiSettingUpdate = (data) =>
  axios.put(`${API_URL}/backend/setting/update`, data);
// 編輯更新反饋
export const apiTagUpdate = (data) =>
  axios.put(`${API_URL}/backend/feedback/update_tag`, data);

// post
// ------------------------------------------------------------------------------------------------------------------
// 新增白名單
export const apiCreateWhitelist = (data) =>
  axios.post(`${API_URL}/backend/whitelist/create`, data);

// delete
// ------------------------------------------------------------------------------------------------------------------
// 刪除反饋列表
export const apiFeedbackDelete = (data) =>
  axios.delete(`${API_URL}/backend/feedback/delete`, { data });
// 刪除白名單
export const apiWhitelistDelete = (data) =>
  axios.delete(`${API_URL}/backend/whitelist/delete`, { data });
