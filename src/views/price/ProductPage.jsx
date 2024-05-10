import { useEffect, useState } from 'react';
import React from 'react'
import { toastSuccess,toastWarning } from '../components/Notifications';
import { useParams, Link,useNavigate } from 'react-router-dom'
import { generateToken } from '../../firebase';
export default function ProductPage() {
    const navigate=useNavigate();
    const params = useParams();
    const [data, setData] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            //   startLoad();
            try {
                const response = await fetch(`https://rsg-price.vercel.app/api/product/?link=${params.id}`);
                const result = await response.json();
                setData(result);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
            //   stopLoad();
        };
        fetchData();
    }, [params.id]);
    const setAlert = async () => {
        //   startLoad();
        if (localStorage.getItem('token') == null) navigate('/login')
        else{
            generateToken();
        try {
            const response = await fetch("https://rsg-price.vercel.app/api/alert/", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization':`Token ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({"name":data["name"],"image":data["image"],"price":data["price"],"slug":data["slug"]}),
            });
      
            const result = await response.json();
            console.log(result);
            if (response.status==200) {
              
            toastSuccess('Alert Added')
              navigate('/alerts');
              
            }
      
            else {
              toastWarning(result["error"])
            }
          } catch (error) {
            
          }}
        //   stopLoad();
    };
    return (
        <main>
            <center>
                {data ?
                    <>
                        <section className="flex justify-around flex-wrap py-5">
                            <div className="max-w-sm border border-gray-300 rounded-lg shadow">
                                <img className="rounded w-auto h-72 max-w-72" src={data.image} alt={data.name} />
                            </div>
                            <div className="max-w-4xl text-gray-700 text-lg dark:text-white">
                                <h1 className="lg:text-3xl md:text-2xl line-clamp-3 text-2xl text-left font-bold my-3  lg:text-left">{data && data.name}</h1>
                                <div className='my-4 text-left' >
                                    <p>
                                        <a className={`text-white ${data.rating > 3 ? "bg-green-600" : "bg-red-600"} text-xs rounded-lg  px-2.5 py-1 font-bold  `}>{data.rating}</a><a className='text-xs'> ({data.rating_count} ratings)</a>
                                    </p>
                                    <p>
                                        <a className='text-2xl font-bold text-black dark:text-white'>{data["country"]["currency_icon"]}{data["price"]}  </a>
                                        <a className='text-lg font-medium text-slate-500 dark:text-gray-400  text-decoration-line: line-through'>  {data["country"]["currency_icon"]}{data["highest_price"]}</a>
                                        <a className='text-lg font-bold text-green-700  dark:text-green-500 '>  {data["discount"].toFixed(0)}% off</a>
                                    </p>
                                    <p className='text-xs font-medium text-slate-500 dark:text-gray-400'>Price updated at {new Date(data["price_fetched_at"]).toLocaleString()}</p>

                                </div>
                                <div className='mr-4 text-left text-white '>
                                    <p>
                                        <a className="focus:outline-none  bg-yellow-600 dark:bg-yellow-500 hover:bg-yellow-500 dark:hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900">Buy on {data["store"]["name"]}</a>
                                        <a onClick={()=>{setAlert()}} className="focus:outline-none  bg-blue-800 dark:bg-blue-600  hover:bg-blue-600 dark:hover:bg-blue-900 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900">Set price alert</a></p>

                                </div>
                            </div>
                        </section>
                        <iframe src={`https://pricehistoryapp.com/embed/${data["slug"]}`} frameborder="0" width="100%" height="450"></iframe>
                        <p className='text-left my-4 dark:text-white'>You can check the price history of {data["name"]} above. This product price is {data["price"]} but the lowest price is {data["lowest_price"]} and the MRP is {data["mrp"]}. The average and highest price are {data["average_price"]} and {data["highest_price"]} respectively.</p>
                        <h1 className=" text-2xl font-bold text-black dark:text-white text-left">Similar Products</h1>
                        <div className="flex overflow-x-auto">
                            {data["similar_products"].map((movie, index) => (
                                <div key={index} className="flex-none w-64 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mr-4 my-4">
                                    <Link to={`/product/${movie.slug}`}>
                                        <img className="rounded-t-lg h-40 w-auto" src={movie.image} alt="img" />
                                        <div className="p-2">
                                            <h5 className="mb-2 text-1xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-3 text-left">{movie.name}</h5>

                                            <div className=' text-left max-w-4xl text-gray-700 text-lg dark:text-white' >
                                                <p>
                                                    <a className={`text-white ${data.rating > 3 ? "bg-green-600" : "bg-red-600"} text-xs rounded-lg  px-2.5 py-1 font-bold  `}>{data.rating}</a><a className='text-xs'> ({data.rating_count} ratings)</a>
                                                </p>
                                                <p>
                                                    <a className='text-xl font-bold text-black dark:text-white'>{data["country"]["currency_icon"]}{data["price"]}  </a>
                                                    <a className='text-sm font-medium text-slate-500 dark:text-gray-400  text-decoration-line: line-through'>  {data["country"]["currency_icon"]}{data["highest_price"]}</a>
                                                    <a className='text-sm font-bold text-green-700  dark:text-green-500 '>  {data["discount"].toFixed(0)}% off</a>
                                                </p>
                                                <p className='text-xs font-medium text-slate-500 dark:text-gray-400'>{data["store"]["name"]}</p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                        <h1 className=" text-2xl font-bold text-black dark:text-white text-left">Deals related to this product</h1>
                        <div className="flex overflow-x-auto">
                            {data["similar_deals"].map((movie, index) => (
                                <div key={index} className="flex-none w-64 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mr-4 my-4">
                                    <Link to={`/product/${movie["product"].slug}`}>
                                        <img className="rounded-t-lg  h-40 w-auto" src={movie["product"].image} alt="img" />
                                        <div className="p-2">
                                            <h5 className="mb-2 text-1xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-3 text-left">{movie["product"].name}</h5>

                                            <div className=' text-left max-w-4xl text-gray-700 text-lg dark:text-white' >
                                                <p>
                                                    <a className={`text-white ${data.rating > 3 ? "bg-green-600" : "bg-red-600"} text-xs rounded-lg  px-2.5 py-1 font-bold  `}>{data.rating}</a><a className='text-xs'> ({data.rating_count} ratings)</a>
                                                </p>
                                                <p>
                                                    <a className='text-xl font-bold text-black dark:text-white'>{data["country"]["currency_icon"]}{data["price"]}  </a>
                                                    <a className='text-sm font-medium text-slate-500 dark:text-gray-400  text-decoration-line: line-through'>  {data["country"]["currency_icon"]}{data["highest_price"]}</a>
                                                    <a className='text-sm font-bold text-green-700  dark:text-green-500 '>  {data["discount"].toFixed(0)}% off</a>
                                                </p>
                                                <p className='text-xs font-medium text-slate-500 dark:text-gray-400'>{data["store"]["name"]}</p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>


                    </>
                    : ""}

            </center>
        </main>
    )
}
