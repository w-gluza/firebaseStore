document.addEventListener('DOMContentLoaded', event => {
  const db = firebase.firestore();
  const auth = firebase.auth();
  const myProducts = db.collection('products');
  const productsContainer = document.querySelector('#products__container');
  const form = document.querySelector('#add__product');

  function renderProduct(doc) {
    const docFrag = document.createDocumentFragment();
    let article = document.createElement('article');
    let productName = document.createElement('h4');
    let productPrice = document.createElement('p');
    let deleteButton = document.createElement('button');
    let updateButton = document.createElement('button');

    article.setAttribute('product-id', doc.id);

    productName.textContent = doc.data().name;
    productPrice.textContent = doc.data().price;
    deleteButton.textContent = 'Delete';
    updateButton.textContent = 'Update';

    docFrag.appendChild(productName);
    docFrag.appendChild(productPrice);
    docFrag.appendChild(deleteButton);
    docFrag.appendChild(updateButton);

    article.appendChild(docFrag);
    productsContainer.appendChild(article);

    deleteButton.addEventListener('click', e => {
      let id = e.target.parentElement.getAttribute('product-id');
      myProducts.doc(id).delete();
    });

    updateButton.addEventListener('click', e => {
      let id = e.target.parentElement.getAttribute('product-id');
      myProducts.doc(id).update({
        name: 'test',
        price: '999'
      });
    });
  }

  // getting data from Firestore

  myProducts.onSnapshot(products => {
    let changes = products.docChanges();
    changes.forEach(change => {
      if (change.type === 'added') {
        renderProduct(change.doc);
      } else if (change.type === 'removed') {
        let article = productsContainer.querySelector(
          '[product-id=' + change.doc.id + ']'
        );
        productsContainer.removeChild(article);
      } else if (change.type === 'modified') {
        let article = productsContainer.querySelector(
          '[product-id=' + change.doc.id + ']'
        );
        productsContainer.removeChild(article);
        renderProduct(change.doc);
      }
    });
  });

  // creating new data
  form.addEventListener('submit', e => {
    e.preventDefault();
    myProducts.add({
      name: form.name.value,
      price: form.price.value
    });
  });
  auth.onAuthStateChanged(user => {
    if (user) {
      console.log('user logged in: ', user);
    } else {
      console.log('user logged out: ');
    }
  });

  const signupForm = document.querySelector('#signup-form');
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    // sign up user
    const auth = firebase.auth();

    auth.createUserWithEmailAndPassword(email, password).then(cred => {
      console.log(cred);
    });
  });
  // log out form
  const logout = document.querySelector('#logout');
  logout.addEventListener('click', e => {
    const auth = firebase.auth();
    e.preventDefault();
    auth.signOut();
  });

  //log in
  const loginForm = document.querySelector('#login-form');
  loginForm.addEventListener('submit', e => {
    const auth = firebase.auth();
    e.preventDefault();
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    auth.signInWithEmailAndPassword(email, password).then(cred => {
      console.log('user logged in');
    });
  });

  // end document loaded
});
