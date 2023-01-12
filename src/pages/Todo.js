import React, { useCallback, useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
// import {Dropdown,DropdownButton} from 'react-bootstrap';
// import Spinner from "react-bootstrap/Spinner";

// 1.로그인 여부 파악
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import axios from "axios";
import Form from "../components/Form";
import List from "../components/List";
// import { Navigate } from "react-router";
// import Loading from "../components/Loading";
import LoadingSpinner from "../components/LoadingSpinner";

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

  // 2. 로그인 상태 파악
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  console.log("user", user);
  useEffect(() => {
    // 사용자 로그인 여부 파악
    if (user.accessToken === "") {
      // 로그인이 안된 경우
      alert("로그인을 하셔야 합니다.");
      navigate("/login");
    } else {
      // 로그인이 된 경우
    }
  }, [user]);
  // 목록 정렬 기능
  const [sort, setSort] = useState("최신글");
  useEffect(() => {
    setSkip(0);
    getList(search, 0);
  }, [sort]);

  // 검색 기능
  const [search, setSearch] = useState("");
  const searchHandler = () => {
    setSkip(0);
    getList(search, 0);
  };

  // axios를 이횽해서 서버에 API호출
  // 전체목록 호출 메서드
  const getList = (_word = "", _stIndex = 0) => {
    setSkip(0);
    setSkipToggle(true);
    setLoading(true);
    let body = {
      sort: sort,
      search: _word,
      // 사용자 구분용도
      uid: user.uid,
      skip: _stIndex,
    };
    axios
      .post("/api/post/list", body)
      .then((response) => {
        // console.log(response.data);
        if (response.data.success) {
          setTodoData(response.data.initTodo);
          // 시작하는 slip번호를 갱신한다
          setSkip(response.data.initTodo.length);
          if (response.data.initTodo.length < 5) {
            setSkipToggle(false);
          }
        }

        // 로딩창 숨기기
        setLoading(false);
      })

      .catch((error) => {
        console.log(error);
      });
  };

  const getListGo = (_word = "", _stIndex = 0) => {
    setLoading(true);
    let body = {
      sort: sort,
      search: _word,
      // 사용자 구분용도
      uid: user.uid,
      skip: _stIndex,
    };
    axios
      .post("/api/post/list", body)
      .then((response) => {
        // console.log(response.data);
        if (response.data.success) {
          const newArr = response.data.initTodo;
          setTodoData([...todoData, ...newArr]);
          // 시작하는 slip번호를 갱신한다
          setSkip(skip + newArr.length);
          if (newArr.length < 5) {
            setSkipToggle(false);
          }
        }

        // 로딩창 숨기기
        setLoading(false);
      })

      .catch((error) => {
        console.log(error);
      });
  };

  // 목록 개수 출력
  const [skip, setSkip] = useState(0);
  const [skipToggle, setSkipToggle] = useState(true);

  const getListMore = () => {
    getListGo(search, skip);
  };

  useEffect(() => {
    getList("", skip);
    // 초기 데이터를 컴포넌트가 마운트될때 한번 실행
  }, []);

  const deleteClick = useCallback(
    (id) => {
      if (window.confirm("정말 삭제하시겠습니까?")) {
        let body = {
          id: id,
        };
        setLoading(true);
        axios
          .post("/api/post/delete", body)
          .then((response) => {
            console.log(response);
            const nowTodo = todoData.filter((item) => item.id !== id);
            setTodoData(nowTodo);
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
          });
      }
      // 클릭된 ID 와 다른 요소들만 걸러서 새로운 배열 생성

      // console.log("클릭", nowTodo);
      // 목록을 갱신한다.
      // axios를 이용해서 MongoDB삭제

      // 로컬에 저장한다.(DB 예정)
      // localStorage.setItem("todoData", JSON.stringify(nowTodo));
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
      // 1. DB저장:server/Model/TodoModel Schema업데(objectID저장)
      //  uid 여려명의 사용자 구분용도

      uid: user.uid,
    };

    setLoading(true);
    //  새로운 할일을 일단 복사하고, 복사된 배열에 추가하여서 업데이트
    //  기존 할일을 Destructuring 하여서 복사본 만듦
    // todoData: [{},{},{},{},    {}]     [{}]
    // axios및 MongoDb에 항옥 추가
    axios
      .post("/api/post/submit", { ...addTodo })
      .then((res) => {
        // console.log(res.data);
        if (res.data.success) {
          // 검색어 초기화 등록글 다시 갱신
          setTodoValue("");
          getList("", 0);
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
    if (window.confirm("정말 전체 삭제하시겠습니까?")) {
      // axios및 MongoDb 목록 비워줌

      setLoading(true);
      axios
        .post("/api/post/deleteall")
        .then(() => {
          setSkip(0);
          setLoading(false);
        })

        .catch((error) => console.log(error));
    }
    // 로컬에 저장한다.(DB 예정)
    // 자료를 지운다.(DB 초기화)
    // localStorage.clear();
  };

  // 로딩관련
  const [loading, setLoading] = useState(false);
  // const loadingCSS = {
  //   position: "fixed",
  //   left: 0,
  //   top: 0,
  //   display: "flex",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   width: "100vw",
  //   height: "100vh",
  //   backgroundColor: "rgba(0,0,0,0.5)",
  // };

  return (
    <div className="flex justify-center w-full ">
      <div className="w-full p-6 m-4 bg-white shadow ">
        <div className="flex justify-between mb-3">
          <h1>할일 목록</h1>
          <button onClick={deleteAllClick}>Delete All</button>
        </div>

        <div className="flex justify-between mb-3">
          <DropdownButton title={sort} variant="outline-secondary">
            <Dropdown.Item onClick={() => setSort("최신글")}>
              최신글
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSort("과거순")}>
              과거순
            </Dropdown.Item>
          </DropdownButton>

          <div>
            <label className="mr-2">검색어 </label>
            <input
              placeholder="검색어를 입력"
              type="text"
              className="border-2"
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchHandler();
                }
              }}
            />
          </div>
        </div>

        <List
          todoData={todoData}
          setTodoData={setTodoData}
          deleteClick={deleteClick}
        />

        {skipToggle && (
          <div className="flex justify-center">
            <button
              className="p-2 text-blue-400 border-2
            border-blue-400 rounded
            hover:text-white
            hover:bg-blue-400"
              onClick={() => getListMore()}
            >
              더보기
            </button>
          </div>
        )}

        <Form
          todoValue={todoValue}
          setTodoValue={setTodoValue}
          addTodoSubmit={addTodoSubmit}
        />
      </div>

      {/* 로링창 샘플 */}
      {loading && <LoadingSpinner />}
    </div>
  );
};

export default Todo;
