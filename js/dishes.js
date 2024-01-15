import { collection, getDocs, db , where , query,getDoc ,doc } from './firebase.js'

var params = new URLSearchParams(window.location.search)
let pageSpinner = document.getElementById('page-spinner');
let mainContent = document.getElementById('main-content');

const getResturantDetails = async() => {
    const resName = document.getElementById('res-name');
    const resAddress = document.getElementById('res-address');
    const resImage = document.getElementById('res-image');
    const docRef = doc(db, "resturant", params.get('resturant'));
const docSnap = await getDoc(docRef);
if (docSnap.exists()) {
    resName.innerHTML = docSnap.data().name;
    resAddress.innerHTML = docSnap.data().address;
    resImage.src = docSnap.data().image;
  console.log("Document data:", docSnap.data());
} else {
  // docSnap.data() will be undefined in this case
  console.log("No such document!");
}
}

getResturantDetails()


const getAllDishes = async() => {
    console.log(params.get('resturant'))
    const showDishes = document.getElementById('dishes')
    // const q = query(collection(db, "add-dishes"),where('resturant', '==' , params.get('resturant')));
    const q = query(collection(db, "add-dishes"));
    const querySnapshot = await getDocs(q);
    pageSpinner.style.display = 'none';
    mainContent.style.display = 'block';
    showDishes.innerHTML = ``
    querySnapshot.forEach((doc) => {
  showDishes.innerHTML += `
  <div class="card dish-card w-100 mb-3">
  <div class="card-body">
      <div class="d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center">
              <img class="dish-img"
                  src="${doc.data().image}"
                  alt="">
              <div class="p-2">
                  <h5 class="card-title">${doc.data().name}</h5>
                  <h3 class="card-title">Rs: ${doc.data().price}/-</h3>
                  <p class="card-text">serves ${doc.data().serving}</p>
              </div>
          </div>
          <div class="d-flex align-items-center gap-2">
              <button class="qty-btn"><i class="fa-solid fa-minus"></i></button>
              <span class="fw-bold">1</span>
              <button class="qty-btn"><i class="fa-solid fa-plus"></i></button>

              <a href="#" class="btn btn-primary">Add to cart</a>
          </div>
      </div>
  </div>
</div>
  `
  });
  }
  
  getAllDishes();