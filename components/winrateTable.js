import styles from '../styles/Home.module.css'
import { useState, useMemo } from 'react'

export function WinrateTable({type, dataArr}) {
    // Setup column sorting
    let descSortConfig = {
        key: 'games',
        desc: true,
    };
    const {sortedData, requestSort, getClassNamesFor} = useSortableData(dataArr, descSortConfig);

    return (
        <div className={styles.card}>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>
                            <button type="button" onClick={() => requestSort('name')} className={getClassNamesFor('name')}>
                                {type}
                            </button>
                        </th>
                        <th>
                            <button type="button" onClick={() => requestSort('games')} className={getClassNamesFor('games')}>
                                Games
                            </button>
                        </th>
                        <th>
                            <button type="button" onClick={() => requestSort('winrate')} className={getClassNamesFor('winrate')}>
                                Winrate
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((matches) => (
                        <tr key={matches.name}>
                            <td>
                                <img src={getUrl(matches.iconUrl, matches.name)} style= {{width: '50px', height: '50px'}} alt={matches.name}/>
                            </td>
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

function getUrl(url, name) {
    // No ban or champ not found
    if (url == "" || name == "Unsure") {
        return "QuestionMark.png";
    }
    // Role
    else if (url == undefined) {
        return name + ".png";
    }
    // Champion
    else {
        return url;
    }
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

    const getClassNamesFor = (name) => {
        if (sortConfig.key === name) {
            return sortConfig.desc ? 'descending' : 'ascending';
        }
        
        return 'none';
      };

    return { sortedData: sortedItems, requestSort , getClassNamesFor};
}

