import {storage , ref , uploadBytesResumable , getDownloadURL, collection, db, addDoc, getDocs} from './firebase.js'


const logo = document.getElementById('restaurant-logo');
const selectedLogo = document.getElementById('selected-logo');
let file;
logo && logo.addEventListener('change' , (e) => {
    file = e.target.files[0]
    selectedLogo.style.display = 'block';
    selectedLogo.src = URL.createObjectURL(e.target.files[0])
})

let uploadFile = (file, name) => {
    return new Promise((resolve, reject) => {
        const storageRef = ref(storage, `images/${name.split(" ").join("-")}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                reject(error)
            },
            () => {

                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    resolve(downloadURL)
                });
            }
        );
    })
}






const getAllResturant = async() => {
    const resList = document.getElementById('res-list')
    resList.innerHTML = "";
    const q = collection(db, "resturant")
const querySnapshot = await getDocs(q);
let index = 0;
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  console.log(doc.id, " => ", doc.data());
  index++;
  resList.innerHTML += `
  <tr>
  <th scope="row">${index}</th>
  <td><img class="res-logo-image" src="${doc.data().image}" alt=""></td>
  <td>${doc.data().name}</td>
  <td>${doc.data().address}</td>
</tr>
`
});
}

getAllResturant();


const submitResturant = document.getElementById('submit-restaurant');

submitResturant && submitResturant.addEventListener('click' , async() => {
    const closeBtn = document.getElementById('close-btn');
    const restaurantSpinner = document.getElementById('restaurant-spinner');
    const restaurantName = document.getElementById('restaurant-name');
    const restaurantAddress = document.getElementById('restaurant-address');
    restaurantSpinner.style.display = 'block'
    const image = await uploadFile(file , restaurantName.value)
    console.log(image ,' image')


    const docRef = await addDoc(collection(db, "resturant"), {
        name: restaurantName.value,
        address: restaurantAddress.value,
        image 
      });
    restaurantSpinner.style.display = 'none'
    restaurantName.value ='';
    restaurantAddress.value ='';
    logo.value = '';
      console.log("Document written with ID: ", docRef.id);
      selectedLogo.style.display = 'none';
      getAllResturant();
      closeBtn.click()

})


export { uploadFile };