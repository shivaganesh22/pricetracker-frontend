import React, { useRef, useState } from 'react'
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../other/AuthContext';
export default function HomePage() {
    const {startLoad,stopLoad,loading}=useAuth();
    const [data,setData]=useState(null);
    const query=useRef("");
    const [queryData,setQuery]=useState("");
    const handleSubmit = (event) => {
        event.preventDefault();
        setQuery(query.current.value);
        // setSpinner(true);
      }
      useEffect(() => {
        const fetchData = async () => {
        //   startLoad();
          try {
            const response = await fetch(`https://rsg-price.vercel.app/api/search/?link=${queryData}`);
            const result = await response.json();
            setData(result);
            
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        //   stopLoad();
        };
        if(queryData)
        fetchData();
      },[queryData]);
    
    return (
        <main>
            
            <form className="max-w-md mx-auto">
                <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input type="search" id="default-search" ref={query} value={queryData} onChange={handleSubmit} className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter product name or link" autoComplete='off' required />
                    <button type="submit" onClick={handleSubmit} className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                </div>
            </form>
            {data && data["queries"]["request"][0]["searchTerms"]?
            <h1 className="lg:text-4xl md:text-3xl text-2xl text-gray-700 dark:text-white md:text-left font-bold my-3 text-center lg:text-left">Search: {data["queries"]["request"][0]["searchTerms"]}</h1>
            :"" }
            {data?data["searchInformation"]["totalResults"]>0?
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
            : <h5 className="mb-2 text-1xl text-center text-black font-bold tracking-tight text-gray-900 dark:text-white uppercase">No results found</h5>:""
        }
            
        
        </main>
    )
}
