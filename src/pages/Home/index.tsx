import React, { ReactNode, forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { Flex, InjectClass, useUpdate } from "../../natived";
import { Avatar, Button, Card, ConfigProvider, Dropdown, Spin } from "antd";
import { CloseOutlined, MinusOutlined, SettingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { localServices } from "../../services/localServices.ts";
import SidebarSvg from "../../svgs/Sidebar.svg?react";
import Icon from "@ant-design/icons/lib/components/Icon";
import { IUserInfomation } from "../../services/interfaces.ts";
import { UserAvatarApp } from "../../apps/UserAvatarApp";
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

    // refreshUserInfo: () => Promise<void>,
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
    const [loading, updateLoading, loadingRef] = useUpdate(false);
    const [loadingPercent, updateLoadingPercent, loadingPercentRef] = useUpdate<number | undefined>(undefined);
    const [loadingTip, updateLoadingTip, loadingTipRef] = useUpdate('');
    // const [userInfo, updateUserInfo] = useUpdate<IUserInfomation>({
    //     isLogin: false
    // });
    const [layoutTabs, updateLayoutTabs] = useUpdate<ILayoutTab[]>([]);
    const [currentTab, updateCurrentTab] = useUpdate<string>(localStorage.getItem('currentTab') ?? "documents");
    const delay = async (time: number) => new Promise(resolve => setTimeout(resolve, time));
    const self = useRef<IHomeRef>({
        // refreshUserInfo: async () => {
        //     let userInfo = await localServices.getUserInfo();
        //     updateUserInfo(userInfo);
        //     localStorage.setItem("login", JSON.stringify(userInfo));
        // },
        refresh: async (showLoading: boolean) => {
            if (showLoading) updateLoading(true);
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
                // await self.current?.refreshUserInfo();
            }
            catch (e) {
                console.log(e);
            }
            if (showLoading) {
                updateLoading(false);
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
    // useLocalStorageListener("login", data => {
    //     if (loadingRef.current) return;
    //     updateUserInfo(JSON.parse(data));
    // });
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

    return <Flex style={{
        ...props.style,
        backgroundColor: '#f4f4f4'
    }} direction='column'>
        <Spin size={'large'} tip={<div style={{
            marginTop: '32px'
        }}>{loadingTip}</div>} percent={loadingPercent} spinning={loading} fullscreen></Spin>
        {/* 顶部 */}
        <Flex direction='row' style={{ backgroundColor: '#fff', margin: '0px 0px 2px 0px', padding: '0px 0px 0px 4px' }}>
            <Flex verticalCenter style={{
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
            </Flex>

            <Flex className={dragClass} onMouseDown={e => {
                clientServices.mouseDownDrag();
                e.preventDefault();
                e.stopPropagation();
            }} style={{
                flex: 1,
                userSelect: 'none'
            }}>

            </Flex>
            <Flex spacing={'4px'} verticalCenter>
                {/* <UserAvatarApp onLogout={async () => {
                    updateLoading(true);
                    try {
                        await localServices.logout();
                        updateUserInfo({
                            isLogin: false
                        });
                    }
                    catch (e: any) {
                        console.log(e);
                    }
                    updateLoading(false);
                }} style={{ padding: '0px 4px' }} info={userInfo}></UserAvatarApp> */}
                <Button type='text' icon={<SettingOutlined />} onClick={() => {
                    let currentUrl = window.location.pathname;
                    clientServices.openUrl(currentUrl + '/settings', {
                        x: 'center',
                        y: "center",
                        width: '80%',
                        height: '80%'
                    },true);
                }}>{"Settings"}</Button>
                <Button type='text' icon={<MinusOutlined />} onClick={() => {
                    clientServices.minimize();
                }}>{"Minimize"}</Button>
                <Button type='text' icon={<CloseOutlined />} onClick={() => {
                    clientServices.close();
                }}>{"Close"}</Button>
            </Flex>

        </Flex>
        {/* 主体 */}
        <Flex style={{
            flex: 1,
            height: 0
        }} direction='row'>
            {/* 侧边 */}
            <Flex style={{
                width: sidebarVisible ? '120px' : '30px',
                backgroundColor: '#fff',
                margin: '0px 2px 0px 0px',
                padding: '0px 4px',
            }} direction='column' spacing={'8px'} spacingStart={'4px'}>
                <Flex direction='column' style={{
                    flex: 1,
                    alignItems: 'start',
                }}>
                    {layoutTabs.map(tab => renderTab(tab))}
                </Flex>
                <Flex>
                    <Button type='text' icon={<SidebarSvg></SidebarSvg>} onClick={() => {
                        updateSidebarVisible(!sidebarVisible);
                    }}></Button>
                </Flex>
            </Flex>
            {/* 内容 */}
            <Flex style={{
                flex: 1,
                width: 0,
                backgroundColor: '#fff',
                padding: '4px'
            }} direction='column'>
                {layoutTabs.map(item => renderContentByUrl(item))}
            </Flex>

        </Flex>
    </Flex>
});