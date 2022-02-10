import { StyleSheet } from "react-native";

export const btnStyles = StyleSheet.create({
  btnLocation:{
    position:'absolute',
    bottom:180,
    alignSelf:'center',
  },
  buton:{
    backgroundColor:'#5856d6',
    width:250,
    height:60,
    borderRadius:20,
    justifyContent:'center',
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 0.45,
    elevation: 5,
  },
  btnText:{
    alignSelf:'center',
    color:'white',
    fontSize:25,
    fontWeight:'bold'
  }, 

  //Fab 
  fabLocation:{
        position:'absolute',
        bottom:25,
      },
      right:{
        right:15
      },
      left:{
        left:15
      },
      fab:{
        width:60,
        height:60,
        borderRadius:100,
        justifyContent:'center',
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 7,
        },
        shadowOpacity: 0.75,
        shadowRadius: 5.45,
        elevation: 2,
      },
      fabText:{
        fontSize:25,
        fontWeight:'bold',
        alignSelf:'center'
      }  
});