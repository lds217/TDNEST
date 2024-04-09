////////////////GLOBAL VAR//////////////////////
    
var Name;
var number;
var address;
var datetime;
var total=0;

////////////////////////////////////////////////////
const TIMEOFFSET = '+07:00';
function uuidv4() {
    return "2107200505062006".replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }

function convert(date){
    var year = date.getYear();
    var month = date.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    var day = date.getDate();
    if (day < 10) {
        day = `0${day}`;
    }
    var hour = date.getHours();
    if (hour < 10) {
        hour = `0${hour}`;
    }
    var minute = date.getMinutes();
    if (minute < 10) {
        minute = `0${minute}`;
    }
    let startDate = `${year}-${month}-${day}T${hour}:${minute}:00.000${TIMEOFFSET}`;
    return  startDate;
}

//////////////////////////////////////////////////
var events=[];

if(document.readyState == "loading"){
    document.addEventListener("DOMContentLoaded",ready);
}
else
{
    ready();
}

async function checkAuth()
{
  console.log('hi');
   await axios.post('/check').then(function(response){
     console.log(response.data);
      if(response.data==false)
          window.location.href = "/login.html";
       else
         {
           console.log('You are signed in!');
         return;
         }
    });
  
    
}

function ready(){
    // checkAuth();
    document.getElementsByClassName('btn-custom')[0].addEventListener('click',buyButtonClicked);
}





async function buyButtonClicked(event)
{
  // checkAuth();
  var orders = document.getElementsByClassName('order-content')[0];
     while(orders.hasChildNodes())
    {
        orders.removeChild(orders.firstChild);
    }
    events=[];
    let  startDate = document.getElementById("startTime").value;
    let endDate = document.getElementById("endTime").value;
       await axios.post('/api/add-event-list', {startDate,endDate})
      .then(function (response) {
       // console.log(response.data);
        events=response.data;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });

        //console.log("erer");
       
    for(var i = 0; i< events.length;i++)
        addProductToOrder(events[i].Name, events[i].number, events[i].cartItems.length+1);
  
      const buttons = document.querySelectorAll('.next');

    // Loop through each button and add event listener
    buttons.forEach((button, index) => {
        button.addEventListener('click', () => {
            prepareToAddToCart(index);
        });
    });
  
}


function addProductToOrder(title, number, amount)
{
    var cartShopBox = document.createElement("div");
    cartShopBox.classList.add('cart-box');
    var cartItems = document.getElementsByClassName('order-content')[0];
    var cartItemsNames = document.getElementsByClassName('cart-product-title');
    var cartBoxContent = `
                            <div class="detail-box">
                                <div class="cart-product-title">${title}</div>
                                <div class="cart-price">${number}</div>
                                <div class="cart-price">${amount}</div>
                            </div>
                            <!-- remove cart -->
                            <i class="fa-solid fa-arrow-right next"></i>
                        `
        cartShopBox.innerHTML = cartBoxContent;
        cartItems.append(cartShopBox);
}

function prepareToAddToCart(index)
{
    let orders = document.getElementsByClassName('cart-content')[0];
     while(orders.hasChildNodes())
    {
        orders.removeChild(orders.firstChild);
    }
  let title = document.getElementsByClassName('title')[0];
  while(title.hasChildNodes())
    {
      title.removeChild(title.firstChild);
    }
  var titlediv = document.createElement("div");
    titlediv.classList.add('title-box');
  let titlecontent=`<p>${events[index].Name}</p>
              <p>${events[index].number}</p>
              <p>${events[index].address}</p>
              <p>${events[index].datetime}</p>`
  titlediv.innerHTML= titlecontent;
  title.append(titlediv);
  let order = events[index];
  console.log(order.cartItems[0]);
  for(var i=0;i<order.cartItems.length;i++)
    {
      addProductToCart(order.cartItems[i].title, order.cartItems[i].price, order.cartItems[i].img,order.cartItems[i].quantity );
    }
}

function addProductToCart(title, price, productImg, quantity)
{
    var cartShopBox = document.createElement("div");
    cartShopBox.classList.add('cart-box');
    var cartItems = document.getElementsByClassName('cart-content')[0];
    var cartItemsNames = document.getElementsByClassName('cart-product-title');
    var cartBoxContent = `
                            <img src="${productImg}" alt="" class="cart-img">
                            <div class="detail-box">
                                <div class="cart-product-title">${title}</div>
                                <div class="cart-price">${price}</div>
                                <input type="number" value="${quantity}" class="cart-quantity">
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

function quantityChanged(event)
{
    var input=event.target;
    if(isNaN(input.value)|| input.value <= 0){
        input.value=1;
    }
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
    document.getElementsByClassName("total-price")[0].innerText= total + "k";
}

// window.onbeforeunload = function (e) {
//     e = e || window.event;

//     // For IE and Firefox prior to version 4
//     if (e) {
//         e.returnValue = 'Any string';
//     }

//     // For Safari
//     return 'Any string';
// };