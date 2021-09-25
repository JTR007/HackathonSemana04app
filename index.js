
// Ejercicio #0
let promise = new Promise(
  
  function(resolve, reject) {
    
    resolve(1);
    
    setTimeout(() => resolve(2), 1000);
  
  }
  
);

promise.then(alert); // La salida es: 1

// Ejercicio #1

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

delay(3000).then(() => alert('runs after 3 seconds'));

// Ejercicio #2

//¿Son estos fragmentos de código iguales? En otras palabras, ¿se comportan de la misma manera en cualquier 
//circunstancia, para cualquier función de controlador?
promise.then(f1).catch(f2);
//Versus:
promise.then(f1, f2);
//Respuesta: No son iguales
//La diferencia es que si ocurre un error en "promise.then(f1).catch(f2);" f1, entonces se maneja por ".catch".
//pero en "promise.then(f1, f2);" no hay un ".catch" que capture el error

// Ejercicio #3
// Reescriba este código de ejemplo del capítulo Encadenamiento de promesas usando async / await en lugar de .then / catch
function loadJson(url) {
  return fetch(url)
    .then(response => {
      if (response.status == 200) {
        return response.json();
      } else {
        throw new Error(response.status);
      }
    });
}

loadJson('no-such-user.json')
  .catch(alert); // Error: 404

//Solucion

async function loadJson(url) {
  let response = await fetch(url); 

  if (response.status == 200) {
    let json = await response.json(); 
    return json;
  }

  throw new Error(response.status);
}

loadJson('no-such-user.json')
  .catch(alert); 

// Ejercicio #4

class HttpError extends Error {
  constructor(response) {
    super(`${response.status} for ${response.url}`);
    this.name = 'HttpError';
    this.response = response;
  }
}

async function loadJson(url) {
  let response = await fetch(url);
  if (response.status == 200) {
    return response.json();
  } else {
    throw new HttpError(response);
  }
}
// Ask for a user name until github returns a valid user
async function demoGithubUser() {

  let user;
  while(true) {
    let name = prompt("Enter a name?", "iliakan");

    try {
      user = await loadJson(`https://api.github.com/users/${name}`);
      break; 
    } catch(err) {
      if (err instanceof HttpError && err.response.status == 404) {
        
        alert("No such user, please reenter.");

      } else {

        throw err;

      }
    }
  }


  alert(`Full name: ${user.name}.`);
  return user;
}

demoGithubUser();

// Ejercicio #5

async function wait() {
  
  await new Promise(resolve => setTimeout(resolve, 1000));

  return 10;

}

function f() {

  wait().then(result => alert(result));

}

f();

// Ejercicio #6

new Promise(function(resolve, reject) {
  setTimeout(() => {
    throw new Error("Whoops!");
  }, 1000);
}).catch(alert);

// Respuesta: no se activara el ".catch" porque el error no se genera mientras 
//el ejecutor está corriendo, sino más tarde

// Ejercicio #7

//Usando setInterval

function printNumbers(from, to) {
  let current = from;

  let timerId = setInterval(function() {
    alert(current);
    if (current == to) {
      clearInterval(timerId);
    }
    current++;
  }, 1000);
}

printNumbers(5, 10);

//Usando setTimeout

function printNumbers(from, to) {
  let current = from;

  setTimeout(function go() {
    alert(current);
    if (current < to) {
      setTimeout(go, 1000);
    }
    current++;
  }, 1000);
}

printNumbers(5, 10);
