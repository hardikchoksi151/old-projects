// FUNCTIONS FOR NAVIGATION
function visitHome() {
    window.location.href = "index.html";
}
function visitAddProduct() {
    window.location.href = "product-form.html";
}
function visitCart() {
    window.location.href = "cart.html";
}

// OBJECTS
function Product(productId, name, image, description, price) {
    this.productId = productId;
    this.name = name;
    this.image = image;
    this.description = description;
    this.price = price;
}

function StockObject(productId, productQuantity) {
    this.productId = productId;
    this.productQuantity = productQuantity;
}

function CartObject(productId, image, productName, productPrice, productCartQuantity, total) {
    this.productId = productId;
    this.image = image;
    this.productName = productName;
    this.productPrice = productPrice;
    this.productCartQuantity = productCartQuantity;
    this.total = total;
}

// GLOBAL VARIABLES
var stock = [];
var products = [];
var cart = [];

// HELPER FUNCTIONS
// FUNCTION TO GENERATE UUID
function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

// FUNCTION TO GENERATE TEMPLATE
function getCardTemplate(productId, name, image, description, price) {
    return `<div id="card-${productId}" class="card">
                    <img id="card-image-${productId}" src="${image}" alt="Product">
                    <div id="card-name-${productId}" class="name">${name}</div>
                    <span class="warning"></span>
                    <hr class="divider">
                    <div id="card-description-${productId}" class="description">
                        ${description}
                    </div>
                    <div class="price-cart-container">
                        <div id="card-price-${productId}" class="price">$${price}</div>
                        <div><button  productId="${productId}" onclick="addToCart(this)">Add to Cart</button></div>
                    </div>
    </div>`;
}

function getCartItemTemplate(productId, image, productName, productPrice, productCartQuantity, total) {
    return ` <div id="item-container-${productId}" class="item-container">
    <div class="item">
        <img src="${image}"
            alt="product">
        <div class="item-desc">
            <h3>${productName}</h3>
            <span class="warning"></span>
        </div>
    </div>
    <div class="price">
        <h4>$${productPrice}</h4>
    </div>
    <div class="quantity">
        <button class="quantity-btn" productId="${productId}" onclick=onCartPlusBtn(this)><i class="fa-solid fa-plus"></i></button>
        <h4>${productCartQuantity}</h4>
        <button class="quantity-btn" productId="${productId}" onclick=onCartMinusBtn(this)><i class="fa-solid fa-minus"></i></button>
    </div>
    <div id="total-${productId}" class="total">
        <h4>$${total}</h4>
    </div>
</div>`;
}

function getData() {
    products = JSON.parse(localStorage.getItem('products'));
    stock = JSON.parse(localStorage.getItem('stock'));
    cart = JSON.parse(localStorage.getItem('cart'));
    console.log('data loaded');
    if (products == null) products = [];
    if (stock == null) stock = [];
    if (cart == null) cart = [];
    console.log('Products ', products);
    console.log('stock', stock);
    console.log('cart', cart);
}

getData();

function showData() {
    products.map(function (p) {
        let temp = getCardTemplate(p.productId, p.name, p.image, p.description, p.price);
        document.querySelector(".products").innerHTML += temp;
    });
}

// function addToCart(btn) {
//     let id = btn.getAttribute("productId");
//     let image = document.querySelector(`#card-image-${id}`).getAttribute('src');
//     let productName = document.querySelector(`#card-name-${id}`).innerHTML;
//     let productPrice = document.querySelector(`#card-price-${id}`).innerHTML.substring(1);
//     let productCartQuantity = 1;
//     let total = parseFloat(productPrice) * productCartQuantity;
//     const cartObject = new CartObject(id, image, productName, productPrice, productCartQuantity, total);

//     stock.forEach(e => {
//         if (e.productId == id) {
//             if (e.productQuantity <= 0) {
//                 document.querySelector(`#card-${id} span.warning`).innerHTML = "Oops, This Product is out of the stock!";
//                 return;
//             } else {
//                 cart.forEach(c => {
//                     if (c.productId === id) {
//                         c.productCartQuantity = parseInt(c.productCartQuantity) + 1;
//                         alert(c.productCartQuantity);
//                         e.productQuantity = parseInt(e.productCartQuantity) - 1;
//                         alert(e.productCartQuantity);
//                         localStorage.setItem('cart', JSON.stringify(cart));
//                         localStorage.setItem('stock', JSON.stringify(stock));
//                         return;
//                     }
//                 });
//                 cart.push(cartObject);
//                 e.productQuantity = parseInt(e.productCartQuantity) - 1;
//                 localStorage.setItem('cart', JSON.stringify(cart));
//                 localStorage.setItem('stock', JSON.stringify(stock));
//                 return;
//             }
//         }
//     })
// }

