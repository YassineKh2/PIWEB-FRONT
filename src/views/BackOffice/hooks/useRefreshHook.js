export const useRefresh = ()=>{


    let refresh = false;

    const setRefresh = (value) =>{
        refresh = value;
       }
    return {refresh,setRefresh}
}