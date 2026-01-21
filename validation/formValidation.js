export const validateForm = ({title, description, priority}) => {
    try{
    if(title === '' || !title){
        alert("Please Enter Title for the task");
        return false;
    }
    if(description === '' || !description){
        alert("Please Enter description for the task");
        return false;
    }
    if(priority === ''|| !priority){
        alert("Please select priority of the task");
        return false;
    }
    return true;
    }catch (error){
        throw error;
    }
}