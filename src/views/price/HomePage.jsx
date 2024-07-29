import React, { useRef, useState,useCallback } from 'react'
import { useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { useAuth } from '../other/AuthContext';
import MyLoader from '../MyLoader';
import { toastWarning } from '../components/Notifications';
export default function HomePage() {
  const { startLoad, stopLoad } = useAuth();
  const navigate=useNavigate();
  const [spinner,setSpinner]=useState(false);
  const [data, setData] = useState(null);
  const [deals, setDeals] = useState(JSON.parse(localStorage.getItem("deals")) || []);
  const query = useRef("");
  const [queryData, setQuery] = useState(JSON.parse(localStorage.getItem("query")) ||"");

  const fetchData = async () => {
    setSpinner(true);
    try {
      const response = await fetch(`https://rsg-price.vercel.app/api/search/?link=${query.current.value}`);
      const result = await response.json();
      if("error" in result){
        toastWarning("Maximum search limit reached try after some time")
      }
      else{

        setData(result);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setSpinner(false);
  };
  
  useEffect(() => {
    const fetchDeals = async () => {
        startLoad();
      try {
        if (deals.length>0||queryData) stopLoad()
        const response = await fetch("https://rsg-price.vercel.app/api/deals/");
        const result = await response.json();
        if (response.status == 200)
          setDeals(result);
          localStorage.setItem("deals", JSON.stringify(result));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
        stopLoad();
    };
    if(queryData)
    fetchData();
    fetchDeals();
  }, []);
  const handleSubmit = (event) => {
    event.preventDefault();
    setQuery(query.current.value);
    localStorage.setItem("query", JSON.stringify(query.current.value))
    if(query.current.value){
      fetchData()
    }
  }
const handleChange=()=>{
    localStorage.setItem("query", JSON.stringify(query.current.value))
    if(query.current.value){
      fetchData()
      }
  }
const debounce=(func)=>{
  let timer;
  return function(...args){
    const context=this;
    if(timer) clearTimeout(timer);
    timer=setTimeout(()=>{
      timer=null;
      func.apply(context,args);
    },300)
  }
}
const optimized=useCallback(debounce(handleChange),[])
 
  return (
    <MyLoader>
    <main>
    <center>
      <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input type="search" id="default-search" ref={query} value={queryData} onChange={()=>{setQuery(query.current.value);optimized()}} className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter product name or link" autoComplete='off'  required/>
          <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
        </div>
      </form>
      
      {spinner?
<div role="status">
<br/>
    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className="sr-only">Loading...</span>
   
</div>:""
}
      {queryData && data && data["queries"]["request"][0]["searchTerms"] ?
        <h1 className="lg:text-4xl md:text-3xl text-2xl text-gray-700 dark:text-white md:text-left font-bold my-3 text-center lg:text-left">Search: {data["queries"]["request"][0]["searchTerms"]}</h1>
        : ""}
      {queryData && data ? data["searchInformation"]["totalResults"] > 0 ?
        <div>

          <h5 className="mb-2 text-center text-1xl text-black font-bold tracking-tight text-gray-900 dark:text-white uppercase">Found {data["searchInformation"]["totalResults"]} results</h5>
          <div className="grid grid-cols-1 p-4 lg:grid-cols-2 md:grid-cols-2 gap-5  md:gap-4 md:p-0 lg:p-0 lg:gap-4 ">
            {data['items'].map((movie, index) => (
              <div key={index} className="w-full w-sm  border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 md:max-w-128 lg:max:w-128  overflow-hidden md:justify-self-center">
                <Link to={`/product/${movie.link}`}>
                  <div className="p-0">

                    <h5 className="m-3 text-center line-clamp-2 text-1xl text-black font-bold tracking-tight text-gray-900 dark:text-white uppercase">{movie.title}</h5>
                    <h5 className="m-3 text-center line-clamp-3 text-1xl text-black  tracking-tight text-gray-900 dark:text-white uppercase">{movie.snippet}</h5>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        : <h5 className="mb-2 text-1xl text-center text-black font-bold tracking-tight text-gray-900 dark:text-white uppercase">No results found</h5> : ""
      }
      {
        queryData?"":
      
        <>
        <h1 className="my-4 text-2xl font-bold text-black dark:text-white text-left">Today Deals</h1>
        <div className="my-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {!deals["error"] && deals.map((movie, index) => (
            <div key={index} className=" w-full md:max-w-80 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700  mx-auto overflow-hidden">
              <a onClick={()=>{navigate(`/product/${movie["product"].slug}`)}}>
                <img className="rounded-t-lg   h-40 w-auto" src={movie["product"].image} alt="img" />
                <div className="p-2">
                  <h5 className="mb-2 text-1xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-3 md:h-18 text-left">{movie["product"].name}</h5>

                  <div className=' text-left max-w-4xl text-gray-700 text-lg dark:text-white' >
                    <p>
                      <a className={`text-white ${movie["product"].rating > 3 ? "bg-green-600" : "bg-red-600"} text-xs rounded-lg  px-2.5 py-1 font-bold  `}>{movie.product.rating}</a><a className='text-xs'> ({movie.product.rating_count} ratings)</a>
                    </p>
                    <p>
                      <a className='text-xl font-bold text-black dark:text-white'>{movie["product"]["country"]["currency_icon"]}{movie["price"]}  </a>
                      <a className='text-sm font-medium text-slate-500 dark:text-gray-400  text-decoration-line: line-through'>  {movie["product"]["country"]["currency_icon"]}{movie["highest_price"]}</a>
                      <a className='text-sm font-bold text-green-700  dark:text-green-500 '>  {movie["discount"].toFixed(0)}% off</a>
                    </p>
                    <p className='text-xs font-medium text-slate-500 dark:text-gray-400'>{movie["store"]["name"]}</p>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
        </>
      

        }
</center>


    </main>
    </MyLoader>
  )
}
