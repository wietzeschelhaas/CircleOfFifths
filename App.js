import React, { useState } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import CircleWheel from './Components/CircleWheel';
import { Picker } from '@react-native-picker/picker';

const majorKeysChords = {
  "C": ["C", "Dm", "Em", "F", "G", "Am", "Bdim"],
  "G": ["G", "Am", "Bm", "C", "D", "Em", "F#dim"],
  "D": ["D", "Em", "F#m", "G", "A", "Bm", "C#dim"],
  "A": ["A", "Bm", "C#m", "D", "E", "F#m", "G#dim"],
  "E": ["E", "F#m", "G#m", "A", "B", "C#m", "D#dim"],
  "B": ["B", "C#m", "D#m", "E", "F#", "G#m", "A#dim"],
  "F♯": ["F#", "G#m", "A#m", "B", "C#", "D#m", "E#dim"],
  "D♭": ["Db", "Ebm", "Fm", "Gb", "Ab", "Bbm", "Cdim"],
  "A♭": ["Ab", "Bbm", "Cm", "Db", "Eb", "Fm", "Gdim"],
  "E♭": ["Eb", "Fm", "Gm", "Ab", "Bb", "Cm", "Ddim"],
  "B♭": ["Bb", "Cm", "Dm", "Eb", "F", "Gm", "Adim"],
  "F": ["F", "Gm", "Am", "Bb", "C", "Dm", "Edim"],
};


export default function App() {

  const [selectedKey, setSelectedKey] = useState(null);
  const [selectedChords, setSelectedChords] = useState(majorKeysChords["C"]);
  const [selectedValue, setSelectedValue] = useState("option1");

  const [chordsToPlay, setChordsToPlay] = useState("");

  const handleKeyChange = (key) => {
    setSelectedKey(key);
    setSelectedChords(majorKeysChords[key]);
  };

  const handleButtonPress = () => {
    switch (selectedValue) {
      case "option1":
        const indices = [0, 3, 4];
        const randomChords = indices.map(index => selectedChords[index]);
        let chordsToPlay = "\n\n";

        for (let i = 0; i < 5; i++) {
          // Shuffle the array to ensure randomness
          const shuffledChords = randomChords.sort(() => 0.5 - Math.random());
          // Pick the first three unique chords
          const uniqueChords = shuffledChords.slice(0, 3);
          chordsToPlay += uniqueChords.join(", ") + "\n";
        }

        setChordsToPlay(chordsToPlay);
        break;
      case "option2":
        setChordsToPlay(selectedChords.join(", "));
        break;
      case "option3":
        setChordsToPlay(selectedChords.join(", "));
        break;
      default:
        console.log('No valid option selected.');
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>
        <CircleWheel onSegmentSelect={handleKeyChange} />
      </View>
      <Text style={styles.textStyle}>Select something</Text>
      <Picker
        selectedValue={selectedValue}
        style={styles.pickerStyle}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
      >
        <Picker.Item label="I-IV-V" value="option1" />
        <Picker.Item label="I-IV-V-vi" value="option2" />
        <Picker.Item label="All" value="option3" />
      </Picker>
      <Button
        title="Press Me"
        onPress={handleButtonPress}
        color="#841584"
      />
      {selectedKey !== null && (
        <Text style={styles.textStyle}>Selected Key: {selectedKey}</Text>
      )}
      <Text style={styles.textStyle}> Chords to play: {chordsToPlay}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '50%',  
  },
  textStyle: {
    color: 'black',
    fontSize: 25,
    marginTop: 20, 
  },
  pickerStyle: {
    width: '100%',
    height: 50,
    marginTop: 20,
  }
});