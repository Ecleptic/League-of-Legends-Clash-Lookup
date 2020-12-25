import WinrateStyles from '../styles/WinrateTable.module.css'
import { getWinrateColor } from '../lib/StyleUtilities.js'
import { useState, useMemo } from 'react'

export function WinrateTable({title, colTitle, dataArr}) {
    // Setup column sorting
    let descSortConfig = {
        key: 'games',
        desc: true,
    };
    const {sortedData, requestSort, getClassNamesFor} = useSortableData(dataArr, descSortConfig);

    return (
        <div className={WinrateStyles.card}>
            <table className={WinrateStyles.table}>
                <caption className={WinrateStyles.title}>{title}</caption>
                <thead>
                    <tr>
                        <th colSpan="2">
                            <button 
                                type="button" 
                                onClick={() => requestSort('name')} 
                                className={WinrateStyles.leftButton + ' ' + getClassNamesFor('name')}>
                                {colTitle}
                            </button>
                        </th>
                        <th>
                            <button 
                                type="button" 
                                onClick={() => requestSort('games')} 
                                className={WinrateStyles.button + ' ' + getClassNamesFor('games')}>
                                Games
                            </button>
                        </th>
                        <th>
                            <button 
                                type="button" 
                                onClick={() => requestSort('winrate')} 
                                className={WinrateStyles.rightButton + ' ' + getClassNamesFor('winrate')}>
                                Winrate
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((matches) => (
                        <tr key={matches.name}>
                            <td>
                                <img src={getUrl(matches.iconUrl, matches.name)} className={WinrateStyles.img} alt={matches.name}/>
                            </td>
                            <td>{matches.name}</td>
                            <td>{matches.games}</td>
                            <td style={getWinrateColor(matches.winrate)}>{matches.winrate}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

function getUrl(url, name) {
    // No ban or champ not found
    if (url == "") {
        return "Unsure.png";
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

    // Get css for descending/ascending/none
    const getClassNamesFor = (name) => {
        if (sortConfig.key === name) {
            return sortConfig.desc ? WinrateStyles.descending : WinrateStyles.ascending;
        }
        
        return '';
      };

    return { sortedData: sortedItems, requestSort , getClassNamesFor};
}

