const getData = async (url = "") => {
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

      if (message === "Unauthorized") {
        window.location.href = "/login.html";
      } else {
        var username = result.username;
        var groups = result.groups;

        document.getElementById("username_field").innerText =
          "Имя пользователя: " + username;

        document.getElementById("groups_field").innerText =
          "Группы пользователя: " + groups;
      }
    });
};

getData("http://localhost:5000/api/profile");
