import useContextMenu from "./useContextMenu";


const Menu = () => {

  const { anchorPoint, show } = useContextMenu();

  

  if (show) {
    return (
      <ul className="menu" style={{ position: "absolute" , top: anchorPoint.y, left: anchorPoint.x }}>
        <li className="menu__item">
          
          Share
        </li>
        <li className="menu__item">
          
          Cut
        </li>
        <li className="menu__item">
          
          Copy to
        </li>
        <li className="menu__item">
          
          Download
        </li>
        <hr />
        <li className="menu__item">
          
          Refresh
        </li>
        <li className="menu__item">
          
          Delete
        </li>
      </ul>
    );
  }
  return <></>;
};

export default Menu;