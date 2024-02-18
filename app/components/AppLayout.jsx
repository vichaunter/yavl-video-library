import React, { useEffect, useState } from "react";
import { Button, Layout } from "antd";
import FileBrowser from "./FileBrowser";
import FolderBreadcrumb from "./FolderBreadcrumb";
import useFolder from "../hooks/useFolder";

const { Content, Footer, Sider } = Layout;

const AppLayout = () => {
  const { openDialog, current } = useFolder();

  return (
    <Layout>
      <Content>
        <Button onClick={openDialog}>Open folder</Button>
        <FolderBreadcrumb fullPath={current} />
        <FileBrowser folder={current} />
      </Content>
    </Layout>
  );
};

export default AppLayout;
