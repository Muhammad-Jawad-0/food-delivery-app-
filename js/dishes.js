import {
  collection,
  getDocs,
  db,
  where,
  query,
  getDoc,
  doc,
} from "./firebase.js";

var params = new URLSearchParams(window.location.search);
let pageSpinner = document.getElementById("page-spinner");
let mainContent = document.getElementById("main-content");

const getResturantDetails = async () => {
  const resName = document.getElementById("res-name");
  const resAddress = document.getElementById("res-address");
  const resImage = document.getElementById("res-image");
  const docRef = doc(db, "resturant", params.get("resturant"));
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    resName.innerHTML = docSnap.data().name;
    resAddress.innerHTML = docSnap.data().address;
    resImage.src = docSnap.data().image;
    //   console.log("Document data:", docSnap.data());
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
};

getResturantDetails();

let dishes = [];

const getAllDishes = async () => {
  // console.log(params.get('resturant'))
  const showDishes = document.getElementById("dishes");
  // const q = query(collection(db, "add-dishes"),where('resturant', '==' , params.get('resturant')));
  const q = query(collection(db, "add-dishes"));
  const querySnapshot = await getDocs(q);
  pageSpinner.style.display = "none";
  mainContent.style.display = "block";
  showDishes.innerHTML = ``;
  querySnapshot.forEach((doc) => {
    dishes.push({ ...doc.data(), id: doc.id });
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
              <button onclick = "updateQty('-' , '${
                doc.id
              }')" class="qty-btn"><i class="fa-solid fa-minus"></i></button>
              <span class="fw-bold" id = "${doc.id}">1</span>
              <button onclick = "updateQty('+', '${
                doc.id
              }')" class="qty-btn"><i class="fa-solid fa-plus"></i></button>

              <a href="#" class="btn btn-primary" onclick="addToCard('${
                doc.id
              }')">Add to cart</a>
          </div>
      </div>
  </div>
</div>
  `;
  });
};

getAllDishes();

const updateQty = (type, id) => {
  const qty = document.getElementById(id);
  if (Number(qty.innerHTML) < 2 && type === "-") {
    return;
  }
  if (type === "+") {
    qty.innerHTML = Number(qty.innerHTML) + 1;
  } else {
    qty.innerHTML = Number(qty.innerHTML) - 1;
  }
};

const addToCard = (id) => {
  const cardItems = localStorage.getItem("card");
  const card = cardItems ? JSON.parse(cardItems) : [];
  const qty = document.getElementById(id);
  const dish = dishes.filter((v) => v.id === id);
  card.push({ ...dish[0], qty: Number(qty.innerHTML) });
  localStorage.setItem("card", JSON.stringify(card));
  const totalAmount = document.getElementById('totalAmount');
  const sum = card.reduce((a,b) => a + Number(b.price) * b.qty , 0);
  totalAmount.innerHTML = `Rs ${sum + 100}/-`
  console.log(sum)
  getCardItems()
};

const deleteCartItem = (i) => {
  const cardItems = JSON.parse(localStorage.getItem("card"));
  cardItems.splice(Number(i),1);
  localStorage.setItem('card' , JSON.stringify(cardItems))
  const totalAmount = document.getElementById('totalAmount');
  const sum = cardItems.reduce((a,b) => a + Number(b.price) * b.qty , 0);
  totalAmount.innerHTML = `Rs ${sum + 100}/-`
  getCardItems()
}

const getCardItems = () => {
  const cardItems = JSON.parse(localStorage.getItem("card"));
  const cardDetails = document.getElementById("card");
  cardDetails.innerHTML = '';
  if (cardItems) {
    for (let i = 0; i < cardItems.length; i++) {
      console.log(cardItems[i]);
      cardDetails.innerHTML += `
      <div class="card dish-card w-100 mb-3">
                          <div class="card-body">
                              <div class="d-flex align-items-center justify-content-between">
                                  <div class="d-flex align-items-center">
                                      <img class="dish-image"
                                          src="${cardItems[i].image}" />
                                      <div class="p-2">
                                          <h5 class="card-title">${
                                            cardItems[i].name
                                          }</h5>
                                          <h3 class="card-title">Rs: ${
                                            cardItems[i].price
                                          } /- x ${cardItems[i].qty} = ${
                                            cardItems[i].price * cardItems[i].qty
}</h3>
                                          <p class="card-text">Serves ${
                                            cardItems[i].serving
                                          }
                                          </p>
                                      </div>
                                  </div>
                                  <a href="#" onClick="deleteCartItem('${i}')" class="btn btn-primary"><i class="fa-solid fa-trash"></i></a>
                              </div>
                          </div>
                      </div>
      `;
    }
  }
};
getCardItems();


window.updateQty = updateQty;
window.addToCard = addToCard;
window.deleteCartItem = deleteCartItem