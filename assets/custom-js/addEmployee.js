(function(){
    const timestamp = localStorage.getItem('timestampActiveSession');
    if (timestamp) {
        const currentTime = Date.now();
        const timeDiff = currentTime - parseInt(timestamp);
        let hrs = 9.5; // hrs session active condition
        if (timeDiff > hrs * 60 * 60 * 1000) {
            localStorage.clear();
            window.location.href = 'login.html';
        }
    } else {
        localStorage.clear();
        window.location.href = 'login.html';
    }
})();
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
import {user_API,departments_API} from './apis.js'
import {status_popup} from './GLOBAL_popup_shimmer.js';
// -----------------------------------------------------------------------------
const token = localStorage.getItem('token');
// ==============================================================================

async function showAllDepartmentInDropdown(){
    const department = document.getElementById('department')
    const response = await fetch(`${departments_API}/get`,{
        method:'GET',
        headers:{
            
            'Authorization':token
        },
        
    })
    const res = await response.json();
    console.log(res);
    const option = document.createElement('option');
    res.data.map(e=>{
        option.value=e._id
        option.innerText=e.name
        department.appendChild(option)
    })
}
showAllDepartmentInDropdown()

const addEmployee = document.getElementById('add-employee');
addEmployee.addEventListener('submit',async(event)=>{
    event.preventDefault();
    const userName = document.getElementById('username').value
    const password = document.getElementById('password').value
    const name = document.getElementById('emp_name').value
    const email = document.getElementById('email').value
    const mobile = document.getElementById('mobile').value
    const roles = document.getElementById('designation').value
    const empType = document.getElementById('user_type').value
    const km = document.getElementById('per_km_cost').value
    const shiftStart = document.getElementById('shift_start').value
    const shiftEnd = document.getElementById('shift_end').value
    const userId = document.getElementById('employee_id').value
    const departments = document.getElementById('department').value
    const joiningDate = document.getElementById('doj').value
    const formData = new FormData();

    const image = document.getElementById('photo').files[0];
    // for(let image of images){
    //     formData.append('image',image)
    // }
    formData.append('image',image)
    formData.append('userName',userName)
    formData.append('password',password)
    formData.append('name',name)
    formData.append('email',email)
    formData.append('mobile',mobile)
    formData.append('roles',roles)
    formData.append('km',km)
    formData.append('shiftStart',shiftStart)
    formData.append('shiftEnd',shiftEnd)
    formData.append('departments',departments)
    formData.append('joiningDate',joiningDate)
    formData.append('empType',empType)
    formData.append('userId',userId)

    try {
        const response = await fetch(`${user_API}/post`,{
            method:'POST',
            headers:{
                
                'Authorization': token
            },
            body:formData
        })
        const res = await response.json();
        console.log(res);
        const c1 = (response.ok);
    try{
        status_popup( ((c1) ? "Account Created <br> Successfully" : "Please try again later"), (c1) );
        setTimeout(function(){
          window.location.href = 'manage-employee.html';
        },((Number(document.getElementById("b1b1").innerText)-1)*1000));
    } catch (error){
      status_popup( ("Please try again later"), (false) );
    }
    } catch (error) {
        console.log(error)
    }
})

