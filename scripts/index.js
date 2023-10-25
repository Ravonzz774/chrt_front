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

const getNewsData = async (url = "") => {
  // Формируем запрос
  const response = await fetch(url, {
    // Метод, если не указывать, будет использоваться GET
    method: "GET",
    credentials: "include",
  });

  return response.json()

};


const Get_Timetable_Data = async (url = "") => {
  // Формируем запрос
  const response = await fetch(url, {
    // Метод, если не указывать, будет использоваться GET
    method: "GET",
    credentials: "include",
  });

  return response.json()
};


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


function addObjectToArray(arr, obj) {
  if (!arr.some(item => JSON.stringify(item) === JSON.stringify(obj))) {
    arr.push(obj);
  }
}


function getScheduleByTeacherId(schedule, teacherId) {
  const teacherSchedule = [];

  schedule.forEach(course => {
    course.groups.forEach(group => {
      group.days.forEach(day => {
        day.lessons.forEach(lesson => {
          const teacherLesson = lesson.find(l => l.teacherId === teacherId);
          if (teacherLesson) {
            lesson[0].group = group.name
            teacherSchedule.push({ lesson: lesson, day: day.day, });
          }
        });
      });
    });
  });

  return processSchedule(teacherSchedule);
}


function getScheduleByClassroom(schedule, classroom) {
  const classroomSchedule = [];

  schedule.forEach(course => {
    course.groups.forEach(group => {
      group.days.forEach(day => {
        day.lessons.forEach(lesson => {
          const classroomLesson = lesson.find(l => l.cabinet === classroom);

          if (classroomLesson) {
            lesson[0].group = group.name
            classroomSchedule.push({ lesson: lesson, day: day.day, });
          }
        });
      });
    });
  });

  return processSchedule(classroomSchedule);
}

function getScheduleByGroupId(schedule, groupId) {
  const classroomSchedule = [];

  schedule.forEach(course => {
    course.groups.forEach(group => {
      group.days.forEach(day => {
        day.lessons.forEach(lesson => {

          if (group.id === groupId) {
            lesson[0].group = group.name
            classroomSchedule.push({ lesson: lesson, day: day.day });
          }
        });
      });
    });
  });

  return processSchedule(classroomSchedule);
}


function processSchedule(schedule) {
  const obj = {};

  for (const item of schedule) {
    const day = item.day;
    const lesson = item.lesson[0];
    const number = lesson.number;

    if (!obj[day]) {
      obj[day] = {
        number: [],
        pairs: []
      };
    }

    if (!obj[day].number.includes(number)) {
      obj[day].number.push(number);
    }

    const pair = obj[day].pairs.find(pair => pair.number === number);

    if (pair) {
      pair.lessons.push(lesson);
    } else {
      obj[day].pairs.push({
        number: number,
        lessons: [lesson]
      });
    }
  }

  return obj;
}

function getTeachersList(data) {
  let teachers = []
  for (let course of data) {
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

  return teachers
}

function sortByLastName(array) {
  return array.sort((a, b) => {
    const lastNameA = a.name.split(' ')[0];
    const lastNameB = b.name.split(' ')[0];
    return lastNameA.localeCompare(lastNameB);
  });
}

function getFirstLettersAndIndexes(array) {
  const result = [];
  let prevLetter = '';
  array.forEach((item, index) => {
    const lastName = item.name.split(' ')[0];
    const firstLetter = lastName.charAt(0);
    if (firstLetter !== prevLetter) {
      result.push({
        letter: firstLetter,
        index: index
      });
      prevLetter = firstLetter;
    }
  });
  return result;
}


function getGroupIdsAndNames(data) {
  let courses = []
  let i = 0;
  for (let course of data) {
    courses.push({
      course: course,
      groups: []
    })
    for (let group of course.groups) {
      courses[i].groups.push({
        id: group.id,
        name: group.name
      })
    }
    i += 1;
  }
}

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
  .getElementById("test-button")
  .addEventListener("click", async function (event) {
    event.preventDefault(); // Предотвращаем отправку формы

    let result = await Get_Timetable_Data("http://localhost:5000/api/timetable"); // Добавляем ключевое слово "await" и сохраняем результат вызова функции postData в переменную "result"


    // Делаем что-то с полученными данными


    console.log(result)
    console.log(sortByLastName(getTeachersList(result)))
    console.log(getFirstLettersAndIndexes(sortByLastName(getTeachersList(result))))

    // console.log(news)


    console.log(getGroupIdsAndNames(result))
    console.log(getScheduleByGroupId(result, "1263"))
    console.log(getScheduleByClassroom(result, "Дистант"))
    console.log(getScheduleByTeacherId(result, "76"))

    let news = await getNewsData("http://localhost:5000/api/news")

    console.log(news)

    for (let i of news) {
      let news_block = document.createElement('div');
      news_block.innerHTML(`
      
      
      `)
    }


  });


getProfileData("http://localhost:5000/api/profile");