import { StyleSheet, Text, TouchableOpacity, View, TouchableNativeFeedback } from 'react-native';
import React from 'react'
import { btnStyles } from './BtnStyles'

interface Props{
  title:string;
  backgroundColor?:string;
  color?:string;
  onpress:()=>void;
}

const Bootom = (props:Props) => {

  const {title,backgroundColor='#5856d6',color='white',onpress}=props;
  
  return (
    <View style={btnStyles.btnLocation}>
      <TouchableNativeFeedback onPress={onpress} background={TouchableNativeFeedback.Ripple('black',false,122)}>
        <View style={[btnStyles.buton,{backgroundColor:(backgroundColor) && backgroundColor}]}>
          <Text style={[btnStyles.btnText,{color:(color) && color}]}>{title}</Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  )
}

export default Bootom;