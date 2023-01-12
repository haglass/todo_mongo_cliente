import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignUpDiv from "../styles/SignUpCss";
// firebase 기본 코드를 포함
import firebase from "../firebase";
import axios from "axios";

const SignUp = () => {
  const [nickName, setNickName] = useState("");
  const [email, setEemail] = useState("");
  const [pw, setPw] = useState("");
  const [pwChek, setPwChek] = useState("");
  const [btFlag, setBtFlag] = useState("");
  const navigate = useNavigate();

  // firebase 회원가입 기능
  const registFunc = (e) => {
    e.preventDefault();
    if (!nickName) {
      setBtFlag(false);
      return alert("닉네임을 입력하세요.");
    }
    if (!email) {
      return alert("이메일을 입력하세요.");
    }
    if (!pw) {
      return alert("비밀번호를 입력하세요.");
    }
    if (!pwChek) {
      return alert("비밀번호 확인을 입력하세요.");
    }
    // 비밀번호가 같은지 비교처리
    if (pw !== pwChek) {
      return alert("비밀번호는 같아야 합니다.");
    }
    //3.닉네임 검사 요청
    if (!nameCheck) {
      return alert("닉네임 중복검사를 해주세요");
    }
    // 연속클릭 막기
    setBtFlag(true);
    // firebase 로 이메일과 비밀번호를 전송
    // https://firebase.google.com/docs/auth/web/start?hl=ko&authuser=3#web-version-9_1
    const createUser = firebase.auth();
    createUser
      .createUserWithEmailAndPassword(email, pw)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // console.log(user);
        //사용자 프로필의 디스필레이네임을 업데
        // https://firebase.google.com/docs/auth/web/manage-users
        user
          .updateProfile({ displayName: nickName })
          .then(() => {
            // 데이ㅣ터베이스로 정보를 저장
            // 사용자 정보를 저장한다(이메일,닉네임,UID)
            console.log(user);
            let body = {
              email: user.email,
              displayName: user.displayName,
              uid: user.uid,
            };
            axios
              .post("/api/user/register", body)
              .then((response) => {
                console.log(response.data);
                if (response.data.success) {
                  firebase.auth().signOut();
                  // 회원정보 저장 성공
                  navigate("/login");
                } else {
                  // 회원정보 저장 실패
                  console.log("회원정보 저장 실패시에는 다시 저장을 도전");
                }
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((error) => {
            // 프로필 업데이트 실패
          });
      })
      .catch((error) => {
        // 연속클릭 막기
        setBtFlag(false);
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };
  // 2.이름 중복검사
  const [nameCheck, setNameCheck] = useState(false);
  const nameCheckFn = (e) => {
    e.preventDefault();
    if (!nickName) {
      return alert("닉네임을 입력해주세요");
    }
    // 데이터베이스 서버 Usermodel에서 닉네임 존재 여부 파악

    const body = {
      displayName: nickName,
    };
    axios
      .post("/api/user/namecheck", body)
      .then((response) => {
        if (response.data.success) {
          if (response.data.check) {
            // 등록가능
            // 중복체크완료
            setNameCheck(true);
            alert("등록이 가능");
          } else {
            // 등록불가능
            setNameCheck(false);
            alert("이미 등록된 닉네임");
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="p-6 m-4 shadow">
      <h2>SignUp</h2>
      <SignUpDiv>
        <form>
          <label>닉네임</label>
          <input
            type="text"
            required
            value={nickName}
            maxLength={20}
            minLength={3}
            onChange={(e) => setNickName(e.target.value)}
          />
          <button onClick={(e) => nameCheckFn(e)}>닉네임 중복검사</button>

          <label>이메일</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEemail(e.target.value)}
          />

          <label>비밀번호</label>
          <input
            type="password"
            required
            value={pw}
            maxLength={16}
            minLength={6}
            onChange={(e) => setPw(e.target.value)}
          />
          <label>비밀번호 확인</label>
          <input
            type="password"
            required
            value={pwChek}
            maxLength={16}
            minLength={6}
            onChange={(e) => setPwChek(e.target.value)}
          />
          <button disabled={btFlag} onClick={(e) => registFunc(e)}>
            회원가입
          </button>
        </form>
      </SignUpDiv>
    </div>
  );
};

export default SignUp;
