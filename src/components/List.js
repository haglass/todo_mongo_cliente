import React from "react";
import ListItem from "./ListItem";

const List = React.memo( ({todoData, setTodoData,deleteClick}) => {
    
  // console.log("List Rendering...");
 

  return (
  <div>
    {todoData.map((item) => (
          <div  key={item.id}>
            <ListItem item={item} todoData={todoData} setTodoData={setTodoData} deleteClick={deleteClick}/>            
          </div>
        ))}
    </div>);
});

export default List;
