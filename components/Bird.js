import React from 'react';
import { View } from 'react-native';
// View  is esentially the encompasing div

const Bird = ({birdBottom, birdLeft}) => {  
  const birdWidth = 50; 
  const birdHeight = 60;

  return (
    <View style={{ 
      position: 'absolute', 
      backgroundColor: 'blue',
      width: 50, 
      height: 60,
      border: 'none',
      left: birdLeft - (birdWidth / 2),
      bottom: birdBottom - (birdHeight / 2),
    }} />
  )
}

export default Bird;