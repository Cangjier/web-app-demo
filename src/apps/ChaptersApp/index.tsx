import { forwardRef } from "react";

export interface IChaptersAppProps {
    style?: React.CSSProperties,
}

export interface IChaptersAppRef {

}

export const ChaptersApp = forwardRef<IChaptersAppRef, IChaptersAppProps>((props, ref) => {
    return <div>ChaptersApp</div>;
});
