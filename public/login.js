
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


  ///////////////////////////////////////////////////
 //          THIS AREA IS FOR MY MEO MEO          //
/////////////////////////////////////////////////// 


async function buyButtonClicked(event)
{
      let events=[];
      let Name = document.getElementById("name").value;
      let Pass = document.getElementById("pwd").value;
     
      fetch('/logincheck', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Name, Pass })
        })
        .then(response => {
            if (response.ok) {
                // Redirect to the dashboard page upon successful login
                window.location.href = '/admin';
            } else {
                // Display an error message if login fails
                alert('Invalid credentials');
            }
        })
        .catch(error => console.error('Error:', error));
}


