import styles from '../styles/Home.module.css'
import { useState, useMemo } from 'react'

export function WinrateTable({type, dataArr}) {
    // Setup column sorting
    let descSortConfig = {
        key: 'games',
        desc: true,
    };
    const {sortedData, requestSort} = useSortableData(dataArr, descSortConfig);

    return (
        <div className={styles.card}>
            <table>
                <thead>
                    <tr>
                        <th>
                            <button type="button" onClick={() => requestSort('name')}>
                                {type}
                            </button>
                        </th>
                        <th>
                            <button type="button" onClick={() => requestSort('games')}>
                                Games
                            </button>
                        </th>
                        <th>
                            <button type="button" onClick={() => requestSort('winrate')}>
                                Winrate
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody style={{color: "black"}}>
                    {sortedData.map((matches) => (
                        <tr key={matches.name}>
                            <td>{matches.name}</td>
                            <td>{matches.games}</td>
                            <td>{matches.winrate}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

function useSortableData(dataArr, config) {
    const [sortConfig, setSortConfig] = useState(config);

    // Copy array into a new array and sort it
    const sortedItems = useMemo(() => {
        let sortedArr = [...dataArr];
        
        sortedArr.sort((a, b) => {
            // Strings are a special sorting case
            if (typeof a[sortConfig.key] == "string") {
                return sortConfig.desc ? b[sortConfig.key].localeCompare(a[sortConfig.key]) : a[sortConfig.key].localeCompare(b[sortConfig.key]);
            }
            else {
                return sortConfig.desc ? b[sortConfig.key] - a[sortConfig.key] : a[sortConfig.key] - b[sortConfig.key];
            }
        });
        
        return sortedArr;
    }, [dataArr, sortConfig]);
    
    // Toggle between descending and ascending
    const requestSort = (key) => {
        let desc = true;
        if (sortConfig.key === key && sortConfig.desc === desc) {
            desc = false;
        }

        setSortConfig({key, desc});
    }

    return { sortedData: sortedItems, requestSort };
}

