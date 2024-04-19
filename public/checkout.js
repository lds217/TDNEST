////////////////GLOBAL VAR//////////////////////
    
var Name;
var number;
var address;
var datetime;
var total=0;
var otherCaption;

  ///////////////////////////////////////////////////
 //          THIS AREA IS FOR MY MEO MEO          //
///////////////////////////////////////////////////

function checkNum(str)
{
  for(var i = 0 ;i<str.length; i++)
    if(str[i]<'0'||str[i]>'9')
        return false;
  return true;
}

// Create or update data
async function saveData() {
  var cartItems =  localStorage.getItem('cartItems');
  cartItems = JSON.parse(cartItems);
  console.log(cartItems);
  var uid = number+uuidv4();
  otherCaption = document.getElementById('otherCaption').value;
  console.log(otherCaption);
  if (cartItems) {
       // post firebase
      var status = "Ordered";
      await axios.post('/api/data' , { Name, number, address, datetime, cartItems, total, uid, otherCaption, status });
      // post calendar
      let date = new Date(datetime);
      let startDate = date.toISOString();
      datetime = date.getTime() + 30 * 60 * 1000;
      date = new Date(datetime);
      let endDate = date.toISOString();
      console.log(startDate,endDate);
      ///////////////////////////////////////
      await axios.post('/api/add-event' , { Name, number, address, datetime, cartItems, total, uid, startDate,endDate, otherCaption, status });
      ////////////////////////////////////////
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
    }
  }



if(document.readyState == "loading"){
    document.addEventListener("DOMContentLoaded",ready);
}
else
{
    ready();
}


function ready(){

    //reload from local storage
    //localStorage.clear();
    if(localStorage["cartItems"]){
        console.log("co rui");
        loadCartItems();
        updatetotal();
        console.log(total);
    }
  var caption = document.getElementsByClassName('caption');
    for(var i =0; i < caption.length; i++)
    {
        var cap = caption[i];
        cap.addEventListener("change", saveCartItems);

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

    document.getElementsByClassName('btn-buy')[0].addEventListener('click',buyButtonClicked);
}



// buy button 


function buyButtonClicked(event)
{
    Name = document.getElementById("name").value;
    number = document.getElementById("phone").value;
    address = document.getElementById("address").value;
    datetime = document.getElementById("deliveryTime").value;
    var cool= document.getElementById("cool").value;
    var notcool= document.getElementById("notcool").value;
    updatetotal();
    //datetime > now + 4 tiếng 
    if(total == 0)
    {
        Swal.fire({
            title: "Vỏ hàng trống",
            text: "Vui lòng quay lại để chọn hàng",
            icon: "error"
          });
        return;
    }
    if(cool || notcool){
      return;
    }
    if(!Name || !number || !address || !datetime)
    {
        Swal.fire({
            title: "Thiếu thông tin",
            text: "Vui lòng nhâp lại",
            icon: "error"
          });
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
    saveData();
    saveCartItems();
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
        var cartItemsCap= cartBox.getElementsByClassName('caption')[0].value;
        var Item = {
            title : cartItemsName.innerText,
            price : cartItemsPrice.innerText,
            quantity : cartItemsQuantity.value,
            img : cartItemsImg,
            cap : cartItemsCap
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
            addProductToCart(item.title, item.price, item.img, item.cap);
            var cartBoxes = document.getElementsByClassName('cart-box');
            var cartBox = cartBoxes[cartBoxes.length - 1];
            var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
            quantityElement.value = item.quantity;
        }
    }
}

function addProductToCart(title, price, productImg, cap)
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
                                <textarea class="caption" placeholder ="Chú thích">${cap}</textarea>
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
    var Quantity = 0;
    for(var i = 0; i< cartBoxes.length; i++)
    {
        var cartBox = cartBoxes[i];
        var priceElement = cartBox.getElementsByClassName("cart-price")[0];
        var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
        var price= parseFloat(priceElement.innerText.replace("k", ""));
        var quantity = quantityElement.value;
        Quantity += parseInt(quantity);
        total = total + price * quantity;
    }
    document.getElementsByClassName("totalQuantity")[0].innerText= Quantity;
    document.getElementsByClassName("total-price")[0].innerText= total + "k";
}
