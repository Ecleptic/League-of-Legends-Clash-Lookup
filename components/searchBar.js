import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css'
import searchStyle from '../styles/searchBar.module.css'

export function SearchBar() {
    const router = useRouter();
    let path = "";
  
    return (
        <div className={searchStyle.card}>
            <form onSubmit = {(e) => {
                e.preventDefault();
                router.push(path)}}>
                <input 
                    type="text"
                    className={searchStyle.input} 
                    placeholder="Summoner Name" 
                    onChange={(e) => path = e.target.value} 
                />
                <button type="submit" className={searchStyle.button}>Search</button>
            </form>
        </div>
    )
}