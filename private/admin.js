////////////////GLOBAL VAR//////////////////////
    
var Name;
var number;
var address;
var datetime;
var total=0;
var curOrderIndex;
var otherCaption;
  ///////////////////////////////////////////////////
 //          THIS AREA IS FOR MY MEO MEO          //
///////////////////////////////////////////////////
var events=[];

if(document.readyState == "loading"){
    document.addEventListener("DOMContentLoaded",ready);
}
else
{
    ready();
}

window.addEventListener('DOMContentLoaded', () => {
  // Make an AJAX request to check authentication status
  fetch('/ ')
    .then(response => {
      if (response.ok) {
        // User is authenticated, do nothing
      } else {
        // User is not authenticated, redirect to login page
        window.location.href = '/login.html';
      }
    })
    .catch(error => console.error('Error:', error));
});

window.onbeforeunload = function (e) {
    e = e || window.event;
    if (e) {
        e.returnValue = 'Any string';
    }
    return 'Any string';
};

function ready(){
    // checkAuth();
    var removeCartButtons = document.getElementsByClassName('cart-remove');
    console.log(total);
    for(var i =0; i < removeCartButtons.length; i++){
        var button = removeCartButtons[i];
        button.addEventListener("click", removeCartItem);
    }
   document.getElementsByClassName('btn-add')[0].addEventListener('click',addButtonClicked);
    document.getElementsByClassName('btn-custom')[0].addEventListener('click',customButtonClicked);
    document.getElementsByClassName('btn-today')[0].addEventListener('click',todayButtonClicked);
   document.getElementsByClassName('btn-show')[0].addEventListener('click',showButtonClicked);
}

