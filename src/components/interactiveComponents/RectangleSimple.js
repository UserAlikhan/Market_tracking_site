import React, {Component, useRef} from "react";
import PropTypes from 'prop-types'

import { GenericChartComponent } from "react-stockcharts";
import { getMouseCanvas } from "react-stockcharts/lib/GenericComponent";
import { isDefined, noop, hexToRGBA, getStrokeDasharray, strokeDashTypes } from "react-stockcharts/lib/utils";

const RectagleSimple = ({ props }) => {

    const { x1Value, x2Value, y1Value, y2Value, interactiveCursorClass, stroke, 
        strokeWidth, strokeOpacity, strokeDasharray, type, onEdge1Drag, onEdge2Drag, onDragStart, onDrag, onDragComplete,
        onHover, onUnHover, defaultClassName, redgeFill, edgeStroke, edgeStrokeWidth,
        withEdge, children, tolerance, selected } = props

    const svgRef = useRef(null)

    const isHovering = (moreProps) => {
        const { tolerance } = moreProps

        if (isDefined(onHover)) {
            const { x1Value, x2Value, y1Value, y2Value, type } = props;
            const { mouseXY, xScale } = moreProps;
            const { chartConfig: { yScale } } = moreProps;

            const hovering = isHovering({
                x1Value, y1Value,
                x2Value, y2Value,
                mouseXY,
                type,
                tolerance,
                xScale,
                yScale,
            })
    
            return hovering
        }
        return false
    }

    const drawOnCanvas = (ctx, moreProps) => {
        const { x1, y1, x2, y2 } = helper(props, moreProps);

        const width = x2 - x1;
        const height = y2 - y1;

        ctx.beginPath()
        ctx.rect(x1, y1, width, height);
        ctx.stroke();
        
        if (withEdge) {
            ctx.fillStyle = hexToRGBA(edgeFill, strokeOpacity);
            ctx.strokeStyle = hexToRGBA(edgeStroke, strokeOpacity);
            ctx.lineWidth = edgeStrokeWidth;
      
            ctx.beginPath();
            ctx.arc(x1, y1, r, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
      
            ctx.beginPath();
            ctx.arc(x1, y2, r, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
      
            ctx.beginPath();
            ctx.arc(x2, y1, r, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
      
            ctx.beginPath();
            ctx.arc(x2, y2, r, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
        }
    }

    const renderSVG = (moreProps) => {
        const { x1, y1, x2, y2 } = helper(props, moreProps);
    
        const lineWidth = strokeWidth;
    
        return (
          <g>
            <line
              ref={svgRef}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={stroke}
              strokeWidth={lineWidth}
              strokeOpacity={strokeOpacity}
              strokeDasharray={getStrokeDasharray(strokeDasharray)}
              strokeLinecap="round"
            />
            {withEdge && (
              <>
                <circle cx={x1} cy={y1} r={r} fill={edgeFill} stroke={edgeStroke} strokeWidth={edgeStrokeWidth} />
                <circle cx={x1} cy={y2} r={r} fill={edgeFill} stroke={edgeStroke} strokeWidth={edgeStrokeWidth} />
                <circle cx={x2} cy={y1} r={r} fill={edgeFill} stroke={edgeStroke} strokeWidth={edgeStrokeWidth} />
                <circle cx={x2} cy={y2} r={r} fill={edgeFill} stroke={edgeStroke} strokeWidth={edgeStrokeWidth} />
              </>
            )}
          </g>
        )
    }

    return (
        <GenericChartComponent
            isHover={isHover}
            svgDraw={renderSVG}
            canvasDraw={drawOnCanvas}
            canvasToDraw={getMouseCanvas}
            onMouseDown={onDragStart}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            onContextMenu={onContextMenu}
            edgeInteractiveCursor={edgeInteractiveCursor}
            lineInteractiveCursor={interactiveCursorClass}
            edgeFill={edgeFill}
            edgeStroke={edgeStroke}
            edgeStrokeWidth={edgeStrokeWidth}
            withEdge={withEdge}
            hoverText={hoverText}
            selected={selected}
        />
    )
}

RectangleSimple.propTypes = {
    x1Value: PropTypes.any.isRequired,
    x2Value: PropTypes.any.isRequired,
    y1Value: PropTypes.any.isRequired,
    y2Value: PropTypes.any.isRequired,
    interactiveCursorClass: PropTypes.string,
    stroke: PropTypes.string.isRequired,
    strokeWidth: PropTypes.number.isRequired,
    strokeOpacity: PropTypes.number.isRequired,
    strokeDasharray: PropTypes.oneOf(strokeDashTypes),
    type: PropTypes.oneOf([
      "XLINE", // extends from -Infinity to +Infinity
      "RAY", // extends to +/-Infinity in one direction
      "LINE", // extends between the set bounds
    ]).isRequired,
    onEdge1Drag: PropTypes.func.isRequired,
    onEdge2Drag: PropTypes.func.isRequired,
    onDragStart: PropTypes.func.isRequired,
    onDrag: PropTypes.func.isRequired,
    onDragComplete: PropTypes.func.isRequired,
    onHover: PropTypes.func,
    onUnHover: PropTypes.func,
    defaultClassName: PropTypes.string,
    r: PropTypes.number.isRequired,
    edgeFill: PropTypes.string.isRequired,
    edgeStroke: PropTypes.string.isRequired,
    edgeStrokeWidth: PropTypes.number.isRequired,
    withEdge: PropTypes.bool.isRequired,
    children: PropTypes.func.isRequired,
    tolerance: PropTypes.number.isRequired,
    selected: PropTypes.bool.isRequired,
  };
  
  RectangleSimple.defaultProps = {
    onEdge1Drag: noop,
    onEdge2Drag: noop,
    onDragStart: noop,
    onDrag: noop,
    onDragComplete: noop,
    edgeStrokeWidth: 3,
    edgeStroke: "#000000",
    edgeFill: "#FFFFFF",
    r: 10,
    withEdge: false,
    strokeWidth: 1,
    strokeDasharray: "Solid",
    children: noop,
    tolerance: 7,
    selected: false,
  };
  
  export default RectangleSimple;