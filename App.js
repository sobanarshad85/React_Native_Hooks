import React, { Component, useReducer,useContext } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, CheckBox, TextInput } from 'react-native';
// import console = require('console');

appReducer = (state, action) => {
  switch (action.type) {
    case 'add': {
      return [
        ...state,
        {
          id: Date.now(),
          text: '',
          completed: false
        }
      ]
    }
    case 'delete':{
      // it could be return state.filter(item=>item.id!==action.payload)
      return state.filter((item)=>{
        return item.id!==action.payload
      })
    }
    case 'completed':{
      return state.map((item)=>{
        if(item.id === action.payload){
          return {...item,completed:!item.completed}
        };
        return item;
      })
    }
    default: {
      return state;
    }
  }
}

const Context=React.createContext();

export default function App() {
  const [state, dispatch] = useReducer(appReducer, [])
  return (
    <Context.Provider value={dispatch} >
    <View style={styles.container}>
      <Text style={styles.welcome}>Todo App Using Hook</Text>
      <TodosList state={state} />
      <TouchableOpacity onPress={() => dispatch({ type: 'add' })}><Text>Add Todo</Text></TouchableOpacity>
    </View>
    </Context.Provider>
  );
}

TodosList = ({ state }) => { // it can also be props and retrievel will be props.state
  return (
    <View>
      {
        state.map((item) => {
          return (
            <TodoItem key={item.id} {...item} />
          )
        })
      }
    </View>)
}

TodoItem = ({ id, completed, text }) => { //again it can be props and retreivel will be props.id
const dispatch =useContext(Context);
  return (
    <View style={{ flexDirection: 'row',marginBottom:5 }}>
      <CheckBox value={completed} onValueChange={()=>dispatch({type:'completed',payload:id})} />
      <TextInput defaultValue={text} 
      style={{borderColor:'gray',borderWidth:1,width:100}} />
      <TouchableOpacity onPress={()=>dispatch({type:'delete',payload:id})} >
        <Text>Delete</Text>
      </TouchableOpacity>
    </View>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
