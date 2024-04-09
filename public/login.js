if(document.readyState == "loading"){
    document.addEventListener("DOMContentLoaded",ready);
}
else
{
    ready();
}


function ready(){
    document.getElementsByClassName('btn-login')[0].addEventListener('click',buyButtonClicked);
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
      
      if(ok==0)
      {
           Swal.fire({
            title: "Sai thông tin",
            text: "Vui lòng quay lại tên hoặc mật khẩu",
            icon: "error"
          });
        return;
      }
      else
        {
          localStorage['status'] = true;
          window.location.href = "/admin.html";
        }

      
}


