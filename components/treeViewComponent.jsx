import React from "react";

export default function TreeViewComponent({ data, labelKey, onItemClick }) {
  return (
    <div className="tree-view">
      {data.map((item) => (
        <div key={item._id} className="tree-item">
          <button onClick={() => onItemClick(item)}>{item[labelKey]}</button>
        </div>
      ))}
    </div>
  );
}
