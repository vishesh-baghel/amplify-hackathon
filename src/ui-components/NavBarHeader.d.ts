/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { Cart } from "../models";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { LogoWithTextProps } from "./LogoWithText";
import { FlexProps, ImageProps, TextProps } from "@aws-amplify/ui-react";
import { MyIconProps } from "./MyIcon";
import { SyntheticEvent } from "react";
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type NavBarHeaderOverridesProps = {
    NavBarHeader?: PrimitiveOverrideProps<FlexProps>;
    LogoWithText?: LogoWithTextProps;
    "Frame 32129767076"?: PrimitiveOverrideProps<FlexProps>;
    "All Collections"?: PrimitiveOverrideProps<TextProps>;
    Shirts?: PrimitiveOverrideProps<TextProps>;
    Tshirts?: PrimitiveOverrideProps<TextProps>;
    "Frame 32129767081"?: PrimitiveOverrideProps<FlexProps>;
    logout?: PrimitiveOverrideProps<TextProps>;
    MyIcon?: MyIconProps;
    image?: PrimitiveOverrideProps<ImageProps>;
} & EscapeHatchProps;
export declare type NavBarHeaderProps = React.PropsWithChildren<Partial<FlexProps> & {
    cartHandler?: (event: SyntheticEvent) => void;
    buttonLinks?: String;
    cartLink?: Cart;
    profileImage?: String;
} & {
    overrides?: NavBarHeaderOverridesProps | undefined | null;
}>;
export default function NavBarHeader(props: NavBarHeaderProps): React.ReactElement;
