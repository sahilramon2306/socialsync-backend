const isEmpty=(value)=>{
    if(value===null || value===undefined || trim(value)==='' || value.length===0){
        return true
    }
    else{
        return false
    }
}

module.exports={
    isEmpty:isEmpty
}