function addToCart(btn) {
    const id = btn.getAttribute('productId');
    let flag = false;

    cart.forEach(c => {
        if (c.productId === id) {
            flag = true;

            stock.forEach(s => {
                if (s.productId === id) {
                    if (parseInt(s.productQuantity) >= 1) {
                        s.productQuantity = parseInt(s.productQuantity) - 1;
                        c.productCartQuantity = parseInt(c.productCartQuantity) + 1;
                        c.total = parseInt(c.productPrice) * c.productCartQuantity;
                    } else {
                        document.querySelector(`#card-${id} span.warning`).innerHTML = "Oops, This Product is out of stock!";
                        return;
                    }
                }
            });

            // alert(parseInt(c.productCartQuantity))

        }
    });

    if (!flag) {
        let image = document.querySelector(`#card-image-${id}`).getAttribute('src');
        let productName = document.querySelector(`#card-name-${id}`).innerHTML;
        let productPrice = parseFloat(document.querySelector(`#card-price-${id}`).innerHTML.substring(1));
        let productCartQuantity = 1;
        let total = productPrice * productCartQuantity;
        const cartObject = new CartObject(id, image, productName, productPrice, productCartQuantity, total);

        stock.forEach(s => {
            if (s.productId === id) {
                if (parseInt(s.productQuantity) >= 1) {
                    s.productQuantity = parseInt(s.productQuantity) - 1;
                    cart.push(cartObject);
                } else {
                    document.querySelector(`card-${id} span.warning`).innerHTML = "Oops, This Product is out of stock!";
                    return;
                }
            }
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('stock', JSON.stringify(stock));
    return;
}

function populateCartPage() {
    console.log("populating cart page...");
    let subtotal = 0;
    let count = 0;
    cart.forEach(e => {
        count++;
        subtotal += e.total;
        let temp = getCartItemTemplate(e.productId, e.image, e.productName, e.productPrice, e.productCartQuantity, e.total);
        document.querySelector('.t-body').innerHTML += temp;
    });

    document.querySelector('.cart-container h2').innerHTML = `Your Cart(${count} Items)`
    document.querySelector('.row .sub-total .second').innerHTML = `$${subtotal}`;
    document.querySelector('#grand-total').innerHTML = `$${subtotal}`;
}

function updateBill() {

    let subtotal = 0;

    cart.forEach(e => {
        subtotal += e.total;
    })

    document.querySelector('.row .sub-total .second').innerHTML = `$${subtotal}`;
    document.querySelector('#grand-total').innerHTML = `$${subtotal}`;
}

function onCartPlusBtn(btn) {
    let id = btn.getAttribute('productId');
    let h4 = document.querySelector(`#item-container-${id} .quantity h4`);
    let n = parseInt(h4.innerHTML);
    let stockQuantity;

    stock.forEach(e => {
        if (e.productId === id) {
            stockQuantity = e.productQuantity;
        }
    });

    if (stockQuantity === 0) {
        document.querySelector(`#item-container-${id} .item .item-desc span.warning`).innerHTML = "Oops, This Product is out of the stock!";
        return;
    }

    cart.forEach(e => {
        if (e.productId == id) {
            e.productCartQuantity++;
            e.total = parseFloat(e.total) + parseFloat(e.productPrice);
            document.querySelector(`#total-${id}`).innerHTML = `<h4>$${e.total}</h4>`
        }
    });

    stock.forEach(e => {
        if (e.productId === id) {
            // alert(e.productQuantity);
            e.productQuantity--;
            // alert(e.productQuantity);
        }
    });

    localStorage.setItem('stock', JSON.stringify(stock));
    localStorage.setItem('cart', JSON.stringify(cart));
    h4.innerHTML = ++n;
    updateBill();
}

function onCartMinusBtn(btn) {
    let id = btn.getAttribute('productId');
    let h4 = document.querySelector(`#item-container-${id} .quantity h4`);
    let n = parseInt(h4.innerHTML);

    if (n === 1) {
        console.log(n);
        document.querySelector(`#item-container-${id}`).remove();

        cart = cart.filter(e => {
            return e.productId != id;
        })

        localStorage.setItem('cart', JSON.stringify(cart));

    }

    cart.forEach(e => {
        if (e.productId == id) {
            e.productCartQuantity--;
            e.total = parseFloat(e.total) - parseFloat(e.productPrice);
            document.querySelector(`#total-${id}`).innerHTML = `<h4>$${e.total}</h4>`
        }
    });

    stock.forEach(e => {
        if (e.productId === id) {
            e.productQuantity++;
        }
    })

    localStorage.setItem('stock', JSON.stringify(stock));
    localStorage.setItem('cart', JSON.stringify(cart));
    h4.innerHTML = --n;
    updateBill();
}

function checkOut() {
    cart.forEach(e => {
        let id = e.productId;

        // stock = stock.filter(s => {
        //     return id !== s.productId;
        // })

        stock.forEach(s => {
            if (s.productId === id) {
                if (s.productQuantity == 0) {
                    stock = stock.filter(ss => ss.productId !== id);

                    products = products.filter(p => id !== p.productId);
                }
            }
        });

    });

    cart = [];

    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('stock', JSON.stringify(stock));

    document.querySelector('.t-body').innerHTML = "";

    populateCartPage();
}

function main() {
    jQuery.fn.ForNumberOnly = function () {
        $(this).keydown(function (e) {
            let key = e.charCode || e.keyCode || 0;

            return (
                key == 8 ||
                key == 13 ||
                key == 9 ||
                key == 110 ||
                key == 46 ||
                key == 190 ||
                (key >= 35 && key <= 40) ||
                (key >= 48 && key <= 57) ||
                (key >= 96 && key <= 105)
            );
        })
    }

    // ADD PRODUCT & FORM VALIDATION
    let image = "";
    $("#image-link").change(function (e) {
        temp = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(temp);
        reader.addEventListener('load', function () {
            image = reader.result;
        })
    });

    $("#add-product-btn").click(function () {
        let productName = $("#name");
        let productDescription = $("#description");
        let productPrice = $("#price");
        let productQuantity = $("#quantity");
        let imageLink = $("#image-link");

        if (productName.val() == "") {
            if (productName.next().length == 0) {
                let temp = '<span class="warning">*Please Enter Product Name</span>';
                $(".form-wrapper-body>div:nth-child(1)").append(temp);
            }
        } else {
            $(".form-wrapper-body>div:nth-child(1)>span").remove();
            if (productName.val().length < 3) {
                let temp = '<span class="warning">*Product Name should be atleast 3 character long.</span>';
                $(".form-wrapper-body>div:nth-child(1)").append(temp);
            }
        }

        if (productPrice.val() == "") {
            if (productPrice.next().length == 0) {
                let temp =
                    '<span class="warning">*Please Enter Product Price</span>';
                $(".form-wrapper-body>div:nth-child(3)").append(temp);
            }
        } else {
            $(".form-wrapper-body>div:nth-child(3)>span").remove();
        }

        if (image == "") {
            if (imageLink.next().length == 0) {
                let temp =
                    '<span class="warning">*Please Choose an Image</span>';
                $(".form-wrapper-body>div:nth-child(5)").append(temp);
            }
        } else {
            $(".form-wrapper-body>div:nth-child(5)>span").remove();
        }

        if (productName.val() != "" && productPrice != "" && image != "") {
            if (productQuantity.val() == "") {
                productQuantity.val("1");
            }

            let productId = create_UUID();


            let product = new Product(productId, productName.val(), image, productDescription.val(), productPrice.val());
            let stockObject = new StockObject(productId, parseInt(productQuantity.val()));
            console.log(stockObject.productQuantity);

            products.push(product);
            stock.push(stockObject);

            localStorage.setItem('products', JSON.stringify(products));
            localStorage.setItem('stock', JSON.stringify(stock));

            productName.val('');
            productDescription.val('');
            productPrice.val('');
            productQuantity.val('');
            imageLink.val('');
        }
    });

    $("#price").ForNumberOnly();

    $("#quantity").ForNumberOnly();

}


$(document).ready(main);