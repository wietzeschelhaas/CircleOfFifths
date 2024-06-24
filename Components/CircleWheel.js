import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Svg, { Circle, Path, Text as SVGText, G } from 'react-native-svg';

const CircleWheel = ({onSegmentSelect}) => {
  const numberOfSegments = 12;
  const radius = 200;
  const viewBoxSize = 2 * (radius + 10);
  const center = radius + 10;
  const [activeSegment, setActiveSegment] = useState(null);
  const [leftSegment, setLeftSegment] = useState(null);
  const [rightSegment, setRightSegment] = useState(null);
  const [minorChords, setMinorChords] = useState([]);

  const notes = ["A", "E", "B", "F♯", "D♭", "A♭", "E♭", "B♭", "F", "C", "G", "D"];
  const roman = ["IV" ,"I","V","ii","vi","iii"]

  const getTextPosition = (index) => {
    const angle = (2 * Math.PI) / numberOfSegments;
    const startAngle = index * angle - Math.PI / 12;
    const endAngle = startAngle + angle;
    const midAngle = (startAngle + endAngle) / 2;

    const textRadius = radius - 40;
    const textX = center + textRadius * Math.cos(midAngle);
    const textY = center + textRadius * Math.sin(midAngle);

    return { x: textX, y: textY };
  };

  const getRomanNumeralPosition = (index, numberRadius) => {
    const angle = (2 * Math.PI) / numberOfSegments;
    const startAngle = index * angle - Math.PI / 12;
    const endAngle = startAngle + angle;
    const midAngle = (startAngle + endAngle) / 2;
  
    const textX = center + numberRadius * Math.cos(midAngle);
    const textY = center + numberRadius * Math.sin(midAngle);
  
    return { x: textX, y: textY };
  };

  const getSegmentPath = (index) => {
    const angle = (2 * Math.PI) / numberOfSegments;
    const startAngle = index * angle - Math.PI / 12;
    const endAngle = startAngle + angle;
  
    const largeArcFlag = angle > Math.PI ? 1 : 0;
    const innerRadius = radius - 90;
  
    // Calculate start and end points for inner and outer arcs
    const innerStartX = center + innerRadius * Math.cos(startAngle);
    const innerStartY = center + innerRadius * Math.sin(startAngle);
    const innerEndX = center + innerRadius * Math.cos(endAngle);
    const innerEndY = center + innerRadius * Math.sin(endAngle);
  
    const outerStartX = center + radius * Math.cos(startAngle);
    const outerStartY = center + radius * Math.sin(startAngle);
    const outerEndX = center + radius * Math.cos(endAngle);
    const outerEndY = center + radius * Math.sin(endAngle);
  
    // Construct the path for the SVG
    return `M ${innerStartX} ${innerStartY} 
            L ${outerStartX} ${outerStartY} 
            A ${radius} ${radius} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY} 
            L ${innerEndX} ${innerEndY} 
            A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY} Z`;
  };

  const handlePressIn = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    const x = locationX - center;
    const y = locationY - center;
    let angle = Math.atan2(y, x);

    angle += Math.PI / 6;
    angle -= Math.PI / 12;

    if (angle < 0) {
      angle += 2 * Math.PI;
    } else if (angle >= 2 * Math.PI) {
      angle -= 2 * Math.PI;
    }

    const segmentIndex = Math.floor(angle / ((2 * Math.PI) / numberOfSegments));
    setActiveSegment(segmentIndex);
    setLeftSegment((segmentIndex - 1 + numberOfSegments) % numberOfSegments);
    setRightSegment((segmentIndex + 1) % numberOfSegments);
    setMinorChords([
      (segmentIndex + 2) % numberOfSegments,
      (segmentIndex + 3) % numberOfSegments,
      (segmentIndex + 4) % numberOfSegments
    ]);

    // Call the callback function with the selected segment index
    if (onSegmentSelect) {
      onSegmentSelect(notes[segmentIndex]);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPressIn={handlePressIn}>
        <Svg height={viewBoxSize} width={viewBoxSize} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="black"
            strokeWidth="4"
          />
          <Circle
            cx={center}
            cy={center}
            r={radius - 135} // Adjust the radius as needed for the smaller circle
            fill="none"
            stroke="grey"
            strokeWidth="2"
          />
          {Array.from({ length: numberOfSegments }).map((_, index) => (
            <G key={index}>
              <Path
                d={getSegmentPath(index)}
                fill={index === activeSegment ? '#F5A623' : (index === leftSegment || index === rightSegment ? '#FFD700' : (minorChords.includes(index) ? '#519ccb' : '#F9F9F9'))}
                stroke="#333333"
                strokeWidth="1"
              />
              <SVGText
                x={getTextPosition(index).x}
                y={getTextPosition(index).y}
                fill="black"
                fontSize="48"
                textAnchor="middle"
                alignmentBaseline="central"
              >
              {notes[index]}
              </SVGText>
              {(index === activeSegment || index === leftSegment || index === rightSegment || minorChords.includes(index)) && (
                <SVGText
                  x={getRomanNumeralPosition(index, radius - 115).x} // Adjust radius for number position
                  y={getRomanNumeralPosition(index, radius - 115).y}
                  fill="black"
                  fontSize="35"
                  textAnchor="middle"
                  alignmentBaseline="central"
                >
        {index === leftSegment ? roman[0] :
         index === activeSegment ? roman[1] :
         index === rightSegment ? roman[2] :
         minorChords.includes(index) ? roman[(minorChords.indexOf(index) + 3) % roman.length] : ''}
                </SVGText>
              )}
            </G>
          ))}
        </Svg>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 50,
  },
});

export default CircleWheel;