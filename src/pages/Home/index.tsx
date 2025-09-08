import React, { ReactNode, forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { Flex, InjectClass, useUpdate } from "../../natived";
import { Avatar, Button, Card, ConfigProvider, Dropdown, Spin } from "antd";
import { CloseOutlined, MinusOutlined, SettingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { localServices } from "../../services/localServices.ts";
import SidebarSvg from "../../svgs/Sidebar.svg?react";
import Icon from "@ant-design/icons/lib/components/Icon";
import { IUserInfomation } from "../../services/interfaces.ts";
import { useLocalStorageListener } from "../../services/utils.ts";
import DocumentsSvg from "../../svgs/Documents.svg?react";
import WorkspacesSvg from "../../svgs/Workspaces.svg?react";
import { clientServices } from "../../services/clientServices.ts";
import { remoteServices } from "../../services/remoteServices.ts";

export const dragClass = InjectClass(`
-webkit-app-region: drag;
`);

export interface IHomeProps {
    style?: React.CSSProperties;
}

export interface IHomeRef {
    refresh: (showLoading: boolean) => Promise<void>,
    refreshLayoutTabs: () => Promise<void>
}

export interface ILayoutTab {
    key: string,
    icon?: string,
    title: string,
    url: string
}


export const Home = forwardRef<IHomeRef, IHomeProps>((props, ref) => {
    const [sidebarVisible, updateSidebarVisible, sidebarVisibleRef] = useUpdate(false);
    const [loading, updateLoading, loadingRef] = useUpdate(0);
    const [loadingPercent, updateLoadingPercent, loadingPercentRef] = useUpdate<number | undefined>(undefined);
    const [loadingTip, updateLoadingTip, loadingTipRef] = useUpdate('');
    const [layoutTabs, updateLayoutTabs] = useUpdate<ILayoutTab[]>([]);
    const [currentTab, updateCurrentTab] = useUpdate<string>(localStorage.getItem('currentTab') ?? "documents");
    const delay = async (time: number) => new Promise(resolve => setTimeout(resolve, time));
    const self = useRef<IHomeRef>({
        refresh: async (showLoading: boolean) => {
            if (showLoading) updateLoading(loading => loading + 1);
            try {
                while (true) {
                    try {
                        await self.current?.refreshLayoutTabs();
                        break;
                    }
                    catch {
                        delay(1000);
                    }
                }
                clientServices.home();
                updateCurrentTab(localStorage.getItem('currentTab') ?? "documents");
            }
            catch (e) {
                console.log(e);
            }
            if (showLoading) {
                updateLoading(loading => loading - 1);
            }
        },
        refreshLayoutTabs: async () => {
            let layout = await remoteServices.getLayout();
            updateLayoutTabs(layout.tabs ?? []);
        }
    });
    useImperativeHandle(ref, () => self.current);
    useEffect(() => {
        (window as any).status = 'Easy PLM';
        self.current?.refresh(true);
    }, []);
    useEffect(() => {
        localStorage.setItem('currentTab', currentTab);
    }, [currentTab]);
    const renderIcon = (icon?: string) => {
        if (icon == "documents") return <DocumentsSvg></DocumentsSvg>;
        else if (icon == "workspaces") return <WorkspacesSvg></WorkspacesSvg>
        else return <></>;
    };
    const renderTab = (tab: ILayoutTab) => {
        return <Button style={{
            backgroundColor: tab.key == currentTab ? '#e6f7ff' : undefined
        }} type='text' icon={renderIcon(tab.icon)} onClick={() => {
            updateCurrentTab(tab.key);
        }}>{sidebarVisible ? tab.title : undefined}</Button>
    };
    const renderContentByUrl = (tab: ILayoutTab) => {
        if (tab.url.startsWith('/')) {
            return <iframe key={tab.url} src={tab.url} style={{
                flex: 1,
                height: 0,
                border: 'none',
                display: currentTab == tab.key ? undefined : 'none'
            }}></iframe>
        }
    };

    return <div style={{
        ...props.style,
        backgroundColor: '#f4f4f4',
        display: 'flex',
        flexDirection: 'column',
    }}>
        <Spin size={'large'} tip={<div style={{
            marginTop: '32px'
        }}>{loadingTip}</div>} percent={loadingPercent} spinning={loading > 0} fullscreen></Spin>
        {/* 顶部 */}
        <div style={{
            backgroundColor: '#fff',
            margin: '0px 0px 2px 0px',
            padding: '0px 0px 0px 4px',
            display: "flex",
            flexDirection: 'row',
        }}>
            <div style={{
                display: "flex",
                alignItems: 'center',
                padding: '0px 0px 0px 4px',
                fontStyle: 'italic',
                fontWeight: 'bold',
                fontSize: '24px',
                color: '#333',
                letterSpacing: '3px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.2), 0 0 10px rgba(100,100,100,0.1)',
                cursor: 'pointer',
                userSelect: 'none'
            }}>
                {"Web App"}
            </div>

            <div className={dragClass} onMouseDown={e => {
                clientServices.mouseDownDrag();
                e.preventDefault();
                e.stopPropagation();
            }} style={{
                flex: 1,
                userSelect: 'none'
            }}>

            </div>
            <div style={{
                display: "flex",
                alignItems: 'center',
                gap: '4px',
            }}>
                <Button type='text' icon={<SettingOutlined />} onClick={() => {
                    let currentUrl = window.location.pathname;
                    clientServices.openUrl(currentUrl + '/settings', {
                        x: 'center',
                        y: "center",
                        width: '80%',
                        height: '80%'
                    }, true);
                }}>{"Settings"}</Button>
                <Button type='text' icon={<MinusOutlined />} onClick={() => {
                    clientServices.minimize();
                }}>{"Minimize"}</Button>
                <Button type='text' icon={<CloseOutlined />} onClick={() => {
                    clientServices.close();
                }}>{"Close"}</Button>
            </div>

        </div>
        {/* 主体 */}
        <div style={{
            display: "flex",
            flexDirection: "row",
            flex: 1,
            height: 0
        }}>
            {/* 侧边 */}
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: '8px',
                width: sidebarVisible ? '120px' : '30px',
                backgroundColor: '#fff',
                margin: '0px 6px 0px 0px',
                padding: '0px 4px',
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    alignItems: 'start',
                }}>
                    {layoutTabs.map(tab => renderTab(tab))}
                </div>
                <div>
                    <Button type='text' icon={<SidebarSvg></SidebarSvg>} onClick={() => {
                        updateSidebarVisible(!sidebarVisible);
                    }}></Button>
                </div>
            </div>
            <div style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                width: 0,
                backgroundColor: '#fff',
                padding: '4px'
            }}>
                {layoutTabs.map(item => renderContentByUrl(item))}
            </div>

        </div>
    </div>
});