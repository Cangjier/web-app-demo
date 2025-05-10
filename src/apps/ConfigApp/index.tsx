import React, { forwardRef, JSX, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Flex, InjectClass, useUpdate } from "../../natived";
import { Button, Card, Input, List, Select, Switch, Table, TableColumnsType, Tabs } from "antd";
import { ResizeButton } from "../../natived/ui-lib/ResizeButton";
import { IMarkdownLine, MarkdownItem, MarkdownLine } from "../MarkdownApp";

export interface IConfigAppProps {
    markdownLines?: IMarkdownLine[],
    style?: React.CSSProperties,
}

export interface IConfigAppRef {
    getConfig: () => { [key: string]: any }
}

const tabClass = InjectClass(`
margin-left:10px;
`, {
    before: `

`
});

const hilightBarClass = InjectClass(`
background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,     /* 左侧完全透明 */
    rgba(0, 0, 0, 0) 00%,    /* 左侧透明占 40% */
    #0072C9 00%,              /* 中间区域为蓝色 */
    #0072C9 100%,              /* 中间区域蓝色持续到 60% */
    rgba(0, 0, 0, 0) 100%,     /* 右侧透明占 40% */
    rgba(0, 0, 0, 0) 100%    /* 右侧完全透明 */
);
`);

const findMarkdownLine = (lines: IMarkdownLine[], predicate: (value: MarkdownLine) => boolean): MarkdownLine | undefined => {
    let result = lines?.find(line => typeof (line) == 'object' && predicate(line as MarkdownLine));
    if (result != undefined) return result as MarkdownLine;
    return undefined;
}

export const ConfigApp = forwardRef<IConfigAppRef, IConfigAppProps>((props, ref) => {
    const [data, updateData, dataRef] = useUpdate<{ [key: string]: any }>({});
    const [leftDelta, setLeftDelta] = useUpdate<number>(0);
    const [currentTab, setCurrentTab, currentTabRef] = useUpdate<string | undefined>(undefined);
    const renderIcon = (icon: string) => {
        return <div></div>
    };

    const self = useRef<IConfigAppRef>({
        getConfig: () => {
            return dataRef.current;
        }
    });

    useImperativeHandle(ref, () => self.current);

    useEffect(() => {
        if (currentTab == undefined || currentTab == "") {
            setCurrentTab(findMarkdownLine(props.markdownLines ?? [], item => item.type == 'tab')?.text);
        }
    }, [props.markdownLines]);
    const getCurrentTabPropsMarkdownLine = () => {
        return findMarkdownLine(props.markdownLines ?? [], item => item.text == currentTab);
    };
    const getMarkdownLineText = (item: IMarkdownLine) => {
        if (typeof item == 'string') {
            return item;
        }
        else {
            return item.text ?? "";
        }
    };

    return <Flex direction='row'
        style={{
            backgroundColor: 'rgb(247, 247, 247)',
            ...props.style
        }}>
        <Flex direction='column' style={{
            width: `calc(${200}px + ${leftDelta}px)`,
            padding: '30px 25px 0px 50px'
        }} spacing={'4px'}>
            {props.markdownLines?.map((item, itemIndex) => {
                return <MarkdownItem items={props.markdownLines ?? []} item={item} path={getMarkdownLineText(item)} index={itemIndex} data={data} updateData={updateData} currentTab={currentTab} onTabChange={setCurrentTab} />
            })}
        </Flex>
        <ResizeButton onDeltaChange={setLeftDelta}></ResizeButton>
        <Flex style={{
            flex: 1,
            overflowY: 'auto'
        }} direction='column'>
            <Flex spacing={'4px'} style={{
                paddingInlineStart: '50px',
                paddingBlockStart: '50px',
                paddingInlineEnd: '50px',
                paddingBlockEnd: '50px',
            }} direction='column'>
                {
                    getCurrentTabPropsMarkdownLine()?.children?.map((item, itemIndex) => {
                        return <MarkdownItem items={getCurrentTabPropsMarkdownLine()?.children ?? []} item={item} path={getMarkdownLineText(item)} index={itemIndex} data={data} updateData={updateData} currentTab={currentTab} onTabChange={setCurrentTab} />
                    })
                }
            </Flex>
        </Flex>
    </Flex>
});