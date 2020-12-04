import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css'

export function SearchBar() {
    const router = useRouter();
    let test = "";
  
    return (
        <div className={styles.card}>
            <form onSubmit = {(e) => {
                e.preventDefault();
                router.push(test)}}>
                <input 
                    type="text" 
                    placeholder="Summoner Name" 
                    onChange={(e) => test = e.target.value} 
                />
                <button type="submit">Search</button>
            </form>
        
        
        </div>
    )
}