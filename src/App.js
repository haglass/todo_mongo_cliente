import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
// fire 라이브러리 모듈활용
// react-redux 모듈
import { loginUser, clearUser } from "./reducer/userSlice";
// fire 라이브러리 모듈활용
import firebase from "./firebase";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import Todo from "./pages/Todo";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import UserInfo from "./pages/UserInfo";

export default function App() {
  // action 보내서 store.user.state 를 업데이트
  const dispatch = useDispatch();
  // 내용 출력하기
  // const user = useSelector((state) => state.user);

  // 로그인 상태 테스트
  useEffect(() => {
    // fire 의 사용자 로그인 변경 이벤트
    firebase.auth().onAuthStateChanged((userInfo) => {
      // /firebase에 로그인 시 출력 정보확인
      // console.log("로그인 정보 : ", userInfo);
      if (userInfo) {
        // 로그인을 했어요.
        // store.user.state 에 저장해야죠. 뭘? info를
        // 여기에서의 userInfo 는 Firebase 사이트에서 준것
        dispatch(loginUser(userInfo.multiFactor.user));
      } else {
        // 로그아웃 했어요.
        // store.user.state 를 초기화해야죠.
        dispatch(clearUser());
      }
    });
  });
  // useEffect(() => {
  //   // {uid:"", nickName:"", accessToken:""}
  //   // {uid:"..", nickName:"..", accessToken:".."}
  //   console.log(user);
  // }, [user]);

  // 임시로 로그아웃을 컴포넌트가 마운트 될때 실행
  // useEffect(() => {
  //   // 로그아웃
  //   firebase.auth().signOut();
  // }, []);

  return (
    <Router>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/userinfo" element={<UserInfo />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}
