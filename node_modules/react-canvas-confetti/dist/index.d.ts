import { CreateTypes, GlobalOptions, Options } from 'canvas-confetti';
import React, { CSSProperties } from 'react';
export interface IProps extends Options, GlobalOptions {
    fire?: any;
    reset?: any;
    width?: string | number;
    height?: string | number;
    className?: string;
    style?: CSSProperties;
    refConfetti?: (confetti: CreateTypes | null) => void;
    onDecay?: () => void;
    onFire?: () => void;
    onReset?: () => void;
}
export default class ReactCanvasConfetti extends React.Component<IProps> {
    private refCanvas;
    private confetti;
    constructor(props: IProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: Readonly<IProps>): void;
    componentWillUnmount(): void;
    private setRefConfetti;
    private unsetRefConfetti;
    private fireConfetti;
    private resetConfetti;
    render(): JSX.Element;
}
//# sourceMappingURL=index.d.ts.map