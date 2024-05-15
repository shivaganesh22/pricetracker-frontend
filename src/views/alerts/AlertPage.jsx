import React, { useState,useEffect} from 'react'
import { Link } from 'react-router-dom';
import { toastSuccess, toastWarning } from '../components/Notifications';
import { useAuth } from '../other/AuthContext';
import MyLoader from '../MyLoader';
export default function AlertPage() {
    const [data,setData]=useState(null);
    const {startLoad,stopLoad}=useAuth();
    const fetchData = async () => {
          startLoad();
          try {
            const response = await fetch("https://rsg-price.vercel.app/api/alert/", {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization':`Token ${localStorage.getItem('token')}`
              },
            });
            const result = await response.json();
            setData(result);
            
          } catch (error) {
            console.error('Error fetching data:', error);
          }
          stopLoad();
        };
    const deleteAlert = async (id) => {
        //   startLoad();
          try {
            const response = await fetch(`https://rsg-price.vercel.app/api/alert/`+id+"/", {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Authorization':`Token ${localStorage.getItem('token')}`
              },
            });
            const result = await response.json();
            if(response.status==200){
                toastSuccess("Deleted Successfully")
                fetchData();
            }
            else toastWarning(result["error"])
            
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        //   stopLoad();
        };
    useEffect(() => {  
        fetchData();
      },[]);
  return (
   < MyLoader>
   <main>
    
{data?data.length>0?
<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-16 py-3">
                    <span className="sr-only">Image</span>
                </th>
                <th scope="col" className="px-6 py-3">
                    Product
                </th>
                <th scope="col" className="px-6 py-3">
                    Price
                </th>
                <th scope="col" className="px-6 py-3">
                    Action
                </th>
            </tr>
        </thead>
        <tbody>
            {data.map((movie,index)=>(
            
                <tr key={index} className="bg-white border-b border-gray-300 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="p-4">
                    <center>

                    <img src={`${movie["image"]}`} className="h-16  max-w-16 w-auto md:h-32 md:max-w-32" alt="img" />
                    </center>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white ">
                <Link to={`/product/${movie.slug}`}>
                   <p className='line-clamp-3'>{movie.name}</p>
                </Link>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {movie.price}
                </td>
                <td className="px-6 py-4">
                    <button onClick={()=>{deleteAlert(movie.id)}} className="font-medium text-red-600 dark:text-red-500 hover:underline">Remove</button>
                </td>
            </tr>
           
            ))}
            
           
        </tbody>
    </table>
</div>
:<h5 className="mb-2 text-1xl text-center text-black font-bold tracking-tight text-gray-900 dark:text-white uppercase">No alerts found</h5>:""}
   </main>
   </MyLoader>
  )
}
