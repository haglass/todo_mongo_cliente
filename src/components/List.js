import React from "react";
import ListItem from "./ListItem";

import { useSelector } from "react-redux";


const List = React.memo(({ todoData, setTodoData, deleteClick }) => {
  // console.log("List Rendering...");
  const user = useSelector((state) => state.user);
  return (
    <div>
      
     
      {todoData.map(
        (item) =>
          item.author.uid === user.uid && (
            <div key={item.id}>
              <ListItem
                item={item}
                todoData={todoData}
                setTodoData={setTodoData}
                deleteClick={deleteClick}
              />
            </div>
          )
      )}
    </div>
  );
});

export default List;
