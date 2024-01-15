import {storage , ref , uploadBytesResumable , getDownloadURL, collection, db, addDoc, getDocs} from './firebase.js'

const pageSpinner = document.getElementById('page-spinner')

const getAllResturant = async() => {
    const resListCard = document.getElementById('res-list-card')
    resListCard.innerHTML = "";
    const q = collection(db, "resturant")
const querySnapshot = await getDocs(q);
let index = 0;
pageSpinner.style.display = 'none';
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  console.log(doc.id, " => ", doc.data());
  index++;
  resListCard.innerHTML += `
  <div class="col">
  <div class="card" style="width: 18rem;">
      <img src="${doc.data().image}" alt="...">
      <div class="card-body">
        <h5 class="card-title">${doc.data().name}</h5>
        <p class="card-text">All veriety are avalible</p>
        <p>
          <span class="badge text-bg-primary">Biryani</span>
          <span class="badge text-bg-primary">Karachi</span>
          <span class="badge text-bg-primary">Drinks</span>
        </p>
        <a href="dishes.html?resturant=${doc.id}" class="btn btn-primary">View All dishes</a>
      </div>
    </div>
</div>
`
});
}

getAllResturant();