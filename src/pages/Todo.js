import React, { useCallback, useState, useEffect } from "react";
import axios from "axios";
import Form from "../components/Form";
import List from "../components/List";

/*
  클래스/함수 컴포넌트(용도별로 2가지 케이스)
  내용 출력 전용, 데이터관리 용도

  클래스 형식으로 제작되는 것 class : TypeScript
  state 를 리랜더링(Re-rendering)
  Life-cycle : Mounte, Update, unMount...

  함수 형식으로 제작되는 것 function
  state 를 못쓰므로 화면 갱신 어렵다.
  useState() state 변경가능
  -------------------------
  Life-cycle 을 지원 안한다.
  useEffect() Life-cycle 체크가능

 */

/*
  최초에 로컬에서 todoData 를 읽어와서
  todoData 라는 useState 를 초기화해 주어야 한다.
  useState(초기값)
  초기값: 로컬에서 불러서 채운다.
 */
// 로컬스토리지에 내용을 읽어온다
// mongeDB에서 목록을 익어옴
// let initTodo = localStorage.getItem("todoData");
// initTodo = initTodo ? JSON.parse(initTodo) : [];

const Todo = () => {
  // 몽고디비에서 초기값ㅇ읽어서 셋팅

  // const [todoData, setTodoData] = useState(initTodo);
  const [todoData, setTodoData] = useState([]);
  const [todoValue, setTodoValue] = useState("");
  // axios를 이횽해서 서버에 API호출
  useEffect(() => {
    axios
      .post("/api/post/list")
      .then((response) => {
        // console.log(response.data);
        if (response.data.success) {
          setTodoData(response.data.initTodo);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    // 초기 데이터를 컴포넌트가 마운트될때 한번 실행
  }, []);
  const deleteClick = useCallback(
    (id) => {
      // 클릭된 ID 와 다른 요소들만 걸러서 새로운 배열 생성
      const nowTodo = todoData.filter((item) => item.id !== id);
      // console.log("클릭", nowTodo);
      // 목록을 갱신한다.
      // axios를 이용해서 MongoDB삭제
      setTodoData(nowTodo);
      // 로컬에 저장한다.(DB 예정)
      localStorage.setItem("todoData", JSON.stringify(nowTodo));
    },
    [todoData]
  );

  const addTodoSubmit = (event) => {
    // 웹브라저 새로 고침을 하면 안되므로 막아줌.
    event.preventDefault();

    // 공백 문자열 제거 추가
    let str = todoValue;
    str = str.replace(/^\s+|\s+$/gm, "");
    if (str.length === 0) {
      alert("내용을 입력하세요.");
      setTodoValue("");
      return;
    }

    // { id: 4, title: "할일 4", completed: false }
    // todoData 는 배열이고 배열의 요소들은 위처럼 구성해야하니까
    // {} 로 만들어줌..
    // 그래야 .map 을 통해서 규칙적인 jsx 를 리턴할 수 있으니까.
    const addTodo = {
      id: Date.now(), // id 값은 배열.map의 key 로 활용예정, unique 값만들려고
      title: todoValue, // 할일 입력창의 내용을 추가
      completed: false, // 할일이 추가될때 아직 완료한 것은 아니므로 false 초기화
    };
    //  새로운 할일을 일단 복사하고, 복사된 배열에 추가하여서 업데이트
    //  기존 할일을 Destructuring 하여서 복사본 만듦
    // todoData: [{},{},{},{},    {}]     [{}]
    // axios및 MongoDb에 항옥 추가
    axios
      .post("/api/post/submit", { ...addTodo })
      .then((res) => {
        // console.log(res.data);
        if (res.data.success) {
          setTodoData([...todoData, addTodo]);
          // 새로운 할일을 추가했으므로 내용입력창의 글자를 초기화
          setTodoValue("");
          // 로컬레 저장한다(DB예정)
          // localStorage.setItem("todoData", JSON.stringify([...todoData, addTodo]));
          alert("힐일 등록 성공");
        } else {
          alert("힐일 등록 실패 ");
        }
      })
      .catch((에러) => {
        console.log(에러);
      });
  };

  const deleteAllClick = () => {
    // axios및 MongoDb 목록 비워줌
    setTodoData([]); // 로컬에 저장한다.(DB 예정)
    // 자료를 지운다.(DB 초기화)
    localStorage.clear();
  };

  return (
    <div className="flex justify-center w-full ">
      <div className="w-full p-6 m-4 bg-white shadow ">
        <div className="flex justify-between mb-3">
          <h1>할일 목록</h1>
          <button onClick={deleteAllClick}>Delete All</button>
        </div>

        <List
          todoData={todoData}
          setTodoData={setTodoData}
          deleteClick={deleteClick}
        />
        <Form
          todoValue={todoValue}
          setTodoValue={setTodoValue}
          addTodoSubmit={addTodoSubmit}
        />
      </div>
    </div>
  );
};

export default Todo;
