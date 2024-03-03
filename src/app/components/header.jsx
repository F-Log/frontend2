import styles from "./font.css";
export default function Header(){
    return (
        <header className="text-gray-600 body-font bg-white">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center madimi">
          <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
            <span className="ml-3 text-5xl text-[#88d1f9]">F-log</span>
          </a>
          <nav className="mr-auto ml-4 py-1 pl-7 flex flex-wrap items-center text-base justify-center text-[#88d1f9]">
            <a className="mr-5 hover:text-gray-900">HOME</a>
            <a className="mr-5 hover:text-gray-900">FOOD</a>
            <a className="mr-5 hover:text-gray-900">LOG</a>
            <a className="mr-5 hover:text-gray-900">InBody</a>
            <a className="mr-5 hover:text-gray-900">CALENDAR</a>
          </nav>
          <button className="inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5 mr-5">Log out</button>
          <button className="inline-flex items-center bg-[#88d1f9] border-0 py-1 rounded-2xl focus:outline-none rounded text-white mt-0 px-5">Setting</button>
        </div>
      </header>
    )
}