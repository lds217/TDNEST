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


if(document.readyState == "loading"){
    document.addEventListener("DOMContentLoaded",ready);
}
else
{
    ready();
}


function ready(){
    document.getElementsByClassName('btn-today')[0].addEventListener('click',buyButtonClicked);
}



// buy button 


async function buyButtonClicked(event)
{
      let events=[];
      let Name = document.getElementById("name").value;
      let Pass = document.getElementById("pwd").value;
      let ok=0;
      await axios.post('/api/users', {Name,Pass})
      .then(function (response) {
        ok=response.data;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
      console.log(ok);
      if(ok==0)
      {
           Swal.fire({
            title: "Sai thông tin",
            text: "Vui lòng quay lại tên hoặc mật khẩu",
            icon: "error"
          });
        return;
      }
  
       await axios.post('/api/add-event-list', {Name})
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
    {
           //console.log(events[i].id);
        var ordersBox = document.createElement("div");
        ordersBox.classList.add('order-box');
        var orders = document.getElementsByClassName('orders')[0];
          var ordersContent = `<div> "${events[i].id}"<\div>`
          ordersBox.innerHTML = ordersContent;
          orders.append(ordersBox);

    }
      
}



// function saveCartItems(){
//     var cartContent = document.getElementsByClassName('cart-content')[0];
//     var cartBoxes = cartContent.getElementsByClassName('cart-box');
//     var cartItems = [];
//     for(var i = 0; i< cartBoxes.length;i++)
//     {
//         var cartBox = cartBoxes[i];
//         var cartItemsName = cartBox.getElementsByClassName('cart-product-title')[0];
//         var cartItemsPrice = cartBox.getElementsByClassName('cart-price')[0];
//         var cartItemsQuantity= cartBox.getElementsByClassName('cart-quantity')[0];
//         var cartItemsImg= cartBox.getElementsByClassName('cart-img')[0].src;

//         var Item = {
//             title : cartItemsName.innerText,
//             price : cartItemsPrice.innerText,
//             quantity : cartItemsQuantity.value,
//             img : cartItemsImg,
//         }
//         cartItems.push(Item);
//         console.log(cartItemsImg);
//     }
    
//     localStorage.setItem('cartItems', JSON.stringify(cartItems));
// }

// function loadCartItems()
// {
//     var cartItems =  localStorage.getItem('cartItems');
//     if(cartItems)
//     {
//         cartItems = JSON.parse(cartItems);
//         for(var i=0; i<cartItems.length; i++)
//         {
//             var item = cartItems[i];
//             console.log(item.title, item.price,  item.img);
//             addProductToCart(item.title, item.price, item.img);
//             var cartBoxes = document.getElementsByClassName('cart-box');
//             var cartBox = cartBoxes[cartBoxes.length - 1];
//             var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
//             quantityElement.value = item.quantity;
//         }
//     }
// }

// function addProductToCart(title, price, productImg)
// {
//     var cartShopBox = document.createElement("div");
//     cartShopBox.classList.add('cart-box');
//     var cartItems = document.getElementsByClassName('cart-content')[0];
//     var cartItemsNames = document.getElementsByClassName('cart-product-title');
//     for(var i =0; i < cartItemsNames.length; i++)
//     {
//         if(title.toUpperCase() == cartItemsNames[i].innerText.toUpperCase()){
//             alert("Bạn đã có sản phẩm này trong giỏ hàng");
//             return;
//         }
//     }
//     var cartBoxContent = `
//                             <img src="${productImg}" alt="" class="cart-img">
//                             <div class="detail-box">
//                                 <div class="cart-product-title">${title}</div>
//                                 <div class="cart-price">${price}</div>
//                                 <input type="number" value="1" class="cart-quantity">
//                             </div>
//                             <!-- remove cart -->
//                             <i class="bx bxs-trash-alt cart-remove"></i>
//                         `
//         cartShopBox.innerHTML = cartBoxContent;
//         cartItems.append(cartShopBox);
//         cartShopBox.getElementsByClassName('cart-remove')[0].addEventListener('click',removeCartItem);
//         cartShopBox.getElementsByClassName('cart-quantity')[0].addEventListener('change',quantityChanged);
//         updatetotal();
// }
// function removeCartItem(event)
// {
//     var buttonClicked = event.target;
//     buttonClicked.parentElement.remove();
    
//     updatetotal();
//     saveCartItems();

// }

//update total
// function updatetotal()
// {
//     var cartContent = document.getElementsByClassName("cart-content")[0];
//     var cartBoxes = cartContent.getElementsByClassName("cart-box");
//     total = 0;
//     var Quantity = 0;
//     for(var i = 0; i< cartBoxes.length; i++)
//     {
//         var cartBox = cartBoxes[i];
//         var priceElement = cartBox.getElementsByClassName("cart-price")[0];
//         var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
//         var price= parseFloat(priceElement.innerText.replace("k", ""));
//         var quantity = quantityElement.value;
//         Quantity += parseInt(quantity);
//         total = total + price * quantity;
//     }
//     document.getElementsByClassName("totalQuantity")[0].innerText= Quantity;
//     document.getElementsByClassName("total-price")[0].innerText= total + "k";
// }

window.onbeforeunload = function (e) {
    e = e || window.event;

    // For IE and Firefox prior to version 4
    if (e) {
        e.returnValue = 'Any string';
    }

    // For Safari
    return 'Any string';
};