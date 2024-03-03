import styles from "./mypage.css";
import imgfile from "./img/aa.jpg"

export default function Mypage(){
    return (
        <>
        <section className="text-gray-600 body-font relative bg-white w-[95%] mx-auto mt-5">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <a className="flex title-font font-medium items-center text-gray-900 mb-0 mx-auto">
              <span className="madimi ml-3 text-5xl text-[#88d1f9]">F-log</span>
            </a>
          </div>
          <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
          <h1 className="text-2xl mb-4">마이페이지</h1>
          <img className="object-contain w-[118px] h-[157px] inline float-left rounded-2xl border-2 border-gray-100" src={imgfile} />
          <div className="inline float-left ml-10">
            <p className="text-xl inline">키 (cm)</p>
            <span className="ml-3">170cm</span>
            <div></div>
            <p className="text-xl pt-3 inline">몸무게</p>
            <span className="ml-3">70kg</span>
          </div>
          <span className="clear-both block"></span>

          <table className="w-full mt-4 text-sm text-left text-gray-500">
            <tbody>

                <tr className="bg-white border-y">
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4 text-gray-900">
                        아이디
                    </td>
                    <td className="px-6 py-4">
                        user
                    </td>
                    <td className="px-6 py-4"></td>
                </tr>

                <tr className="bg-white border-b">
                  <td className="px-6 py-4"></td>
                  <td className="px-6 py-4 text-gray-900">
                      이메일
                  </td>
                  <td className="px-6 py-4">
                      example@example.com
                  </td>
                  <td className="px-6 py-4"></td>
                </tr>

                <tr className="bg-white border-b">
                  <td className="px-6 py-4"></td>
                  <td className="px-6 py-4 text-gray-900">
                      주소
                  </td>
                  <td className="px-6 py-4">
                      대한민국 서울시
                  </td>
                  <td className="px-6 py-4"></td>
                </tr>

            </tbody>
        </table>
        </div>
      </section>
      </>
    )
}