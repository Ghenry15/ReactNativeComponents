import { StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { btnStyles } from './BtnStyles';

interface Props {
  title:string;
  position?: 'left' | 'right';
  backgroundColor?:string;
  color?:string;
  onpress: () => void;
}

const Fab = (props:Props) => {

  const {title,position='right',backgroundColor='#5856d6',color='white',onpress} = props;
  
  return (
    <View
    style={[
      btnStyles.fabLocation,
      (position==='left') ? btnStyles.left : btnStyles.right
    ]}>
    <TouchableNativeFeedback onPress={onpress} background={TouchableNativeFeedback.Ripple('black',false,30)}>
      <View style={
        [btnStyles.fab,
        {backgroundColor:(backgroundColor) && backgroundColor}]
        }>
        <Text style={[btnStyles.fabText,{color:(color) && color}]}> {title} </Text>
      </View>
    </TouchableNativeFeedback>
    </View>
  )
}

export default Fab;