import axios from "axios";
import React, { useState } from "react";

const ListItem = React.memo(({ item, todoData, setTodoData, deleteClick }) => {
  //   console.log("listItem Rendering...");
  //   현재 편집중인지 아닌지를 관리하는 State생서
  // isEditing false 하면 목록보여줌
  // isEditing ture 하면 편집보여줌
  const [isEditing, setIsEditing] = useState(false);
  //   // 제목을 출력 하고 변경 하는 State
  // 편집창에는 타이틍이 먼저 작성되어 있어야 한다
  const [editedTitle, setEditedTitle] = useState(item.title);

  // console.log(item);
  //   const deleteClick = (id) => {
  //     // 클릭된 아이디와 다른요소들만 걸러서 새로운 배열 생성
  //     const nowTodo = todoData.filter((item) => item.id !== id);
  //     console.log("클릭", nowTodo);
  //     setTodoData(nowTodo);
  //   };
  //   편집창 내용 갱신 처리
  const editChange = (event) => {
    setEditedTitle(event.target.value);
  };

  const toggleClick = (id) => {
    // map을 통해서 this.state.todoData의 complete를 업데이트해보자
    const updateTodo = todoData.map((item) => {
      if (item.id === id) {
        // 할일목록의 값을 변경
        // !의 의미는 반대값으로 변경
        item.completed = !item.completed;
      }
      return item;
    });

    let body = {
      id: todoId,
      completed: item.completed,
    };
    // axios를 통해 MongoDb complete업데이트
    // then():서버에서 회신(응답)이 왔을때 처리
    // catch():서버에서 응답이 없을때
    axios
      .post("/api/post/updatetoggle", body)
      .then((response) => {
        // console.log(response);
        setTodoData(updateTodo);
      })
      .catch((error) => {
        console.log(error);
      });
    // 로컬에 저장한다.(DB 예정)
    // localStorage.setItem("todoData", JSON.stringify(updateTodo));
  };

  // 편재 item.id에 해당하는 것만 업데이트한다
  const todoId = item.id;
  const updateTitle = () => {
    // 공백 문자열 제거 추가
    let str = editedTitle;
    str = str.replace(/^\s+|\s+$/gm, "");
    if (str.length === 0) {
      alert("제목을 입력하세요.");
      setEditedTitle(item.title);
      return;
    }

    let tempTodo = todoData.map((item) => {
      // 모든 todoData 중에 현재 ID 와 같다면
      if (item.id === todoId) {
        // 타이틀 글자를 수정하겠다.
        item.title = editedTitle;
      }
      return item;
    });
    // 데이터 갱신
    // axios 를 이용해서 MongoDB 타이틀업데이트
    let body = {
      id: todoId,
      title: editedTitle,
    };
    axios
      .post("/api/post/updatetitle", body)
      .then((response) => {
        // 응답 결과 출력
        console.log(response.data);
        setTodoData(tempTodo);
        // 목록창으로 이동
        setIsEditing(false);
      })
      .catch((error) => {
        console.log(error);
      });
    // 로컬에 저장(DB 저장)
    // localStorage.setItem("todoData", JSON.stringify(tempTodo));
  };

  // 날짜출력
  const WEEKDAY = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];const showTime = (_timestamp) => {
    const date = new Date(_timestamp);
    // 시간 오전, 오후 표시
    let hours = date.getHours();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    hours = hours + 1 < 9 ? "0" + hours : hours;

    // 분 표시
    let minutes = date.getMinutes();
    minutes = minutes < 10 ? "0" + minutes : minutes;

    // 초 표시
    let seconds = date.getSeconds();
    seconds = seconds < 10 ? "0" + seconds : seconds;
    // 월출력
    let months = date.getMonth();
    months = months + 1 < 9 ? "0" + (months + 1) : months + 1;

    let time = date.getFullYear();
    time += "/";
    time += months;
    time += "/";
    time += date.getDate();
    // time += "/";
    // time += WEEKDAY[date.getDay()];
    time += "  ";
    time += hours;
    time += ":";
    time += minutes;
    time += ":";
    time += seconds;
    time += "  ";
    time += ampm;

    return time;
  };

  if (isEditing) {
    // 편집일때 jsx 리턴
    return (
      <div className="flex items-center justify-between w-full px-4 py-1 my-2 text-gray-600 bg-gray-100 border rounded">
        <div className="items-center ">
          <input
            type="text"
            className="w-full px-3 py-2 mr-4 text-gray-500 bg-white border rounded"
            value={editedTitle}
            onChange={editChange}
          />
        </div>
        <div className="items-center">
          <button className="px-4 py-2" onClick={updateTitle}>
            Update
          </button>
          <button className="px-4 py-2" onClick={() => setIsEditing(false)}>
            {" "}
            Close{" "}
          </button>
        </div>
      </div>
    );
  } else {
    // 편집일때 jsx 리턴
    return (
      <div className="flex items-center justify-between w-full px-4 py-1 my-2 text-gray-600 bg-gray-100 border rounded">
        <div className="items-center ">
          <input
            type="checkbox"
            defaultChecked={item.completed}
            onChange={() => toggleClick(item.id)}
          />{" "}
          <span className={item.completed ? "line-through" : "none"}>
            {item.title}
          </span>
        </div>
        <div className="items-center">
          <span>{showTime(item.id)}</span>
          <button
            className="px-4 py-2"
            onClick={() => {
              setIsEditing(true);
              setEditedTitle(item.title);
            }}
          >
            Edit
          </button>
          <button className="px-4 py-2" onClick={() => deleteClick(item.id)}>
            x
          </button>
        </div>
      </div>
    );
  }
});

export default ListItem;
