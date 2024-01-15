import {storage , ref , uploadBytesResumable , getDownloadURL, collection, db, addDoc, getDocs} from './firebase.js'



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
    const resSelectList = document.getElementById('restaurant-name')
    resSelectList.innerHTML = "";
    const q = collection(db, "resturant")
const querySnapshot = await getDocs(q);
resSelectList.innerHTML = `<option selected>Select restaurant</option>`
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  // console.log(doc.id, " => ", doc.data());
  resSelectList.innerHTML += `
  <option value"${doc.id}">${doc.data().name}</option>
`
});
}

getAllResturant();


const getAllDishes = async() => {
  const allDishes = document.getElementById('all-dishes')
  allDishes.innerHTML = "";
  const q = collection(db, "add-dishes");
  const querySnapshot = await getDocs(q);
  let index = 0;
  allDishes.innerHTML = ``
  querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      index++;
allDishes.innerHTML += `
<tr>
<th scope="row">${index}</th>
<td><img src="${doc.data().image}" class="dish-image" alt=""></td>
<td>${doc.data().name}</td>
<td>${doc.data().price}</td>
<td>${doc.data().serving}</td>
<td>${doc.data().resturant}</td>
</tr>
`
});
}

getAllDishes();


const addDish = document.getElementById('addDish');

addDish.addEventListener('click' , async() => {
    const closeBtn = document.getElementById('close-btn')
    const  Spinner = document.getElementById('dish-spinner');
    const resName = document.getElementById('restaurant-name')
    const dishName = document.getElementById('dish-name')
    const dishPrice = document.getElementById('dish-price')
    const dishServing = document.getElementById('dish-serving')
    const dishImage = document.getElementById('dish-image').files[0];
    Spinner.style.display = 'block';
    const image = await uploadFile(dishImage , dishName.value)

    const dishDetail = {
      resturant : resName.value,
      name : dishName.value,
      price : dishPrice.value,
      serving : dishServing.value,
      image
    }

    const docRef = await addDoc(collection(db, "add-dishes"), dishDetail);
    resName.value ='';
    dishName.value ='';
    dishPrice.value = '';
    dishServing.value ='';
    dishImage.value = '';
    Spinner.style.display = 'none';
    closeBtn.click()
    getAllDishes()
    console.log(docRef)
})