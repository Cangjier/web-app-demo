import { Avatar, Button, Card, Dropdown } from "antd";
import { forwardRef } from "react";
import { IUserInfomation } from "../../services/interfaces";
import { Flex } from "../../natived";
import { UserOutlined } from "@ant-design/icons";
import AvaterSvg from "../../svgs/Avater.svg?react";
import Icon from "@ant-design/icons/lib/components/Icon";
import { clientServices } from "../../services/clientServices";

export interface IUserAvatarAppRef {

}

export interface IUserAvatarAppProps {
    onLogout?: () => Promise<void>,
    info: IUserInfomation,
    style?: React.CSSProperties
}

export const UserAvatarApp = forwardRef<IUserAvatarAppRef, IUserAvatarAppProps>((props, ref) => {
    if (props.info.isLogin) {
        return <Dropdown menu={{
            items: []
        }} popupRender={() => {
            return <Card style={{
                backgroundColor: '#e8e8e8'
            }}>
                <Flex direction='column' style={{ width: '280px' }}>
                    <Flex direction='row' verticalCenter spacing={'12px'} style={{
                        padding: '12px 16px',
                        // backgroundColor:'#ddd'
                    }}>
                        <Avatar icon={<UserOutlined />} src={props.info.avatar_url} shape={'circle'} size={'large'}></Avatar>
                        <div style={{ flex: 1 }}>{props.info.name}</div>
                    </Flex>
                    <Flex direction='column' style={{
                        padding: '8px'
                    }}>
                        <Flex style={{
                            padding: '4px 8px'
                        }}>
                            <div>{"Email"}</div>
                            <div style={{ flex: 1 }}></div>
                            <div >{props.info.email}</div>
                        </Flex>
                    </Flex>
                    <Button style={{
                        // padding: '8px'
                    }} onClick={props.onLogout}>{"Logout"}</Button>
                </Flex>
            </Card>
        }}>
            <Button type='text' icon={<Icon component={AvaterSvg}></Icon>}>{props.info.isLogin ? props.info.name : "Login"}</Button>
        </Dropdown>
    }
    else {
        return (
            <Button type='text' onClick={() => {
                let currentUrl = window.location.pathname;
                clientServices.openUrl(currentUrl + '/login', {
                    x: 'center',
                    y: "center",
                    width: 450,
                    height: 600
                },true);
            }} icon={<Icon component={AvaterSvg}></Icon>}>{props.info.isLogin ? props.info.name : "Login"}</Button>
        )
    }

})