
export function start_hidder(){
    main_hidder_function();
}
function main_hidder_function(){
    let role_of_user = localStorage.getItem("roles") || "null";
    if(role_of_user.toLowerCase() == "Admin".toLowerCase()){
        admin_restriction_d_none();
        admin_restriction_disabled();
    } else if(role_of_user.toLowerCase() == "HR".toLowerCase()){
        hr_restriction_d_none();
        hr_restriction_disabled();
    } else if(role_of_user.toLowerCase() == "Manager".toLowerCase()){
        manager_restriction_d_none();
        manager_restriction_disabled();
    
    } else if(role_of_user.toLowerCase() == "Employee".toLowerCase()){
        employee_restriction_d_none();
        employee_restriction_disabled();
    } 
    else {
        localStorage.clear();
        window.location.href = 'login.html';
    }
}
main_hidder_function();
setTimeout(() => {
    main_hidder_function();
}, 100);
setTimeout(() => {
    main_hidder_function();
}, 500);
setTimeout(() => {
    main_hidder_function();
}, 1000);
setTimeout(() => {
    main_hidder_function();
}, 5000);
// =========================================================================================
// =========================================================================================
// copy and paste admin class, to hide other functionalty for admin;
function admin_restriction_d_none(){
    let all = Array.from(document.querySelectorAll(".admin_restriction_d_none"));
    all.map((e)=>{
        e.style.setProperty('display', 'none', 'important');
        e.classList.add("d-none", "hidden");
        e.setAttribute("hidden","");
    });
}

// copy and paste hr class, to hide other functionalty for hr;
function hr_restriction_d_none(){
    let all = Array.from(document.querySelectorAll(".hr_restriction_d_none"));
    all.map((e)=>{
        e.style.setProperty('display', 'none', 'important');
        e.classList.add("d-none", "hidden");
        e.setAttribute("hidden","");
    });
}

// copy and paste manager class, to hide other functionalty for manager;
function manager_restriction_d_none(){
    let all = Array.from(document.querySelectorAll(".manager_restriction_d_none"));
    all.map((e)=>{
        e.style.setProperty('display', 'none', 'important');
        e.classList.add("d-none", "hidden");
        e.setAttribute("hidden","");
    });
}

// copy and paste employee class, to hide other functionalty for employee;
function employee_restriction_d_none(){
    let all = Array.from(document.querySelectorAll(".employee_restriction_d_none"));
    all.map((e)=>{
        e.style.setProperty('display', 'none', 'important');
        e.classList.add("d-none", "hidden");
        e.setAttribute("hidden","");
    });
}
// =========================================================================================
// =========================================================================================
// copy and paste admin class, to disabled other functionalty for admin;
function admin_restriction_disabled(){
    let all = Array.from(document.querySelectorAll(".admin_restriction_disabled"));
    all.map((e)=>{
        e.setAttribute("disabled","");
        e.setAttribute("readonly","");
    });
}

// copy and paste hr class, to disabled other functionalty for hr;
function hr_restriction_disabled(){
    let all = Array.from(document.querySelectorAll(".hr_restriction_disabled"));
    all.map((e)=>{
        e.setAttribute("disabled","");
        e.setAttribute("readonly","");
    });
}

// copy and paste manager class, to disabled other functionalty for manager;
function manager_restriction_disabled(){
    let all = Array.from(document.querySelectorAll(".manager_restriction_disabled"));
    all.map((e)=>{
        e.setAttribute("disabled","");
        e.setAttribute("readonly","");
    });
}

// copy and paste employee class, to disabled other functionalty for employee;
function employee_restriction_disabled(){
    let all = Array.from(document.querySelectorAll(".employee_restriction_disabled"));
    all.map((e)=>{
        e.setAttribute("disabled","");
        e.setAttribute("readonly","");
    });
}