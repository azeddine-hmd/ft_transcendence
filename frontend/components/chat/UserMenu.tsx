import { useMemo, useState } from "react";  
import { DropDownButton } from "@progress/kendo-react-buttons";  

  
export const Menu = () => {  

    const items = [
        "Profile",
        "Message",
        "Block",
        "Invite to game",
      ];
  

  return (
    <div style={{"alignSelf":"center", "marginLeft":"10px"}}>
        <DropDownButton
        popupSettings={{
          animate: false,
          popupClass: "my-popup",
        }}
        items={items}
        text="..."
        size="small"
      />
    </div>
  );
};