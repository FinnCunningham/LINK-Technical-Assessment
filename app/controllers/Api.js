import RNFetchBlob from 'rn-fetch-blob'

let baseURL = "https://interview.intrinsiccloud.net";
const fetchFromAPI = (endUrl, data, callback) => {
    let url = baseURL + endUrl;
    fetch(url, data)
    .then(response => {
        console.log(response.status)
        if(response.status == 418){
            return {"error": response.status}
        }
        if(response.status > 400 && response.status < 600){
            return {"error": "Error: If the problem persists please contact support"};
        }
        
        else if(response.status == 200 ){
            return response.json()
        }
        else{
            return {"error": response.status};
        }
       
    })
    .then((data) => {
        // console.log(data)
        callback(data)})
    .catch((error) => {
        console.log(error)
        callback({"error": "Error: Please make sure that the input value is correct!"})
    })

}

const loginAuth = (username, password, reduxAdd, navigation, setError, setName) => {
    let data = {
        method: 'POST',
        body: JSON.stringify({
          password: password,
          username: username
        }),
        headers: {
          "accept": "*/*",
          'Content-Type': 'application/json',
        }
      }
    let callback = (data) => {
        console.log(data)
        if(data.error){
            setError(data.error);
        }
        if(data.token){
            reduxAdd(data.token);
            setName(username);
            navigation.navigate("home");
        }
    }
    fetchFromAPI("/auth/login", data, callback)
    }

const getProfile = (token, setProfile, name="user3@intrinsicgrouplimited.com") => {
  console.log(name)
  let data = {
      method: 'GET',
      headers: {
        "accept": "*/*",
        "Authorization": `Bearer ${token}`
      }
    }
  const callback = (data) => {
      console.log(data);
      setProfile(data);
  }
  fetchFromAPI(`/profile?name=${name}`, data, callback)
}

const changePasswordValue = (token, oldPassword, newPassword, setResponse, name="user3@intrinsicgrouplimited.com") => {
  console.log(name)
  let data = {
      method: 'POST',
      body: JSON.stringify({
        newPassword: newPassword,
        oldPassword: oldPassword
      }),
      headers: {
        "accept": "*/*",
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  const callback = (data) => {
      console.log("£HITHTIYHITHTI")
      console.log(data);
      setResponse(data);
  }
  fetchFromAPI(`/profile/changePassword?name=${name}`, data, callback)
}

const getContacts = (token, setContacts, name="user3@intrinsicgrouplimited.com") => {
    let data = {
        method: 'GET',
        headers: {
          "accept": "*/*",
          "Authorization": `Bearer ${token}`
        }
      }
    const callback = (data) => {
        // console.log(data);
        setContacts(data);
    }
    fetchFromAPI(`/contacts?name=${name}`, data, callback)
}

const addNewContact = (token, bodyData, name="user3@intrinsicgrouplimited.com") => {
    let data = {
        method: 'POST',
        body: JSON.stringify({
            "company": bodyData.company,
            "contactName": bodyData.contactName,
            "phoneNumbers": bodyData.phoneNumbers,
            "primaryEmailAddress": bodyData.primaryEmailAddress
        }),
        headers: {
          "accept": "*/*",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    const callback = (data) => {
        console.log("CALLBACK")
        console.log(data);
        // setContacts(data);
    }
    fetchFromAPI(`/contacts?name=${name}`, data, callback)
}

const editContact = (token, id, bodyData, name="user3@intrinsicgrouplimited.com") => {
    let data = {
        method: 'PUT',
        body: JSON.stringify({
            "company": bodyData.company,
            "contactName": bodyData.contactName,
            "phoneNumbers": bodyData.phoneNumbers,
            "primaryEmailAddress": bodyData.primaryEmailAddress
        }),
        headers: {
          "accept": "*/*",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    const callback = (data) => {
        console.log("CALLBACK")
        console.log(data);
        // setContacts(data);
    }
    fetchFromAPI(`/contacts/${id}?name=${name}`, data, callback)
}

const deleteContact = (token, id, name="user3@intrinsicgrouplimited.com") => {
    let data = {
        method: 'DELETE',
        headers: {
          "accept": "*/*",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    const callback = (data) => {
        console.log("CALLBACK")
        console.log(data);
    }
    fetchFromAPI(`/contacts/${id}?name=${name}`, data, callback)
}
const setNewImage = (token, image, setProfileImg, name="user3@intrinsicgrouplimited.com") => {
    var body = new FormData();
    body.append('file', {uri: image.assets[0].uri, type: image.assets[0].type, name: image.assets[0].fileName});
    let data = {
        method: 'POST',
        body: body,
        headers: {
          "accept": "*/*",
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        }
      }
    const callback = (data) => {
        console.log("CALLBACK")
        console.log(data);
        if(data.error){
          getProfileImage(setProfileImg, data.error);
        }else{
          getProfileImage(setProfileImg);
        }
    }
    fetchFromAPI(`/profile/profileImage?name=${name}`, data, callback)
}

const getCountries = (setCountries) => {
    let data = {
        method: 'GET',
        headers: {
          "accept": "*/*"
        }
      }
    const callback = (data) => {
        // console.log(data);
        setCountries(data);
    }
    fetchFromAPI("/utility/countries", data, callback)
}

// The api does not return an user id but I know it is "3"
const getProfileImage = (setProfileImg, error=null, id=3) => {
    let url = baseURL + `/profile/profileImage/${id}`;
    RNFetchBlob.config({
        fileCache : true,
      }).fetch('GET', url)
    // when response status code is 200
    .then((res) => {
      console.log(res)
        // the conversion is done in native code
        console.log('The file saved to ', res.path())
        console.log("STATUS " + res.respInfo.status)
        if(error || res.respInfo.status != 200){
          if(!error){
            error = "Error: If the problem persists please contact support";
          }
          setProfileImg({path: {}, error: error})
        }else{
          setProfileImg({path: res.path()})
        }
    })
    // Status code is not 200
    .catch((errorMessage, statusCode) => {
        console.log(errorMessage)
        // error handling
    })
}

export {loginAuth, getProfile, getProfileImage, getCountries, getContacts, addNewContact,
    setNewImage, editContact, deleteContact, changePasswordValue};