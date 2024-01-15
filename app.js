import { auth , signInWithEmailAndPassword ,onAuthStateChanged} from './js/firebase.js';

onAuthStateChanged(auth, (user) => {
  if (user) {
      console.log(user.email)
      location.replace('dashboard.html')
  }
});




const login = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    console.log(email.value , password.value);
    signInWithEmailAndPassword(auth, email.value, password.value)
  .then((userCredential) => {
      const user = userCredential.user;
      console.log(user)
    if(user.email === 'admin@gmail.com') {
        location.href = './dashboard.html'
    }
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log('err>>>',errorMessage)
  });

}

const loginBtn = document.getElementById('loginBtn');
loginBtn && loginBtn.addEventListener('click' , login)