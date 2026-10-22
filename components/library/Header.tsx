"use client";

import { FC } from "react";
import { Navbar, NavbarProps } from "@/components/layout/Navbar";

export type HeaderProps = NavbarProps;

export const Header: FC<HeaderProps> = (props) => {
  return <Navbar {...props} />;
};
