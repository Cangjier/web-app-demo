import { forwardRef } from "react";
import { ChaptersApp } from "../../apps/ChaptersApp";

export interface IChaptersProps {

}

export interface IChaptersRef {

}

export const Chapters = forwardRef<IChaptersRef, IChaptersProps>((props, ref) => {
    return <ChaptersApp></ChaptersApp>;
});
