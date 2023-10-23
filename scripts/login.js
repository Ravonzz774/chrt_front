const postData = async (url = "", data = {}) => {
  // Формируем запрос
  const response = await fetch(url, {
    // Метод, если не указывать, будет использоваться GET
    method: "POST",
    // Заголовок запроса
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    // Данные
    body: JSON.stringify(data),
  });

  return response.json();
};

document
  .getElementById("reg-button")
  .addEventListener("click", async function (event) {
    event.preventDefault(); // Предотвращаем отправку формы

    // Получаем значения полей формы
    let name = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let user = {
      username: name,
      password: password,
    };

    let result = await postData("http://localhost:5000/api/register", user); // Добавляем ключевое слово "await" и сохраняем результат вызова функции postData в переменную "result"

    // Делаем что-то с полученными данными
    console.log(result.message); // Выводим результат в консоль
    // Registration successful.

    if (result.message === "Registration successful.") {
      swal("Вы успешно зарегестрировались, теперь войдите в свой аккаунт");
    } else {
      swal(result.message);
    }
    // Очищаем поля формы
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
  });

document
  .getElementById("login-button")
  .addEventListener("click", async function (event) {
    event.preventDefault(); // Предотвращаем отправку формы

    // Получаем значения полей формы
    let name = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let user = {
      username: name,
      password: password,
    };

    let result = await postData("http://localhost:5000/api/login", user); // Добавляем ключевое слово "await" и сохраняем результат вызова функции postData в переменную "result"

    // Делаем что-то с полученными данными
    console.log(result.message); // Выводим результат в консоль

    if (result.message === "Login successful.") {
      window.location.href = "/";
    } else {
      swal(result.message);
    }

    // Очищаем поля формы
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
  });
