
import {Add} from '/firebase.js'

/////////////////////////////////////////////////////////////////////////////////////////////////////////

//Cart
let cartIcon = document.querySelector('#cart-icon')
let cart = document.querySelector('.cart')
let closeCart = document.querySelector('#close-cart')
// open cart
cartIcon.onclick = () =>{
    cart.classList.add('active');
};


// close cart
closeCart.onclick = () =>{
    cart.classList.remove('active');
};
//cart working
if(document.readyState == "loading"){
    document.addEventListener("DOMContentLoaded",ready);
}
else
{
    ready();
}

var total=0;
// making function
function ready(){

    //reload from local storage
    //localStorage.clear();
    if(localStorage["cartItems"]){
        console.log("co rui");
        loadCartItems();
        updatetotal();
        console.log(total);
    }

    // remove Items from cart
    var removeCartButtons = document.getElementsByClassName('cart-remove');
    console.log(total);
    for(var i =0; i < removeCartButtons.length; i++){
        var button = removeCartButtons[i];
        button.addEventListener("click", removeCartItem);
    }
    //Quantity change
    var quantityInputs = document.getElementsByClassName('cart-quantity');
    for(var i =0; i < quantityInputs.length; i++){
        var input = quantityInputs[i];
        input.addEventListener("change", quantityChanged);
    }
    console.log(total);
    //Add to cart
    var addCart = document.getElementsByClassName('add-cart');
    for(var i =0; i < addCart.length; i++)
    {
        var button = addCart[i];
        button.addEventListener('click', addCartClicked);

    }
    console.log(total);
    // buy button
    document.getElementsByClassName('btn-buy')[0].addEventListener('click',buyButtonClicked);
}

var Email;

// buy button 
function buyButtonClicked(event)
{
    updatetotal();
    console.log(total);
    if(total == 0)
    {
        alert("Giỏ hàng đang trống");
        return;
    }
    var cartContent = document.getElementsByClassName('cart-content')[0];
    var cartItemsNames = document.getElementsByClassName('cart-product-title');
    var cartItemsPrices = document.getElementsByClassName('cart-price');
    var cartItemsQuantity= document.getElementsByClassName('cart-quantity');
    var alertMsg = "";
    for(var i = 0; i< cartItemsNames.length;i++)
        alertMsg += cartItemsNames[i].innerText +" " + cartItemsPrices[i].innerText+ " "+ cartItemsQuantity[i].value+"\n";  
    while(cartContent.hasChildNodes())
    {
        cartContent.removeChild(cartContent.firstChild);
    }
    alert("BẠN VỪA MỚI MUA\n" + alertMsg);
    console.log(alertMsg);

    
    notification();
    
}


async function notification()
{
    
    const {value : Email} = await Swal.fire({
        input: "email",
        inputLabel: "Địa chỉ Email",
        inputPlaceholder: "Nhập địa chỉ email của bạn"
      });
      if (Email) {
        Swal.fire(`${Email}`);
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title: "Đặt hàng thành công!"
          });
        var cartItems =  localStorage.getItem('cartItems');
            Add(cartItems,total,Email);
        
            saveCartItems();
    updatetotal();
 
    } 
   
}

function quantityChanged(event)
{
    var input=event.target;
    if(isNaN(input.value)|| input.value <= 0){
        input.value=1;
    }
    updatetotal();
    saveCartItems();
}

function addCartClicked(event)
{
    var button = event.target;
    var shopProducts = button.parentElement;
    var title = shopProducts.getElementsByClassName('product-title')[0].innerText;
    var price = shopProducts.getElementsByClassName('price')[0].innerText;
    var productImg = shopProducts.getElementsByClassName('product-img')[0].src;
    console.log(title, price, productImg);
    addProductToCart(title, price,productImg);
    saveCartItems();
}

function saveCartItems(){
    var cartContent = document.getElementsByClassName('cart-content')[0];
    var cartBoxes = cartContent.getElementsByClassName('cart-box');
    var cartItems = [];
    for(var i = 0; i< cartBoxes.length;i++)
    {
        var cartBox = cartBoxes[i];
        var cartItemsName = cartBox.getElementsByClassName('cart-product-title')[0];
        var cartItemsPrice = cartBox.getElementsByClassName('cart-price')[0];
        var cartItemsQuantity= cartBox.getElementsByClassName('cart-quantity')[0];
        var cartItemsImg= cartBox.getElementsByClassName('cart-img')[0].src;

        var Item = {
            title : cartItemsName.innerText,
            price : cartItemsPrice.innerText,
            quantity : cartItemsQuantity.value,
            img : cartItemsImg,
        }
        cartItems.push(Item);
        console.log(cartItemsImg);
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function loadCartItems()
{
    var cartItems =  localStorage.getItem('cartItems');
    if(cartItems)
    {
        cartItems = JSON.parse(cartItems);
        for(var i=0; i<cartItems.length; i++)
        {
            var item = cartItems[i];
            console.log(item.title, item.price,  item.img);
            addProductToCart(item.title, item.price, item.img);
            var cartBoxes = document.getElementsByClassName('cart-box');
            var cartBox = cartBoxes[cartBoxes.length - 1];
            var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
            quantityElement.value = item.quantity;
        }
    }
}

function addProductToCart(title, price, productImg)
{
    var cartShopBox = document.createElement("div");
    cartShopBox.classList.add('cart-box');
    var cartItems = document.getElementsByClassName('cart-content')[0];
    var cartItemsNames = document.getElementsByClassName('cart-product-title');
    for(var i =0; i < cartItemsNames.length; i++)
    {
        if(title.toUpperCase() == cartItemsNames[i].innerText.toUpperCase()){
            alert("Bạn đã có sản phẩm này trong giỏ hàng");
            return;
        }
    }
    var cartBoxContent = `
                            <img src="${productImg}" alt="" class="cart-img">
                            <div class="detail-box">
                                <div class="cart-product-title">${title}</div>
                                <div class="cart-price">${price}</div>
                                <input type="number" value="1" class="cart-quantity">
                            </div>
                            <!-- remove cart -->
                            <i class="bx bxs-trash-alt cart-remove"></i>
                        `
        cartShopBox.innerHTML = cartBoxContent;
        cartItems.append(cartShopBox);
        cartShopBox.getElementsByClassName('cart-remove')[0].addEventListener('click',removeCartItem);
        cartShopBox.getElementsByClassName('cart-quantity')[0].addEventListener('change',quantityChanged);
        updatetotal();
}
function removeCartItem(event)
{
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    
    updatetotal();
    saveCartItems();

}

//update total
function updatetotal()
{
    var cartContent = document.getElementsByClassName("cart-content")[0];
    var cartBoxes = cartContent.getElementsByClassName("cart-box");
    total = 0;
    for(var i = 0; i< cartBoxes.length; i++)
    {
        var cartBox = cartBoxes[i];
        var priceElement = cartBox.getElementsByClassName("cart-price")[0];
        var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
        var price= parseFloat(priceElement.innerText.replace("k", ""));
        var quantity = quantityElement.value;
        total = total + price * quantity;
    }
    document.getElementsByClassName("total-price")[0].innerText= total + "k";
}




  