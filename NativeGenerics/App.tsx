import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Fab from './src/components/buttons/Fab';
import Bootom from './src/components/buttons/Bootom';

const App = () => {
  const [counter, setcounter] = useState<number>(0);
  return (
    <View style={style.container}>
      <Text style={style.text}>Contador: {counter}</Text>
      <Bootom title='Iniciar Sesión' onpress={()=>console.log('Logueando..')}/>
      <Fab title='-1'onpress={ () => setcounter(counter - 1) } position='left'/>
      <Fab title='+1' onpress={ () => setcounter(counter + 1) } position='right'/>
    </View>
  )
}
export default App;
const style= StyleSheet.create({
container:{
  flex:1,
  justifyContent:'center'
},
text:{
  top:-10,
  alignSelf:'center',
  fontSize:35,
  fontWeight:'bold'
}
});
