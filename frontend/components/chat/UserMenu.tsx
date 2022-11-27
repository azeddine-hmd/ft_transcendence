import { useMemo, useState } from "react";  

  
export const Menu = () => {  

    const items = [
        "Profile",
        "Message",
        "Block",
        "Invite to game",
      ];
  

  return (
    <div style={{"alignSelf":"center", "marginLeft":"10px"}}>
        {/* <DropDownButton
        popupSettings={{
          animate: false,
          popupClass: "my-popup",
        }}
        items={items}
        text="..."
        size="small"
      /> */}
    </div>
  );
};