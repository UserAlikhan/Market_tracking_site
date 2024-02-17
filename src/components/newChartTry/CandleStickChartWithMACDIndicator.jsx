import React, { useState } from "react";
import PropTypes from 'prop-types'

import { format } from 'd3-format'
import { timeFormat } from 'd3-time-format'

import { Chart, ChartCanvas } from "react-stockcharts";
import {
    BarSeries,
    AreaSeries,
    CandlestickSeries,
    LineSeries,
    MACDSeries
} from 'react-stockcharts/lib/series'
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
    CrossHairCursor,
    EdgeIndicator,
    CurrentCoordinate,
    MouseCoordinateX,
    MouseCoordinateY
} from 'react-stockcharts/lib/coordinates'

import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale'
import {
    OHLCTooltip,
    MovingAverageTooltip,
    MACDTooltip
} from 'react-stockcharts/lib/tooltip'
import { ema, macd, sma } from 'react-stockcharts/lib/indicator'
import { fitWidth } from "react-stockcharts/lib/helper"; 

// liblaries for making interactive tools
import { TrendLine, FibonacciRetracement, InteractiveText } from 'react-stockcharts/lib/interactive'

import CustomRectangle from "../interactiveComponents/CustomRectangle";
import { saveInteractiveNodes, getInteractiveNodes } from "./interactiveutils";

const macdAppearance = {
    stroke: {
        macd: '#FF0000',
        signal: '#00F300',
    },
    fill: {
        divergence: '#4682B4',
    },
}

const mouseEdgeAppearance = {
    textFill: '#542605',
    stroke: '#05233B',
    strokeOpacity: 1,
    stokeWidth: 3,
    arrowWidth: 5,
    fill: '#BCDEFA',
}

