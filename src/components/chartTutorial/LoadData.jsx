import React, {useState, useEffect} from "react"
import Papa from 'papaparse'
import { func } from "prop-types"
import ChartJS from "./Chart"
import CandleStickChartWithMACDIndicator from "../newChartTry/CandleStickChartWithMACDIndicator"

const LoadData = () => {
    const [data, setData] = useState([])
    
    function parseTsvFile(file, onDataParsed) {
        Papa.parse(file, {
            complete: (result) => {
                onDataParsed(result.data)
            },
            header: true,
            delimiter: '\t'
        })
    }

    async function loadRemoteFile() {
        try {
            const response = await fetch("https://cdn.rawgit.com/rrag/react-stockcharts/master/docs/data/MSFT.tsv")
            const tsvText = await response.text()
            // convert tsv file to Blob
            const tsvBlob = new Blob([tsvText], {type: 'text/tsv'})
            const tsvFile = new File([tsvBlob], 'MSFT.tsv')

            parseTsvFile(tsvFile, (parsedData) => {
                // filter out undefined values from parsedData
                const filteredData = parsedData.filter((item) => item !== undefined)
                setData(filteredData);
            });
        } catch (error) {
            console.error("Error fetching or parsing the remote TSV file:", error)
        }
    }

    useEffect(() => {
        loadRemoteFile()
    }, [])

    return (
        <>
            {data.length > 0 ? <CandleStickChartWithMACDIndicator width={1300} ratio={1} type="svg" data={data}/> : null}
        </>
    )
}

export default LoadData