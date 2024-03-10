//Cart
let cartIcon = document.querySelector('#cart-icon')
let cart = document.querySelector('.cart')
let closeCart = document.querySelector('#close-cart')
// open cart
cartIcon.onclick = () =>{
    cart.classList.add('active');
};

var total=0;
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
// making function
function ready(){
    // remove Items from cart
    var removeCartButtons = document.getElementsByClassName('cart-remove');
    console.log(removeCartButtons);
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

    //Add to cart
    var addCart = document.getElementsByClassName('add-cart');
    for(var i =0; i < addCart.length; i++)
    {
        var button = addCart[i];
        button.addEventListener('click', addCartClicked);

    }

    // buy button
    document.getElementsByClassName('btn-buy')[0].addEventListener('click',buyButtonClicked);
}

// buy button 
function buyButtonClicked(event)
{
    alert("ban da mua " + total + "k");
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
    //console.log(alertMsg);
    updatetotal();
}

function quantityChanged(event)
{
    var input=event.target;
    if(isNaN(input.value)|| input.value <= 0){
        input.value=1;
    }
    updatetotal();
}

function addCartClicked(event)
{
    var button = event.target;
    var shopProducts = button.parentElement;
    var title = shopProducts.getElementsByClassName('product-title')[0].innerText;
    var price = shopProducts.getElementsByClassName('price')[0].innerText;
    var productImg = shopProducts.getElementsByClassName('product-img')[0].src;
    console.log(title, price, productImg);
    addProductToCart(title, price, productImg);
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