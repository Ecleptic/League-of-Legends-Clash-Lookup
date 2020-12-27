import { useRouter } from 'next/router';
import SearchStyle from '../styles/SearchBar.module.css'

export function SearchBar() {
    const router = useRouter();
    let path = "";
  
    return (
        <div className={SearchStyle.card}>
            <form onSubmit={
                (e) => {
                    e.preventDefault();
                    if (path != "") {
                        router.push('/' + path)
                    }
                }}>

                <input 
                    type="text"
                    className={SearchStyle.input} 
                    placeholder="Summoner Name" 
                    onChange={(e) => path = e.target.value} 
                />
                <button type="submit" className={SearchStyle.button}>Search</button>
            </form>
        </div>
    )
}