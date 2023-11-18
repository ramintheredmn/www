import {useState, useEffect} from 'react'
import axios from 'axios'





export default function Combobox(){

    const options = {
        method: 'GET',
        url: 'https://myhealthbox.p.rapidapi.com/search/alerts',
        params: {
          q: 'aspirin',
          c: 'us',
          l: 'en',
          limit: '10',
          from: '0'
        },
        headers: {
          'X-RapidAPI-Key': '8c0862bf60mshcab92017bdcc3ccp1c717cjsn87203a3cfea6',
          'X-RapidAPI-Host': 'myhealthbox.p.rapidapi.com'
        }
      };

      const fetch = async () => {

        try {
            const response = await axios.request(options);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
        
      }


      useEffect(() => {
        fetch()
      }, [])

    
    return(
        <div>

        </div>
    )
}
