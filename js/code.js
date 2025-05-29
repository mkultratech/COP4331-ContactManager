function showMessage(id, message) 
{
	document.getElementById(id).textContent = message;
}

document.addEventListener('DOMContentLoaded', () => 
{
	const signupForm = document.getElementById('signupForm');
	const loginForm  = document.getElementById('loginForm');
	const toLogin    = document.getElementById('toLogin');
	const toSignup   = document.getElementById('toSignup');

	function showMessage(id, msg)
	{
		document.getElementById(id).textContent = msg;
	}


	// Toggle between forms
	toLogin.addEventListener('click', () => 
		{
			signupForm.classList.remove('active');
			loginForm.classList.add('active');
			showMessage('signup-message', '');
			showMessage('login-message', '');
		});

	toSignup.addEventListener('click', () => 
		{
			loginForm.classList.remove('active');
			signupForm.classList.add('active');
			showMessage('signup-message', '');
			showMessage('login-message', '');
		});

	// SIGN UP HANDLER
	signupForm.addEventListener('submit', async e => 
		{
			e.preventDefault();
			showMessage('signup-message', '');
			const payload = 
			{
				firstName: document.getElementById('signupFirst').value.trim(),
				lastName: document.getElementById('signupLast').value.trim(),
				username: document.getElementById('signupUsername').value.trim(),
				email: document.getElementById('signupEmail').value.trim(),
				password: document.getElementById('signupPassword').value,
			};

			// Basic client-side validation
			if (!payload.firstName || !payload.lastName || !payload.username || !payload.email || !payload.password) 
			{
				return showMessage('signup-message', 'All fields are required.');
			}

			try
			{
				const res = await fetch('/LAMPAPI/SignUp.php',
					{
						method: 'POST',
						headers: {'Content-Type': 'application/json'}, 
						body: JSON.stringify(payload)
					}
				);

				const json = await res.json();

				if (res.status === 201)
				{
					showMessage('signup-message', 'Account created! Please log in.');

					// SWITCH TO LOGIN AUTOMATICALLY?
					// After a short pause, switch to login form:
					setTimeout(() => toLogin.click(), 1000);

				}

				else
				{
					showMessage('signup-message', json.error || 'Sign-up failed.');
				}
			}

			catch (err)
			{
				showMessage('signup-message', 'Network error. Try again.');
			}
		});



// document.getElementById('signupForm').addEventListener('submit', function (e) 
// {
//   e.preventDefault();
//   const username = document.getElementById('signupUsername').value.trim();
//   const password = document.getElementById('signupPassword').value;

//   if (!username || !password) {
//     showMessage('signup-message', 'Please enter both fields.');
//     return;
//   }

// //   const users = JSON.parse(localStorage.getItem('users') || '{}');

//   if (users[username]) {
//     showMessage('signup-message', 'Username already exists.');
//     return;
//   }

//   users[username] = md5(password);
//   localStorage.setItem('users', JSON.stringify(users));
//   showMessage('signup-message', 'Signup successful! You can now log in.');
//   document.getElementById('signupForm').reset();
// });

// LOGIN HANDLER
// LOG IN
  loginForm.addEventListener('submit', async e => 
	{
		e.preventDefault();
		showMessage('login-message', '');

		const payload = 
		{
			login:    document.getElementById('loginUsername').value.trim(),
			password: document.getElementById('loginPassword').value
		};

		if (!payload.login || !payload.password) 
		{
			return showMessage('login-message', 'Both fields are required.');
		}

		try 
		{
			const res  = await fetch('/LAMPAPI/Login.php', 
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json'},
					body: JSON.stringify(payload)
				});
			const json = await res.json();

			if (res.status === 200 && json.id > 0) 
			{
				// store the userId for subsequent API calls
				sessionStorage.setItem('userId', json.id);

				// optionally store name: sessionStorage.setItem('userName', json.firstName);
				window.location.href = 'color.html';
			} 

			else 
			{
				showMessage('login-message', json.error || 'Login failed.');
			}
		} 
		catch (err) 
		{
			showMessage('login-message', 'Network error. Try again.');
		}
  	});
});
// document.getElementById('loginForm').addEventListener('submit', function (e) {
//   e.preventDefault();
//   const username = document.getElementById('loginUsername').value.trim();
//   const password = document.getElementById('loginPassword').value;

//   if (!username || !password) {
//     showMessage('login-message', 'Please enter both fields.');
//     return;
//   }

//   const users = JSON.parse(localStorage.getItem('users') || '{}');

//   if (!users[username]) {
//     showMessage('login-message', 'User not found.');
//     return;
//   }

//   if (users[username] !== md5(password)) {
//     showMessage('login-message', 'Incorrect password.');
//     return;
//   }

//   // Success: store name and redirect
//   localStorage.setItem('userName', username);
//   showMessage('login-message', 'Login successful! Redirecting...');
//   setTimeout(() => {
//     window.location.href = "color.html";
//   }, 1000);
// });

// LOGOUT HANDLER (used in color.html)
// function doLogout() {
//   localStorage.removeItem('userName');
//   window.location.href = "index.html";
// }

// Welcome message (used in color.html)
// function readCookie() {
//   const name = localStorage.getItem('userName');
//   if (!name) {
//     window.location.href = "index.html";
//   } else {
//     document.getElementById('userName').textContent = name;
//   }
// }

// // Form elements
// const signupForm = document.getElementById('signupForm');
// const loginForm  = document.getElementById('loginForm');

// // Toggle links
// const toLogin  = document.getElementById('toLogin');
// const toSignup = document.getElementById('toSignup');

