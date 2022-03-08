import { StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { useState, useEffect } from 'react';
import Bird from './components/Bird';
import Obstacles from './components/Obstacles';

export default function App() {
  const screenWidth = Dimensions.get('screen').width;
  const screenHeight = Dimensions.get('screen').height;
  // Checks height + width of screen

  const birdLeft = screenWidth / 2;
  // birdLeft = the point at the bottom left of the div
  // important when it comes to collisions

  const [birdBottom, setBirdBottom] = useState(screenHeight / 2);
  // ensures the bird always starts at the middle of the screen

  const [obstaclesLeft, setObstaclesLeft] = useState(screenWidth);
  const [obstaclesLeftTwo, setObstaclesLeftTwo] = useState(screenWidth + (screenWidth / 2) + 30);
  // Obstacles are set to the left of the screen before going off screen

  const [obstaclesNegHeight, setObstaclesNegHeight] = useState(0);
  const [obstaclesNegHeightTwo, setObstaclesNegHeightTwo] = useState(0);
  // Obstacles are always going to start at zero, before being randomized

  const [score, setScore] = useState(0); 
  // Sets score to zero before jump function is called

  const obstacleWidth = 60
  const obstacleHeight = 300;
  const gap = 200;

  const gravity = 3;
  let gameTimerId;
  let obstaclesLeftTimerId;
  let obstaclesLeftTimerIdTwo;

  const [isGameOver, setIsGameOver] = useState(false);
  // isGameOver = false, when the game is not over

  // Start bird falling: 
  useEffect(() => {
    if(birdBottom > 0 ) {
      gameTimerId = setInterval(() => {
        setBirdBottom(birdBottom => birdBottom - gravity);
      }, 30);
      // Starts a timer, sets interval to every 30 milliseconds (invokes the function)
      // As long as birdBottom > 0, set birdBottom - 3, every 30 milliseconds

      return () => {
        clearInterval(gameTimerId);
      }
    }
  }, [birdBottom]);
  // console.log(birdBottom);

  const jump = () => {
    if (!isGameOver && (birdBottom < screenHeight)) {
      setBirdBottom(birdBottom => birdBottom + 50);
      // If game is not over, and birdBottom > screen height, set birdBottom + 50
      console.log('jumped')
    }
  };

  // Start first set of obstacles:
  useEffect(() => {
    if (obstaclesLeft > -obstacleWidth) {
      // removes the obstacles from screen
      obstaclesLeftTimerId = setInterval(() => {
        setObstaclesLeft(obstaclesLeft => obstaclesLeft - 5);
      }, 30);

      return () => {
        clearInterval(obstaclesLeftTimerId);
      }
      // As soon as obstcles are off screen, clear the timer ID
      // If obstacles is larger than obstacleWidth, keep putting it on loop and clear the interval... 
    } else {
      setObstaclesLeft(screenWidth);
      setObstaclesNegHeight( - Math.random() * 100);
      setScore(score => score +1);
      // ..else set the obstaclesLeft back to where is started
      // When we set the obstaclesLeft to restart at right hand side of screen, also set obstaclesNegHeight to random nr between 0-100
    }
  }, [obstaclesLeft]);

  // Start second set of obstacles: 
  useEffect(() => {
    if (obstaclesLeftTwo > -obstacleWidth) {
      obstaclesLeftTimerIdTwo = setInterval(() => {
        setObstaclesLeftTwo(obstaclesLeftTwo => obstaclesLeftTwo - 5);
      }, 30);
      return () => {
        clearInterval(obstaclesLeftTimerIdTwo);
      }
    } else {
      setObstaclesLeftTwo(screenWidth);
      setObstaclesNegHeightTwo( - Math.random() * 100);
      setScore(score => score +1);
    }
  }, [obstaclesLeftTwo]);

  // Check for collisions:
  useEffect(() => {
    if (
      ((birdBottom < (obstaclesNegHeight + obstacleHeight + 30) ||
      birdBottom > (obstaclesNegHeight + obstacleHeight + gap - 30)) && 
      (obstaclesLeft > screenWidth/2 -30 && obstaclesLeft < screenWidth/2 + 30))
      ||
      ((birdBottom < (obstaclesNegHeightTwo + obstacleHeight + 30)) ||
      birdBottom > (obstaclesNegHeightTwo + obstacleHeight + gap - 30)) && 
      (obstaclesLeftTwo > screenWidth/2 -30 && obstaclesLeftTwo < screenWidth/2 + 30))
      {
        console.log("game over");
        gameOver();
    }
      // If the birdBottom is smaller than bottom obstacle, 
      // or birdBottom is bigger than top obstacle, 
      // & the obstacle left is larger than the screen width (-30 (height of bird)) 
      // and the obstacle left is smaller than the screen width. 
      // Then that will be game over
  });

  const gameOver = () => {
    clearInterval(gameTimerId);
    clearInterval(obstaclesLeftTimerId);
    clearInterval(obstaclesLeftTimerIdTwo);
    setIsGameOver(true);
  };


  return (
    <TouchableWithoutFeedback onPress={jump}>
      {/* Touchable allows for the function jump to excecute when screen is pressed */}
      <View style={styles.container}>
        {isGameOver && <Text>{score}</Text> }
        <Bird
          birdBottom={birdBottom}
          birdLeft={birdLeft}
        />
        <Obstacles
          color={'green'}
          obstacleWidth={obstacleWidth}
          obstacleHeight={obstacleHeight}
          obstaclesLeft={obstaclesLeft}
          randomBottom={obstaclesNegHeight}
          gap={gap}
        />
        <Obstacles
          color={'orange'}
          obstacleWidth={obstacleWidth}
          obstacleHeight={obstacleHeight}
          obstaclesLeft={obstaclesLeftTwo}
          randomBottom={obstaclesNegHeightTwo}
          gap={gap}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
