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
    })

}

const loginAuth = (username, password, reduxAdd, navigation, setError) => {
    let data = {
        method: 'POST',
        body: JSON.stringify({
          password: password,
          username: username
        }),
        headers: {
          // 'Accept':       'application/json',
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
            reduxAdd(data.token)
            navigation.navigate("home");
        }
    }
    fetchFromAPI("/auth/login", data, callback)
    }

const getProfile = (token, setProfile) => {
    let data = {
        method: 'GET',
        headers: {
          // 'Accept':       'application/json',
          "accept": "*/*",
          "Authorization": `Bearer ${token}`
        }
      }
    const callback = (data) => {
        // console.log(data);
        setProfile(data);
    }
    fetchFromAPI("/profile?name=user3@intrinsicgrouplimited.com", data, callback)
}

const getContacts = (token, setContacts) => {
    let data = {
        method: 'GET',
        headers: {
          // 'Accept':       'application/json',
          "accept": "*/*",
          "Authorization": `Bearer ${token}`
        }
      }
    const callback = (data) => {
        // console.log(data);
        setContacts(data);
    }
    fetchFromAPI("/contacts?name=user3@intrinsicgrouplimited.com", data, callback)
}

const addNewContact = (token, bodyData) => {
    let data = {
        method: 'POST',
        body: JSON.stringify({
            "company": bodyData.company,
            "contactName": bodyData.contactName,
            "phoneNumbers": bodyData.phoneNumbers,
            "primaryEmailAddress": bodyData.primaryEmailAddress
        }),
        headers: {
          // 'Accept':       'application/json',
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
    fetchFromAPI("/contacts?name=user3@intrinsicgrouplimited.com", data, callback)
}

const editContact = (token, id, bodyData) => {
    let data = {
        method: 'PUT',
        body: JSON.stringify({
            "company": bodyData.company,
            "contactName": bodyData.contactName,
            "phoneNumbers": bodyData.phoneNumbers,
            "primaryEmailAddress": bodyData.primaryEmailAddress
        }),
        headers: {
          // 'Accept':       'application/json',
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
    fetchFromAPI(`/contacts/${id}?name=user3@intrinsicgrouplimited.com`, data, callback)
}

const deleteContact = (token, id) => {
    let data = {
        method: 'DELETE',
        headers: {
          // 'Accept':       'application/json',
          "accept": "*/*",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    const callback = (data) => {
        console.log("CALLBACK")
        console.log(data);
    }
    fetchFromAPI(`/contacts/${id}?name=user3@intrinsicgrouplimited.com`, data, callback)
}
const setNewImage = (token, image, setProfileImg) => {
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
        getProfileImage(setProfileImg)
    }
    fetchFromAPI("/profile/profileImage?name=user3@intrinsicgrouplimited.com", data, callback)
}

const getCountries = (setCountries) => {
    let data = {
        method: 'GET',
        headers: {
          // 'Accept':       'application/json',
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
const getProfileImage = (setProfileImg, id=3) => {
    console.log("YO")
    let url = baseURL + `/profile/profileImage/${id}`;
    RNFetchBlob.config({
        fileCache : true,
      }).fetch('GET', url)
    // when response status code is 200
    .then((res) => {
        // the conversion is done in native code
        console.log('The file saved to ', res.path())
        setProfileImg(res.path())
    })
    // Status code is not 200
    .catch((errorMessage, statusCode) => {
        console.log(errorMessage)
        // error handling
    })
}

export {loginAuth, getProfile, getProfileImage, getCountries, getContacts, addNewContact,
    setNewImage, editContact, deleteContact};