// -------------------------------------------------------------
export const TOKEN = localStorage.getItem('token');
// -------------------------------------------------------------
// -------------------------------------------------------------
const domain = `https://xymera-crm.onrender.com`;
// const domain = `http://localhost:8000`;
// const domain = `https://www.ns3.epgmt.com`;
// const domain = ``;
// -------------------------------------------------------------
// ---------------------END POINTS------------------------------
const user = `/user`;
const create = `/create`;
const getall = `/getAll`;
const get = `/get`;
const update = `/update`;
const get_location =`/get-location`
// -----------------------------------------
// ------------------------GLOBAL-------------------------------
export const DELETE_API = `${domain}/delete/all`;
export const EXPORT_API = `${domain}/dashboard/export`;
export const IMPORT_API = `${domain}/dashboard/import`;
export const DASHBOARD_API = `${domain}/dashboard/getAll`;
export const SEARCH_API = `${domain}/search/data`;
// -------------------------------------------------------------
// _____________________________________________________________
// ####################=-ALL APIs-=#############################
// _____________________________________________________________
const user_api = `${domain}${user}`;
const category_api = `${domain}/category`;
const product_api = `${domain}/product`;
const department_api = `${domain}/department`;
const employee_api = `${domain}/user`;
const visit_api = `${domain}/visit`;
const remark_api = `${domain}/remark`;
const location_api = `${domain}/location`;
const leaves_api = `${domain}/leaves`;
// _____________________________________________________________
// -------------------------------------------------------------
// -----------------------USER----------------------------------
export const USER_API_LOGIN = `${user_api}/login`;
// -------------------------------------------------------------
// --------------------COVERAGE---------------------------------
export const TRACK_COVERAGE_API_EMPLOYEE = `${domain}/dashboard/employee/coverage`;
// -------------------------------------------------------------
// ---------------------CATEGORY--------------------------------
export const CATEGORY_API_CREATE = `${category_api}${create}`;
export const CATEGORY_API_GETALL = `${category_api}${getall}`;
export const CATEGORY_API_GETSINGLE = `${category_api}${get}`;
export const CATEGORY_API_UPDATE = `${category_api}${update}`;
// -------------------------------------------------------------
// ---------------------PRODUCT---------------------------------
export const PRODUCT_API_CREATE = `${product_api}${create}`;
export const PRODUCT_API_GETALL = `${product_api}${getall}`;
export const PRODUCT_API_GETSINGLE = `${product_api}${get}`;
export const PRODUCT_API_UPDATE = `${product_api}${update}`;
// -------------------------------------------------------------
// -------------------DEPARTMENT--------------------------------
export const DEPARTMENT_API_CREATE = `${department_api}${create}`;
export const DEPARTMENT_API_GETALL = `${department_api}${getall}`;
export const DEPARTMENT_API_GETSINGLE = `${department_api}${get}`;
export const DEPARTMENT_API_UPDATE = `${department_api}${update}`;
// -------------------------------------------------------------
// --------------------EMPLOYEE---------------------------------
export const EMPLOYEE_API_CREATE = `${employee_api}${create}`;
export const EMPLOYEE_API_GETALL = `${employee_api}${getall}`;
export const EMPLOYEE_API_GETSINGLE = `${employee_api}${get}`;
export const EMPLOYEE_API_UPDATE = `${employee_api}${update}`;
// -------------------------------------------------------------
// ---------------------VISIT-----------------------------------
export const VISIT_API_CREATE = `${visit_api}${create}`;
export const VISIT_API_GETALL = `${visit_api}${getall}`;
export const VISIT_API_GETSINGLE = `${visit_api}${get}`;
export const VISIT_API_UPDATE = `${visit_api}${update}`;
// -------------------------------------------------------------
// ---------------------REMARK----------------------------------
export const REMARK_API_CREATE = `${remark_api}${create}`;
export const REMARK_API_UPDATE = `${remark_api}${update}`;
// -------------------------------------------------------------
// ---------------------LOCATION--------------------------------
export const LOCATION_API_GET_IP = `${location_api}${get_location}`;
export const LOCATION_API_UPDATE = `${location_api}${update}`;
export const LOCATION_API_GETALL= `${location_api}${getall}`;
export const LOCATION_API_GETSINGLE = `${location_api}${get}`;
// -------------------------------------------------------------
// -----------------------LEAVE---------------------------------
export const LEAVE_API_CREATE = `${leaves_api}${create}`;
export const LEAVE_API_GETALL = `${leaves_api}${getall}`;
export const LEAVE_API_GETSINGLE = `${leaves_api}${get}`;
export const LEAVE_API_UPDATE = `${leaves_api}${update}`;
// -------------------------------------------------------------
// -------------------------------------------------------------