const CandleStickChartWithMACDIndicator = ({ type, width, ratio, data: initialData }) => {

    console.log('Data ', type, width, ratio)

    // convert components of data to number
    // in order to calculate macd in the future
    initialData = initialData.map(d => ({
        ...d,
        close: +d.close,
        high: +d.high,
        low: +d.low,
        open: +d.open,
        volume: +d.volume,
    }))

    console.log('Initial ', initialData)
    
	const ema26 = ema()
		.id(0)
		.options({ windowSize: 26 })
		.merge((d, c) => { d.ema26 = c; })
		.accessor(d => d.ema26);

	const ema12 = ema()
		.id(1)
		.options({ windowSize: 12 })
		.merge((d, c) => {d.ema12 = c;})
		.accessor(d => d.ema12);

	const macdCalculator = macd()
        // setting default parameters of macd
		.options({
			fast: 12,
			slow: 26,
			signal: 9,
		})
        // data conversion at each step
        // of the indicator calculation
		.merge((d, c) => {
            d.macd = c
        })
        // this method is uses to determine which indicator
        // value should be used from the data object when 
        // plotting
		.accessor(d => {
            return d.macd
        });

	const smaVolume50 = sma()
		.id(3)
		.options({
			windowSize: 50,
			sourcePath: "volume",
		})
		.merge((d, c) => {d.smaVolume50 = c;})
		.accessor(d => d.smaVolume50);

	const calculatedData = smaVolume50(macdCalculator(ema12(ema26(initialData))));
    console.log('calculatedData ', calculatedData)

	const xScaleProvider = discontinuousTimeScaleProvider
		.inputDateAccessor(d => {
            if (!d || d.date === undefined){
                return null
            } else {
                return new Date(d.date)
            }
        });

	const {
		data,
		xScale,
		xAccessor,
		displayXAccessor,
	} = xScaleProvider(calculatedData);

    // const InteractiveTextComp = InteractiveText()
    //     .onClick((e, textData, index) => console.log('InteractiveText clicked ', textData, index))

    const [interactiveMode, setInteractiveMode] = useState('draw');
    const [interactiveRectangeMode, setInteractiveRectangleMode] = useState(false)

	// Fibbanaci Code
    const [enableFib, setEnableFib] = useState(false)
	const [retracements1, setRetracements1] = useState([]);
  	const [retracements3, setRetracements3] = useState([]);

	const saveInteractiveNodesHandler = saveInteractiveNodes.bind({})
	const getInteractiveNodesHandler = getInteractiveNodes.bind({});
  
	const onFibComplete1 = (retracements) => {
	  setRetracements1(retracements);
	  setEnableFib(false);
	};
  
	const onFibComplete3 = (retracements) => {
	  setRetracements3(retracements);
	  setEnableFib(false);
	};
	// Fibbanaci Code

    const [trendLines, setTrendLines] = useState([])
    const [drawingRectangle, setDrawingRectangle] = useState([])

    function handleInteractiveSelection(startXY, endXY) {

        if (interactiveMode === 'move'){
            console.log('Line Coords ', startXY[0].start, startXY[0].end)
			
			const newLine = {
				startXY: startXY[0].start[1],
				endXY: startXY[0].end[1],
				appearance: {}
			};
			console.log('NEW LINE ', newLine)
			setTrendLines((prevLines) => {
				console.log('prevLines ', prevLines)
				console.log('new Line ',  newLine)
				return [...prevLines, newLine]
			}, () => {
				console.log('Trendlines1 ', trendLines)	
			})
			console.log('Trendlines2 ', startXY[0].start[1])
        }

		if (interactiveRectangeMode === true) {
			
			const newRectangle = {
				startXY: startXY[0].start[1],
				endXY: startXY[0].end[1],
				appearance: {}
			}

			setDrawingRectangle((prevRectangle) => [...prevRectangle, newRectangle], () => {
				console.log('RECTANGLE ', drawingRectangle)
			})
		}
    }

    console.log('INTR ', interactiveMode)

    return (
        <>
            <ChartCanvas height={600}
				width={width}
				ratio={ratio}
				margin={{ left: 70, right: 70, top: 20, bottom: 30 }}
				type={type}
				seriesName="MSFT"
				data={data}
				xScale={xScale}
				xAccessor={xAccessor}
				displayXAccessor={displayXAccessor}
                interactiveMode={interactiveMode}
			>

				<Chart id={1} height={400}
					yExtents={[d => [d.high, d.low], ema26.accessor(), ema12.accessor()]}
					padding={{ top: 10, bottom: 20 }}
				>

                    <TrendLine
                        enabled={interactiveMode === 'move'}
                        type="LINE"
                        snap={true}
                        snapTo={d => [d.high, d.low]}
                        onStart={() => console.log('TrendLine start')}
                        onComplete={(start, end) => handleInteractiveSelection(start, end)}
                    />

					<FibonacciRetracement
						ref={saveInteractiveNodesHandler("FibonacciRetracement", 1)}
						enabled={enableFib}
						type="BOUND"
						retracements={retracements1}
						onComplete={onFibComplete1}
					/>

                    {/* <FibonacciRetracement
                        enabled={interactiveModeFib === true}
                        snap={true}
                        snapTo={d => [d.high, d.low]}
                        onStart={() => console.log('Fib start')}
                        onComplete={(start, end) => handleInteractiveSelection(start, end)}
                    /> */}

					{drawingRectangle.map((rectangle, index) => {
						<CustomRectangle 
							key={index}
							onStart={rectangle.startXY}
							onComplete={rectangle.endXY}
						/>
					})}

                    {trendLines.map((line, index) => (
                        <TrendLine
							key={index}
							type="LINE"
							start={line.startXY}
							end={line.endXY}
                        />
                    ))}

					<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />
					<YAxis axisAt="right" orient="right" ticks={5} />

					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")}
						{...mouseEdgeAppearance}
					/>

					<CandlestickSeries />
					<LineSeries yAccessor={ema26.accessor()} stroke={ema26.stroke()}/>
					<LineSeries yAccessor={ema12.accessor()} stroke={ema12.stroke()}/>

					<CurrentCoordinate yAccessor={ema26.accessor()} fill={ema26.stroke()} />
					<CurrentCoordinate yAccessor={ema12.accessor()} fill={ema12.stroke()} />

					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.close}
						fill={d => d.close > d.open ? "#A2F5BF" : "#F9ACAA"}
						stroke={d => d.close > d.open ? "#0B4228" : "#6A1B19"}
						textFill={d => d.close > d.open ? "#0B4228" : "#420806"}
						strokeOpacity={1}
						strokeWidth={3}
						arrowWidth={2}
					/>

					<OHLCTooltip origin={[-40, 0]}/>
					<MovingAverageTooltip
						onClick={e => console.log(e)}
						origin={[-38, 15]}
						options={[
							{
								yAccessor: ema26.accessor(),
								type: "EMA",
								stroke: ema26.stroke(),
								windowSize: ema26.options().windowSize,
							},
							{
								yAccessor: ema12.accessor(),
								type: "EMA",
								stroke: ema12.stroke(),
								windowSize: ema12.options().windowSize,
							},
						]}
					/>

                    <CustomRectangle enabled={interactiveRectangeMode} fill="red" opacity={0.7} />
				</Chart>
				<Chart id={2} height={150}
					yExtents={[d => d.volume, smaVolume50.accessor()]}
					origin={(w, h) => [0, h - 300]}
				>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".2s")}/>

					<MouseCoordinateY
						at="left"
						orient="left"
						displayFormat={format(".4s")}
						{...mouseEdgeAppearance}
					/>

					<BarSeries yAccessor={d => d.volume} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"} />
					<AreaSeries yAccessor={smaVolume50.accessor()} stroke={smaVolume50.stroke()} fill={smaVolume50.fill()}/>
				</Chart>
				<Chart id={3} height={150}
					yExtents={macdCalculator.accessor()}
					origin={(w, h) => [0, h - 150]} padding={{ top: 10, bottom: 10 }}
				>
					<XAxis axisAt="bottom" orient="bottom"/>
					<YAxis axisAt="right" orient="right" ticks={2} />

					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d")}
						rectRadius={5}
						{...mouseEdgeAppearance}
					/>
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")}
						{...mouseEdgeAppearance}
					/>

					<FibonacciRetracement
						ref={saveInteractiveNodesHandler("FibonacciRetracement", 3)}
						enabled={enableFib}
						type="BOUND"
						retracements={retracements3}
						onComplete={onFibComplete3}
					/>

					<MACDSeries yAccessor={d => d.macd}
						{...macdAppearance} />
					<MACDTooltip
						origin={[-38, 15]}
						yAccessor={d => d.macd}
						options={macdCalculator.options()}
						appearance={macdAppearance}
					/>
				</Chart>
				<CrossHairCursor />
			</ChartCanvas>

            <button onClick={() => setInteractiveMode(interactiveMode === 'draw' ? 'move' : 'draw')}>
                {interactiveMode === 'draw' ? 'Start Drawing' : 'Move'}
            </button>

            <button onClick={() => setInteractiveRectangleMode(interactiveRectangeMode === false ? true : false)}>
                {interactiveRectangeMode === true ? 'Рисуем' : 'Не'}
            </button>

            <button onClick={() => setEnableFib(enableFib === false ? true : false)}>
                {enableFib === true ? 'ФИБА ДА' : 'ФИБА НЕТ'}
            </button>
        </>
		);
}  

CandleStickChartWithMACDIndicator.propTypes = {
    data: PropTypes.array.isRequired,
    width: PropTypes.array.isRequired,
    ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
}

CandleStickChartWithMACDIndicator.defaultProps = {
    type: 'svg'
}

// CandleStickChartWithMACDIndicator = fitWidth(CandleStickChartWithMACDIndicator)

export default fitWidth(CandleStickChartWithMACDIndicator)