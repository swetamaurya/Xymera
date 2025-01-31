(function(){
    const fff1 = document.getElementById("div_footer_button_dynamic_js_pagination");
    if(fff1) {     
        fff1.innerHTML =  
                `
                    <div class="datatable-info">Showing <span id="minDataInPage">1</span> to <span id="maxDataInPage">10</span> of <span id="totalDataInApi">2</span> entries</div>
                    <nav class="datatable-pagination">
                        <ul class="datatable-pagination-list">
                        <li class="datatable-pagination-list-item">
                            <button id="footer_btn_previous_apiData"  class="datatable-pagination-list-item-link" aria-label="Page 1">‹</button>
                        </li>
                        <li class="datatable-pagination-list-item datatable-active">
                            <button id="page-limit-show-pagination" data-page="1" class="datatable-pagination-list-item-link" aria-label="Page 1">1</button>
                        </li>
                        <li class="datatable-pagination-list-item">
                            <button id="footer_btn_next_apiData" class="datatable-pagination-list-item-link">›</button>
                        </li>
                        </ul>
                    </nav>
                `;
    }
    // -------------------------------------------------------------------------------------------------------
    const fff2 = document.getElementById("div_select_option_dynamic_js_pagination");
    if(fff2){
        fff2.innerHTML = 
            `
                <select id="pagination_select_option_number" class="datatable-selector" name="per-page">
                  <option value="10" selected="">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="75">75</option>
                  <option value="100">100</option>
                </select>
                <label> entries per page</label>
            `;
    }
})();
// ############################################################################################################################
// ############################################################################################################################
// ############################################################################################################################
// ############################################################################################################################
let apiPageNumber = 1;
let currentPageApiLimit = 10;
let totalDataCount;
// =================================================================================
// ------------------------------------------------
export function setApiPageNumber(z1) {
    apiPageNumber = z1;
}
export function getApiPageNumber() {
    return apiPageNumber;
}
// ------------------------------------------------
export function setCurrentPageApiLimit(z1){
    currentPageApiLimit = z1;
}
export function getCurrentPageApiLimit(){
    return currentPageApiLimit;
}
// ------------------------------------------------
export function setTotalDataCount(z1){
    document.getElementById("totalDataInApi").innerText = z1;
    totalDataCount = z1;
}
export function getTotalDataCount(){
    return totalDataCount;
}
// ------------------------------------------------
// =================================================================================
let select_option = document.getElementById("pagination_select_option_number");
// ------------------------------------------------
let number_of_buttons_l_f = document.getElementById("page-limit-show-pagination");
let left_btn_of_l_f = document.getElementById("footer_btn_previous_apiData");
let right_btn_of_l_f = document.getElementById("footer_btn_next_apiData");
// =================================================================================
if(select_option){
    select_option.addEventListener("input", function() {
        setCurrentPageApiLimit(select_option.value);
        setApiPageNumber(1);
        number__load_handle();
    });
}
// --------------------------------------------------------------------------------
if(left_btn_of_l_f){
    left_btn_of_l_f.addEventListener("click", function() {
        if(getApiPageNumber()==1){
            return;
        }
        setApiPageNumber(getApiPageNumber()-1);
        number__load_handle();
    });
}
// --------------------------------------------------------------------------------
if(right_btn_of_l_f){
    right_btn_of_l_f.addEventListener("click", function() {
        let a1 = (Number(number_of_buttons_l_f.innerText) * Number(select_option.value));
        if(a1>=getTotalDataCount()){
            return;
        }
        setApiPageNumber(getApiPageNumber()+1);
        number__load_handle();
    })
}
// =================================================================================
let table_data_reload;
export function pagination_data_handler_function(table_data_function) {
    table_data_reload = table_data_function;
}
// --------------------------------------------------------------------------------
function number__load_handle(){
    document.getElementById("minDataInPage").innerText = ((Number(getApiPageNumber())-1) * Number(pagination_select_option_number.value))+1;
    document.getElementById("maxDataInPage").innerText = Number(pagination_select_option_number.value) * Number(getApiPageNumber()) ;
    number_of_buttons_l_f.innerText = getApiPageNumber();
    load_all_data();
}
function load_all_data(){
    table_data_reload();
}
// --------------------------------------------------------------------------------
export function rtnPaginationParameters() {
    let z2 = `?limit=${getCurrentPageApiLimit()}&page=${getApiPageNumber()}`;
    return z2;
}
// ##################################################################################
// ##################################################################################
export function forGloablDelete_js(){
    setApiPageNumber(1);
    setCurrentPageApiLimit(10);
    select_option.value = getCurrentPageApiLimit();
    number__load_handle();
}

