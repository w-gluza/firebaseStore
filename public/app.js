document.addEventListener('DOMContentLoaded', event => {
  const db = firebase.firestore();
  const auth = firebase.auth();
  const myProducts = db.collection('products');
  const productsContainer = document.querySelector('#products__container');
  const form = document.querySelector('#add__product');
  const mainCategory = document.querySelector('#main__category');
  const subCategory = document.querySelector('#sub__category');

  const femaleCategory = document.querySelector('#female__cat');
  const maleCategory = document.querySelector('#male__cat');
  const basket = [];

  function renderProductAdmin(doc) {
    const docFrag = document.createDocumentFragment();
    let productArticle = document.createElement('article');
    let sectionContainer = document.createElement('section');
    let sectionFigure = document.createElement('figure');
    let productName = document.createElement('h4');
    let productPrice = document.createElement('p');
    let productCategory = document.createElement('p');
    let productDescription = document.createElement('p');
    let productImage = document.createElement('img');

    let addButton = document.createElement('button');
    let deleteButton = document.createElement('button');
    let updateButton = document.createElement('button');

    productArticle.setAttribute('product-id', doc.id);
    productArticle.classList.add('product__container');

    productName.textContent = doc.data().name;
    productCategory.textContent = doc.data().mainCategory;
    productPrice.textContent = doc.data().price;
    productDescription.textContent = doc.data().description;
    productImage.src = doc.data().src;

    addButton.textContent = 'Add to basket';
    deleteButton.textContent = 'Delete';
    updateButton.textContent = 'Update';

    docFrag.appendChild(productName);
    docFrag.appendChild(productPrice);
    docFrag.appendChild(productCategory);
    docFrag.appendChild(productDescription);

    docFrag.appendChild(addButton);
    docFrag.appendChild(deleteButton);
    docFrag.appendChild(updateButton);
    sectionFigure.appendChild(productImage);

    sectionContainer.appendChild(docFrag);
    productArticle.appendChild(sectionFigure);
    productArticle.appendChild(sectionContainer);
    productsContainer.appendChild(productArticle);

    addButton.addEventListener('click', e => {
      basket.push(doc.data());
      console.log(basket);
      let basketTotal = basket.reduce(function(prev, cur) {
        return prev + cur.price;
      }, 0);
      console.log('Total Price:', basketTotal); // Total Price
    });

    deleteButton.addEventListener('click', e => {
      let id = e.target.parentElement.getAttribute('product-id');
      myProducts.doc(doc.id).delete();
    });

    updateButton.addEventListener('click', e => {
      let id = e.target.parentElement.getAttribute('product-id');
      myProducts.doc(doc.id).update({
        name: 'test',
        price: '999'
      });
    });
  }

  myProducts.onSnapshot(products => {
    let changes = products.docChanges();
    changes.forEach(change => {
      if (change.type === 'added') {
        renderProductAdmin(change.doc);
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
        renderProductAdmin(change.doc);
      }
    });
  });

  if (maleCategory != null) {
    maleCategory.addEventListener('click', () => {
      if (doc.data().mainCategory == 'male') {
        console.log(doc.data().name + ' has male category');
      }
    });
  }
  if (femaleCategory != null) {
    femaleCategory.addEventListener('click', () => {
      myProducts.where('mainCategory', '==', 'female').onSnapshot();
    });
    // if (doc.data().mainCategory == 'female') {
    //   console.log(doc.data().name + ' has female category');
    //
    // });
  }
  // creating new data
  if (form != null) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      myProducts.add({
        name: form.name.value,
        price: parseFloat(form.price.value),
        src: form.src.value,
        description: form.description.value,
        mainCategory: mainCategory.value,
        subCategory: subCategory.value
      });
    });
  }

  auth.onAuthStateChanged(user => {
    if (user) {
      user.getIdTokenResult().then(idTokenResult => {
        //admin
        if (idTokenResult.claims.user_id == '90EDQaY9IcQgQERUgvlAxkNDHlv2') {
          console.log('admin on board: ', user);
          //regular user
        } else {
          console.log('Regular user logged in: ', user);
        }
      });
      //logout
    } else {
      console.log('user logged out: ');
    }
  });

  const signupForm = document.querySelector('#signup-form');
  if (signupForm != null) {
    signupForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = signupForm['signup-email'].value;
      const password = signupForm['signup-password'].value;

      // sign up user
      const auth = firebase.auth();
      console.log('user signed up');
      auth.createUserWithEmailAndPassword(email, password).then(cred => {
        console.log(cred);
      });
    });
  }

  //log in, check if button/form even exists on this page
  const loginForm = document.querySelector('#login-form');
  if (loginForm != null) {
    loginForm.addEventListener('submit', e => {
      const auth = firebase.auth();
      e.preventDefault();
      const email = loginForm['login-email'].value;
      const password = loginForm['login-password'].value;

      auth.signInWithEmailAndPassword(email, password).then(cred => {
        console.log('user logged in');
        window.location.href = 'admin.html';
      });
    });
  }

  //log out form check if button/form even exists on this page
  const logout = document.querySelector('#logout');
  if (logout != null) {
    logout.addEventListener('click', e => {
      const auth = firebase.auth();
      e.preventDefault();
      auth.signOut();
      window.location.href = 'index.html';
    });
  }
  // end document loaded
});