async function showButtonClicked(event)
{
  let prods;
  await axios.post('/api/show-prod')
      .then(function (response) {
       // console.log(response.data);
        prods=response.data;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  console.log(prods);
  for(let i = 0 ; i < prods.length; i++)
      addProdBox(prods[i].img, prods[i].name, prods[i].price,prods[i].cap,prods[i].id);
  
}

function addProdBox(img, name, price, cap, id)
{
  var cartShopBox = document.createElement("div");
    cartShopBox.classList.add('cart-box');
    var cartItems = document.getElementsByClassName('prod-content')[0];
    var cartBoxContent = `
                            
              <img src="${img}" alt="" class="cart-img">
              <div class="detail-box">
                  <div class="cart-product-title">${name}</div>
                  <div class="cart-product-title">${id}</div>
                  <div class="cart-price">${price}</div>
                  </div>
            <div> </div>
            <div> 
              <i class="bx bxs-trash-alt prod-remove"></i>
              <i class="bx bxs-edit-alt prod-edit" ></i>
              </div>
                        `
        cartShopBox.innerHTML = cartBoxContent;
        cartItems.append(cartShopBox);
}

async function todayButtonClicked(event)
{
  // checkAuth();
  var orders = document.getElementsByClassName('order-content')[0];
     while(orders.hasChildNodes())
    {
        orders.removeChild(orders.firstChild);
    }
    events=[];
    var today =new Date();
    let month = today.getMonth()+1;
    let day = today.getDate();
    let year = today.getFullYear();
    if(month<10)  month = "0"+month;
    if(day<10)  day = "0"+day;
    let  startDate = year +"-"+ month +"-"+day+"T00:01";
    let endDate = year +"-"+ month +"-"+day+"T23:59";
       await axios.post('/api/add-event-list', {startDate,endDate})
      .then(function (response) {
       // console.log(response.data);
        events=response.data;
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
    if(events.length==0)
      {
        Swal.fire({
          title: "Lỗi!",
          text: "Bạn không có đơn hàng nào trong thời gian này",
          icon: "error"
        });
        return;
      }
        //console.log("erer");
       
    for(var i = 0; i< events.length;i++)
        addProductToOrder(events[i].Name, events[i].number, events[i].cartItems.length, events[i].status,events[i].datetime);
  
      const buttons = document.querySelectorAll('.next');

    // Loop through each button and add event listener
    buttons.forEach((button, index) => {
        button.addEventListener('click', () => {
            prepareToAddToCart(index);
        });
    });
}


async function customButtonClicked(event)
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
    if(events.length==0)
      {
        Swal.fire({
          title: "Lỗi!",
          text: "Bạn không có đơn hàng nào trong thời gian này",
          icon: "error"
        });
        return;
      }
        //console.log("erer");
       
    for(var i = 0; i< events.length;i++)
        addProductToOrder(events[i].Name, events[i].number, events[i].cartItems.length, events[i].status,events[i].datetime);
  
      const buttons = document.querySelectorAll('.next');

    // Loop through each button and add event listener
    buttons.forEach((button, index) => {
        button.addEventListener('click', () => {
            prepareToAddToCart(index);
        });
    });
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
}


function addProductToOrder(title, number, amount, status, dateTime)
{
    var cartShopBox = document.createElement("div");
    cartShopBox.classList.add('cart-box-order');
    var cartItems = document.getElementsByClassName('order-content')[0];
    var cartItemsNames = document.getElementsByClassName('cart-product-title');
    var cartBoxContent = `
                            <div class="detail-box">
                                <div class="cart-product-title">${title}</div>
                                <div class="cart-price">${number}</div>
                                <div class="cart-price">${amount}</div>
                                <div class="cart-price">${dateTime}</div>
                            </div>
                            <i class="fa-solid fa-arrow-right next"></i>
                            <div class="statusOrder">${status}</div>
                        `
        cartShopBox.innerHTML = cartBoxContent;
        cartItems.append(cartShopBox);
}

function prepareToAddToCart(index)
{
  curOrderIndex = index;
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

  let titlecontent =`
                    <div class="form1">
                  <div class="group">
                      <label for="name">Họ và tên</label>
                      <input type="text" name="name" id="name">
                  </div>

                  <div class="group">
                      <label for="phone">Số điện thoại</label>
                      <input type="text" name="phone" id="phone">
                  </div>
                
                  <div class="group">
                      <label for="address">Địa chỉ</label>
                      <input type="text" name="address" id="address">
                  </div>
                   
                  <form action="/action_page.php">
                    <label for="deliveryTime">Thời gian giao hàng(*)</label>
                    <input type="datetime-local" id="deliveryTime" name="deliveryTime">
                  </form>
                <div class="group">
                      <label for="caption">Chú thích</label>
                      <input type="textarea"  rows="4" col="50" name="otherCaption" id="otherCaption">
                  </div>
                  <select id="orderStatus">
                     <option value="Ordered">Ordered</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Done">Done</option>
                   
                  </select>
              </div>
  `
 
  titlediv.innerHTML= titlecontent;
  title.append(titlediv);
  let order = events[index];
  document.getElementById("name").value = events[index].Name;
  document.getElementById("phone").value = events[index].number;
  document.getElementById("address").value = events[index].address;
  document.getElementById("deliveryTime").value = events[index].datetime;
  document.getElementById("otherCaption").value = events[index].otherCaption;
  document.getElementById("orderStatus").value = events[index].status;
  console.log(order.cartItems[0]);
  for(var i=0;i<order.cartItems.length;i++)
    {
      let last =0;
      if(i==order.cartItems.length-1)
          last=1;
      console.log(i, last);
      addProductToCart(order.cartItems[i].title, order.cartItems[i].price, order.cartItems[i].img,order.cartItems[i].quantity,order.cartItems[i].cap,last);
    }
  var cartItems = document.getElementsByClassName('cart-content')[0];
           let footerContent= `<div class="total">
                    <div class="total-title">Tổng</div>
                    <div class="total-price">0k</div>
                </div>
          <div class="btnGroup">
              <button class="btn-del">Xóa đơn</button>
              <button class="btn-save">Lưu đơn</button>
          </div>`
           var footer = document.createElement("div");
          footer.innerHTML = footerContent;
          cartItems.append(footer);
   document.getElementsByClassName('btn-del')[0].addEventListener('click',deleteOrder);
  document.getElementsByClassName('btn-save')[0].addEventListener('click',saveOrderClicked);
  updatetotal();
}

async function deleteOrder(event)
{
  Swal.fire({
  title: "Bạn có chắc chắn?",
  text: "Bạn sẽ không thể khôi phục lại đơn",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Có, XÓA đi"
}).then((result) =>  {
  if (result.isConfirmed) {
    Swal.fire({
      title: "Đã xóa!",
      text: "Đơn của bạn đã bị xóa",
      icon: "success"
    });
    var uid =events[curOrderIndex].uid
    axios.post('/api/delete-event', {uid});
  }
});
  /////DELETE
  var cartContent = document.getElementsByClassName('cart-content')[0];
   while(cartContent.hasChildNodes())
    {
        cartContent.removeChild(cartContent.firstChild);
    }
  var titleContent = document.getElementsByClassName('title')[0];
  while(titleContent.hasChildNodes())
    {
        titleContent.removeChild(titleContent.firstChild);
    }
  let orderContent = document.getElementsByClassName('order-content')[0];
  let orderContentToKill = orderContent.childNodes[curOrderIndex];
  orderContent.removeChild(orderContentToKill);
}



async function saveOrder()
{
    Name = document.getElementById("name").value;
    number = document.getElementById("phone").value;
    address = document.getElementById("address").value;
    datetime = document.getElementById("deliveryTime").value;
    otherCaption = document.getElementById('otherCaption').value;
    let uid = events[curOrderIndex].uid;
    let status =  document.getElementById("orderStatus").value;
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
        var cartItemsCap= cartBox.getElementsByClassName('cart-item')[0].value;
        var Item = {
            title : cartItemsName.innerText,
            price : cartItemsPrice.innerText,
            quantity : cartItemsQuantity.value,
            img : cartItemsImg,
            cap : cartItemsCap
        }
        cartItems.push(Item);
    }
    let date = new Date(datetime);
      let startDate = date.toISOString();
      datetime = date.getTime() + 30 * 60 * 1000;
      date = new Date(datetime);
      let endDate = date.toISOString();
   await axios.post('/api/update-event' , { Name, number, address, datetime, cartItems, total, uid, startDate,endDate, otherCaption, status });
}

async function saveOrderClicked(event)
{
  Swal.fire({
  title: "Bạn có chắc chắn?",
  text: "Bạn sẽ không thể khôi phục lại trước khi lưu",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Có, LƯU đi"
}).then((result) =>  {
  if (result.isConfirmed) {
    Swal.fire({
      title: "Đã lưu!",
      text: "Đơn của bạn đã lưu",
      icon: "success"
    });
    var uid =events[curOrderIndex].uid
    axios.post('/api/delete-event', {uid});
    saveOrder();
  }
});
}

function addProductToCart(title, price, productImg,quantiy, cap, last)
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
                                <input type="number" value="${quantiy}" class="cart-quantity">
                            </div>
                            
                            <!-- remove cart -->
                            <i class="bx bxs-trash-alt cart-remove"></i>
                            <textarea class="cart-item" placeholder ="Chú thích" rows="4" cols="50">${cap}</textarea>
                        `
      
       
            cartShopBox.innerHTML = cartBoxContent;
      cartItems.append(cartShopBox);
  
       // cartShopBox.innerHTML.append(moree);
        cartShopBox.getElementsByClassName('cart-remove')[0].addEventListener('click',removeCartItem);
        cartShopBox.getElementsByClassName('cart-quantity')[0].addEventListener('change',quantityChanged);
        
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

function checkValidId(str)
{
  for(let i = 0; i<str.length; i++)
    if((str[i]>='0'&&str[i]<='9') || (str[i]>='a'&& str[i]<='z') || (str[i]>='A'&& str[i]<='Z') || str[i]=='_')  continue;
    else
    return 0;
  return 1;
}

async function addButtonClicked (event)
{
  var name1  = document.getElementById("name").value;
  var price  = document.getElementById("price").value + "k";
  var cap  = document.getElementById("cap").value;
  var img  = document.getElementById("prod-img").src;
  var id = document.getElementById("id").value;
  if (!name1 || !price || !cap || !img || !id|| !checkValidId(id))
    {
       Swal.fire({
            title: "Thông tin trống",
            text: "Vui lòng nhập đầy đủ thông tin",
            icon: "error"
          });
        return;
    }

  Swal.fire({
  title: "Bạn có chắc chắn?",
  text: "Bạn có chắc chắn sẽ tạo hoặc chỉnh sửa mặt hàng này",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Có, tôi đồng ý"
}).then((result) =>  {
  if (result.isConfirmed) {
    Swal.fire({
      title: "Đã lưu!",
      text: "Mặt hàng của bạn đã được tạo",
      icon: "success"
    });
    axios.post('/api/prod-data', {name1, price, cap, img, id});
  }
});
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('uploadForm').addEventListener('submit', function(event) {
        event.preventDefault();
        console.log('ohoh');
        var formData = new FormData();
        var imageFile = document.getElementById('imageInput').files[0];
        formData.append('image', imageFile);
    
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('prod-img').src= data.url;
            document.getElementById('status').innerHTML = `<p>Image uploaded successfully.</p>`;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});














