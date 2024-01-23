import {storage , ref , uploadBytesResumable , getDownloadURL, collection, db, addDoc, getDocs ,serverTimestamp,doc,getDoc,updateDoc} from './firebase.js'
 


const placeOrder = document.getElementById('placeOrder');

placeOrder && placeOrder.addEventListener('click' , async() => {
    const custumerName = document.getElementById('custumerName'); 
    const cardDiv = document.getElementById('card'); 
    const custumerNumber = document.getElementById('custumerNumber'); 
    const custumerAddress = document.getElementById('custumerAddress'); 
    const cart = JSON.parse(localStorage.getItem('card'));
    const sum = cart.reduce((a,b) => a + Number(b.price) * b.qty , 0);
    const totalAmount = document.getElementById('totalAmount');
    const closeBtn = document.getElementById('closeBtn');
    // totalAmount.innerHTML = `Rs ${sum + 100}/-`
    // console.log(cart);

    const orderDetails = {
        custumerName : custumerName.value,
        custumerNumber : custumerNumber.value,
        custumerAddress : custumerAddress.value,
        status : 'pending',
        cart,
        timestamp : serverTimestamp(),
        orderAmount : sum,
        deliveryCharges : 100,
        totalAmount : sum + 100
      }
  
      await addDoc(collection(db, "orders"), orderDetails);

      Swal.fire({
        position: "center-center",
        icon: "success",
        title: "Your order has been placed",
        showConfirmButton: false,
        timer: 1500
      });
      custumerAddress.value = "";
      custumerName.value = "";
      custumerNumber.value = "";
      localStorage.removeItem("card");
      cardDiv.innerHTML = "";
      totalAmount.innerHTML = "";
      closeBtn.click()
})


const getAllOrders = async() => {
  const allOrders = document.getElementById('all-orders');
  const pageSpinner = document.getElementById('page-spinner');
  const mainContent = document.getElementById('main-content');
  const q = collection(db, "orders");
  const querySnapshot = await getDocs(q);
  let index = 0;
  querySnapshot.forEach((doc) => {
    index++;
    // console.log('orders >>' , doc.data());
    let status = doc.data().status;
    let statusColor = "";

    if(status === "pending") {
      statusColor = "text-bg-warning"
    }
    if(status === "delivered") {
      statusColor = "text-bg-success"
    }

    console.log(statusColor)
    allOrders.innerHTML +=  `
    <tr>
        <th scope="row">${index}</th>
        <td>${doc.data().custumerName}</td>
        <td>${doc.data().custumerNumber}</td>
        <td>${doc.data().custumerAddress}</td>
        <td><span class="badge ${statusColor}">${status}</span>
        </td>
        <td>${doc.data().totalAmount}</td>
        <td>
        <button onclick="viewOrderDetail('${
          doc.id
        }')" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
        View details
    </button>
        </td>
    </tr>
        `;
    pageSpinner.style.display = 'none';
    mainContent.style.display = 'block';``
  });

};

getAllOrders()

let updateOrderId; 

const viewOrderDetail = async(id) => {
  updateOrderId = id;
  const cart = document.getElementById("cart");
  const orderStatus = document.getElementById("orderStatus");
  const docRef = doc(db, "orders" , id);
  const docSnap = await getDoc(docRef);
  const cardItems = docSnap.data().cart;
  orderStatus.value = docSnap.data().status;
  cart.innerHTML = "";
  for(var i = 0; i < cardItems.length; i++) {
    cart.innerHTML += `
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
                            </div>
                        </div>
                    </div>
    `;
  }


}

const updateOrder = document.getElementById('updateOrder');

updateOrder.addEventListener('click' , async() => {
  const closeBtn = document.getElementById('close-btn');
  const orderStatus = document.getElementById("orderStatus");
  const docRef = doc(db, 'orders', updateOrderId);
// Update the timestamp field with the value from the server
   await updateDoc(docRef, {
    status: orderStatus.value,
});
closeBtn.click();
getAllOrders();
})

window.viewOrderDetail = viewOrderDetail;