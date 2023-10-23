const getProfileData = async (url = "") => {
  // Формируем запрос
  const response = await fetch(url, {
    // Метод, если не указывать, будет использоваться GET
    method: "GET",
    credentials: "include",
  });

  var result = response
    .json()

    .then((result) => {
      // Обрабатывайте ответ сервера здесь
      var message = result.message;
      console.log(message)
      if (message === "Profile page") {
        var username = result.username;
        var groups = result.groups;

        document.getElementById("username_field").innerText =
          "Имя пользователя: " + username;

        document.getElementById("groups_field").innerText =
          "Группы пользователя: " + groups;
      } else {
        window.location.href = "/login.html";
      }
    });
};


const Get_Teachers_Data = async (url = "") => {
  // Формируем запрос
  const response = await fetch(url, {
    // Метод, если не указывать, будет использоваться GET
    method: "GET",
    credentials: "include",
  });

  return response.json()
};


function addObjectToArray(arr, obj) {
  if (!arr.some(item => JSON.stringify(item) === JSON.stringify(obj))) {
    arr.push(obj);
  }
}

getProfileData("http://localhost:5000/api/profile");



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
  .getElementById("add-button")
  .addEventListener("click", async function (event) {
    event.preventDefault(); // Предотвращаем отправку формы

    // Получаем значения полей формы
    let group = document.getElementById("group").value;

    let data = {
      groups: [group],
    }

    let result = await postData("http://localhost:5000/api/groups", data); // Добавляем ключевое слово "await" и сохраняем результат вызова функции postData в переменную "result"

    // Делаем что-то с полученными данными
    console.log(result.message); // Выводим результат в консоль
    // Registration successful.

    if (result.message === "Groups selected successfully.") {
      getProfileData("http://localhost:5000/api/profile");
    } else {
      swal(result.message);
    }
    // Очищаем поля формы
    document.getElementById("group").value = "";
  });


document
  .getElementById("del-button")
  .addEventListener("click", async function (event) {
    event.preventDefault(); // Предотвращаем отправку формы

    // Получаем значения полей формы
    let group = document.getElementById("group").value;

    let data = {
      groups: [group],
    }

    let result = await postData("http://localhost:5000/api/delete_groups", data); // Добавляем ключевое слово "await" и сохраняем результат вызова функции postData в переменную "result"

    // Делаем что-то с полученными данными
    console.log(result.message); // Выводим результат в консоль
    // Registration successful.

    if (result.message === "Groups deleted successfully.") {
      getProfileData("http://localhost:5000/api/profile");
    } else {
      swal(result.message);
    }
    // Очищаем поля формы
    document.getElementById("group").value = "";
  });


document
  .getElementById("get_teachers-button")
  .addEventListener("click", async function (event) {
    event.preventDefault(); // Предотвращаем отправку формы

    let result = await Get_Teachers_Data("http://localhost:5000/api/timetable"); // Добавляем ключевое слово "await" и сохраняем результат вызова функции postData в переменную "result"

    // Делаем что-то с полученными данными

    let teachers = []
    for (let course of result) {
      for (let group of course.groups) {
        for (let day of group.days) {
          for (let lesson of day.lessons) {
            addObjectToArray(teachers,
              {
                name: lesson[0].teacher,
                id: lesson[0].teacherId
              }
            )
          }
        }
      }
    }

    for (let teacher of teachers) {
      console.log(teacher)
    }

  });


