import styles from "./forms.css";
import { useRef } from "react";

export default function Login(){
  const inref = useRef(null);
    return (
        <>
        <section className="text-gray-600 body-font relative bg-white w-[95%] mx-auto mt-5">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <a className="flex title-font font-medium items-center text-gray-900 mb-0 mx-auto">
              <span className="madimi ml-3 text-5xl text-[#88d1f9]">F-log</span>
            </a>
          </div>
          <div className="w-2/3 mx-auto">
            <div className="flex flex-wrap -m-2">
              <div className="p-2 w-full">
                <div className="relative mx-auto w-1/2">
                  <input ref={inref} type="text" id="user_id" name="user_id" className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-[#88d1f9] focus:bg-white text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" placeholder="아이디" />
                </div>
              </div>
              <div className="p-2 w-full">
                <div className="relative mx-auto w-1/2">
                  <input ref={inref} type="password" id="user_pw" name="user_pw" className="w-full bg-gray-100 bg-opacity-50 border border-gray-300 focus:border-[#88d1f9] focus:bg-white text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" placeholder="비밀번호" />
                </div>
              </div>
              <div className="p-2 w-1/2 mx-auto">
                <button className="w-full text-white bg-[#88d1f9] border-0 py-2 text-center focus:outline-none mx-auto text-lg">로그인</button>
              </div>
              <div className="p-2 w-2/3 mx-auto">
                <div className="text-hr">또는</div>
              </div>
              <div className="p-2 w-1/2 mx-auto">
                <button className="w-full text-white bg-[#88d1f9] border-0 py-2 text-center focus:outline-none mx-auto text-lg">회원가입</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      </>
    )
}