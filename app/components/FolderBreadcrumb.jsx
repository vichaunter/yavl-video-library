import React from "react";
import { sep } from "path";

const FolderBreadcrumb = ({ fullPath = "", onClick = () => null }) => {
  // Special case of "/" as fullPath => split give a ["", ""]
  const folders = fullPath === sep ? [""] : fullPath.split(sep);
  return (
    <div className="folder-breadcrumbs">
      {folders.map((folder, index) => {
        const bread = folders.slice(0, index + 1).join(sep) || sep;
        return (
          <React.Fragment key={bread}>
            <span role="button">{folder}</span>
            <span role="button">{sep}</span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default FolderBreadcrumb;