// // When user clicks “Already have an account? Sign in”
// toLogin.addEventListener('click', () => {
//   signupForm.classList.remove('active');
//   loginForm.classList.add('active');
// });

// // When user clicks “Don’t have an account? Create an account”
// toSignup.addEventListener('click', () => {
//   loginForm.classList.remove('active');
//   signupForm.classList.add('active');
// });


// const urlBase = 'http://mrehsforp.xyz/LAMPAPI';
// const extension = 'php';

// let userId = 0;
// let firstName = "";
// let lastName = "";

// function doLogin()
// {
//     userId = 0;
//     firstName = "";
//     lastName = "";

//     let login = document.getElementById("loginName").value;
//     let password = document.getElementById("loginPassword").value;
//     var hash = md5(password);

//     document.getElementById("loginResult").innerHTML = "";

//     var tmp = {login: login, password:hash};
//     let jsonPayload =JSON.stringify(tmp);

//     let url = urlBase+ '/Login.' + extension;

//     let xhr = new XMLHttpRequest();
//     xhr.open("POST",url,true);
//     xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
//     try
//     {
//         xhr.onreadystatechange = function()
//         {
//             if (this.readyState == 4 && this.status == 200)
//             {
//                 let jsonObject = JSON.parse(xhr.responseText);
//                 userId = jsonObject.id;

//                 if (userId < 1)
//                 {
//                     document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
//                     return;
//                 }

//                 firstName = jsonObject.firstName;
//                 lastName = jsonObject.lastName;

//                 saveCookie();
//                 window.location.href = "color.html";
//             }
//         };
//         xhr.send(jsonPayload);
//     }
//     catch(err)
//     {
//         document.getElementById("loginResult").innerHTML = err.message;
//     }
// }

// function saveCookie()
// {
//     let minutes = 20;
//     let date = new Date();
//     date.setTime(date.getTime() + (minutes * 60 * 1000));
//     document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
// }

// function readCookie()
// {
//     userId = -1;
//     let data = document.cookie;
//     let splits = data.split(",");
//     for (var i = 0; i < splits.length; i++)
//     {
//         let thisOne = splits[i].trim();
//         let tokens = thisOne.split("=");
//         if (tokens[0] == "firstName")
//         {
//             firstName = tokens[1];
//         }
//         else if (tokens[0] == "lastName")
//         {
//             lastName = tokens[1];
//         }
//         else if (tokens[0] == "userId")
//         {
//             userId = parseInt(tokens[1].trim());
//         }
//     }

//     if (userId < 0)
//     {
//         window.location.href = "index.html";
//     }
//     else
//     {
//         document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
//     }
// }

// function doLogout()
// {
//     userId = 0;
//     firstName = "";
//     lastName = "";
//     document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
//     window.location.href = "index.html";
// }

// function addColor()
// {
//     let newColor = document.getElementById("colorText").value;
//     document.getElementById("colorAddResult").innerHTML = "";

//     let tmp = {color: newColor, userId: userId};
//     let jsonPayload = JSON.stringify(tmp);

//     let url = urlBase + '/AddColor.' + extension;

//     let xhr = new XMLHttpRequest();
//     xhr.open("POST", url, true);
//     xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
//     try
//     {
//         xhr.onreadystatechange = function()
//         {
//             if (this.readyState == 4 && this.status == 200)
//             {
//                 document.getElementById("colorAddResult").innerHTML = "Color has been added";
//             }
//         };
//         xhr.send(jsonPayload);
//     }
//     catch(err)
//     {
//         document.getElementById("colorAddResult").innerHTML = err.message;
//     }
// }

// function searchColor()
// {
//     let srch = document.getElementById("searchText").value;
//     document.getElementById("colorSearchResult").innerHTML = "";

//     let colorList = "";

//     let tmp = {search: srch, userId: userId};
//     let jsonPayload = JSON.stringify(tmp);

//     let url = urlBase + '/SearchColors.' + extension;

//     let xhr = new XMLHttpRequest();
//     xhr.open("POST", url, true);
//     xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
//     try
//     {
//         xhr.onreadystatechange = function()
//         {
//             if (this.readyState == 4 && this.status == 200)
//             {
//                 document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
//                 let jsonObject = JSON.parse(xhr.responseText);

//                 for (let i = 0; i < jsonObject.results.length; i++)
//                 {
//                     colorList += jsonObject.results[i];
//                     if (i < jsonObject.results.length - 1)
//                     {
//                         colorList += "<br />\r\n";
//                     }
//                 }

//                 document.getElementsByTagName("p")[0].innerHTML = colorList;
//             }
//         };
//         xhr.send(jsonPayload);
//     }
//     catch(err)
//     {
//         document.getElementById("colorSearchResult").innerHTML = err.message;
//     }
// }

// function addContact()
// {
//     let tmp = {
//         firstName: document.getElementById("firstName").value,
//         lastName: document.getElementById("lastName").value,
//         phone: document.getElementById("phone").value,
//         email: document.getElementById("email").value,
//         userId: userId
//     };

//     let jsonPayload = JSON.stringify(tmp);

//     let url = urlBase + '/AddContact.' + extension;

//     let xhr = new XMLHttpRequest();
//     xhr.open("POST", url, true);
//     xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
//     xhr.onreadystatechange = function()
//     {
//         if (this.readyState == 4 && this.status == 200)
//         {
//             document.getElementById("contactAddResult").innerHTML = "Contact added.";
//         }
//     };
//     xhr.send(jsonPayload);
// }

