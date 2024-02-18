import React, { useEffect, useState } from "react";
import { Button, Layout } from "antd";
import FileBrowser from "./FileBrowser";
import FolderBreadcrumb from "./FolderBreadcrumb";
import useFolder, { useFolderStore } from "../hooks/useFolder";
import useHistory, { useWatchStore } from "../hooks/useHistory";

const { Content, Footer, Sider } = Layout;

const AppLayout = () => {
  const { openDialog } = useFolder();
  const [current, loadLastFolder] = useFolderStore((state) => [
    state.current,
    state.loadLastFolder,
  ]);
  const [loadHistory] = useWatchStore((state) => [state.load]);

  useEffect(() => {
    loadLastFolder();
    loadHistory();
  }, []);

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
